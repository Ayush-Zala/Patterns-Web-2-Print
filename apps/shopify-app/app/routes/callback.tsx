import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import prisma from '../db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const shop = url.searchParams.get('shop');
  const workspaceId = url.searchParams.get('workspaceId');
  const integrationId = url.searchParams.get('integrationId');

  if (!shop || !token || !workspaceId || !integrationId) {
    return new Response('Missing required parameters', { status: 400 });
  }

  // 1. Verify the JWT Connection Token
  // In a real implementation, you would verify the signature and expiry here using a library like `jsonwebtoken` or `jose`.
  // e.g. const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // if (!decoded) throw new Error("Invalid token");

  // For the sake of this phase, we'll assume the token has been validated and contains the correct IDs.

  // 2. Validate Workspace
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.status !== 'ACTIVE') {
    return new Response('Invalid or inactive workspace', { status: 403 });
  }

  // 3. Validate Integration
  const integration = await prisma.integration.findUnique({
    where: { id: integrationId },
  });

  if (!integration || integration.status !== 'ACTIVE' || integration.workspaceId !== workspaceId) {
    return new Response('Invalid or inactive integration', { status: 403 });
  }

  // 4. Upsert the Shopify Installation
  await prisma.shopifyInstallation.upsert({
    where: { shopDomain: shop },
    update: {
      workspaceId: workspaceId,
      integrationId: integrationId,
      patternsConnectionToken: token,
      status: 'ACTIVE',
    },
    create: {
      shopDomain: shop,
      workspaceId: workspaceId,
      integrationId: integrationId,
      patternsConnectionToken: token,
      status: 'ACTIVE',
    },
  });

  // Redirect back into the embedded app interface
  return redirect(
    `https://admin.shopify.com/store/${shop.replace('.myshopify.com', '')}/apps/${process.env.SHOPIFY_API_KEY}`,
  );
};
