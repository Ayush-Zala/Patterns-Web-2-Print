import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';

@Injectable()
export class ShopifySyncService {
  private readonly logger = new Logger(ShopifySyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Syncs products from Shopify to the Patterns CMS.
   * This handles fetching products using the Shopify GraphQL API and mapping them to our schema.
   */
  async syncProductsToPatterns(workspaceId: string, integrationId: string): Promise<void> {
    this.logger.log(`Starting Shopify product sync for workspace ${workspaceId}`);

    // Get the installation to access the token
    const installation = await this.prisma.shopifyInstallation.findFirst({
      where: {
        workspaceId,
        integrationId,
        status: 'ACTIVE',
      },
    });

    if (!installation || !installation.shopifyAccessToken) {
      throw new Error(`Active Shopify installation not found for workspace ${workspaceId}`);
    }

    const { shopDomain, shopifyAccessToken } = installation;

    let hasNextPage = true;
    let cursor: string | null = null;
    let productsSynced = 0;

    try {
      while (hasNextPage) {
        // Fetch products using GraphQL API
        const graphqlQuery = `
          query getProducts($cursor: String) {
            products(first: 50, after: $cursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  title
                  descriptionHtml
                  variants(first: 1) {
                    edges {
                      node {
                        price
                      }
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(`https://${shopDomain}/admin/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopifyAccessToken,
          },
          body: JSON.stringify({
            query: graphqlQuery,
            variables: { cursor },
          }),
        });

        if (!response.ok) {
          throw new Error(`Shopify API error: ${response.statusText}`);
        }

        const data: any = await response.json();

        if (data.errors) {
          this.logger.error('Shopify GraphQL errors', data.errors);
          throw new Error('Failed to fetch products from Shopify');
        }

        const productsConnection = data.data.products;

        // Process batch
        for (const edge of productsConnection.edges) {
          const shopifyProduct = edge.node;

          // Map to Patterns schema
          const shopifyId = shopifyProduct.id;
          const priceStr = shopifyProduct.variants.edges[0]?.node?.price || '0';
          const priceCents = Math.round(parseFloat(priceStr) * 100);
          const imageUrl = shopifyProduct.images.edges[0]?.node?.url || null;

          // Upsert product in database
          // We use findFirst to check if it exists by sourceId
          const existingProduct = await this.prisma.product.findFirst({
            where: {
              workspaceId,
              sourceId: shopifyId,
              sourceType: 'SHOPIFY',
            },
          });

          if (existingProduct) {
            await this.prisma.product.update({
              where: { id: existingProduct.id },
              data: {
                title: shopifyProduct.title,
                description: shopifyProduct.descriptionHtml,
                price: priceCents,
                imageUrl,
                status: 'PUBLISHED', // Assume active for now
              },
            });
          } else {
            await this.prisma.product.create({
              data: {
                workspaceId,
                sourceId: shopifyId,
                sourceType: 'SHOPIFY',
                title: shopifyProduct.title,
                description: shopifyProduct.descriptionHtml,
                price: priceCents,
                imageUrl,
                status: 'PUBLISHED',
              },
            });
          }

          productsSynced++;
        }

        hasNextPage = productsConnection.pageInfo.hasNextPage;
        cursor = productsConnection.pageInfo.endCursor;
      }

      this.logger.log(
        `Completed syncing ${productsSynced} products from Shopify for workspace ${workspaceId}`,
      );
    } catch (error: any) {
      this.logger.error(`Failed to sync products from Shopify: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Syncs a single product from Patterns CMS up to Shopify.
   * This is used for Bi-directional sync when a product changes in the CMS.
   */
  async syncProductToShopify(workspaceId: string, productId: string): Promise<void> {
    this.logger.log(`Starting push sync to Shopify for product ${productId}`);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    if (product.sourceType !== 'SHOPIFY') {
      this.logger.debug(
        `Product ${productId} is not mapped to Shopify (SourceType: ${product.sourceType})`,
      );
      return;
    }

    // Find the shopify installation for this workspace
    const installation = await this.prisma.shopifyInstallation.findFirst({
      where: {
        workspaceId,
        status: 'ACTIVE',
      },
    });

    if (!installation || !installation.shopifyAccessToken) {
      throw new Error(`Active Shopify installation not found for workspace ${workspaceId}`);
    }

    const { shopDomain, shopifyAccessToken } = installation;
    const shopifyId = product.sourceId; // gid://shopify/Product/123456

    if (!shopifyId) {
      // Create new product in Shopify
      // Note: Full implementation of product creation in Shopify via GraphQL requires
      // mapping our model to Shopify's productInput. We'll do a basic create here.
      const mutation = `
        mutation productCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const response = await fetch(`https://${shopDomain}/admin/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              title: product.title,
              descriptionHtml: product.description || '',
              status: product.status === 'PUBLISHED' ? 'ACTIVE' : 'DRAFT',
            },
          },
        }),
      });

      const data: any = await response.json();
      if (data.data?.productCreate?.product?.id) {
        // Save the new shopify ID back to our DB
        await this.prisma.product.update({
          where: { id: product.id },
          data: { sourceId: data.data.productCreate.product.id, sourceType: 'SHOPIFY' },
        });
      }
      return;
    }

    // Update existing product in Shopify
    const mutation = `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(`https://${shopDomain}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyAccessToken,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            id: shopifyId,
            title: product.title,
            descriptionHtml: product.description || '',
          },
        },
      }),
    });

    const data: any = await response.json();
    if (data.data?.productUpdate?.userErrors?.length > 0) {
      this.logger.error('Failed to update product in Shopify', data.data.productUpdate.userErrors);
    } else {
      this.logger.log(`Successfully synced product ${productId} to Shopify`);
    }
  }
}
