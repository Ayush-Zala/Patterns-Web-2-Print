import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { Page, Layout, Text, Card, Button, BlockStack, InlineStack, List } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const installation = await prisma.shopifyInstallation.findUnique({
    where: { shopDomain: session.shop },
    include: {
      workspace: true,
      integration: true,
    },
  });

  return {
    shopDomain: session.shop,
    installation,
  };
};

export default function Index() {
  const { shopDomain, installation } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const isConnected = installation?.status === 'ACTIVE';

  if (!isConnected) {
    return (
      <Page>
        <TitleBar title="Patterns Shopify Integration" />
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Status
                </Text>
                <Text as="p" variant="bodyMd" tone="critical">
                  Not Connected
                </Text>
                <hr style={{ borderTop: '1px solid var(--p-color-border)', margin: '16px 0' }} />
                <Text as="p" variant="bodyMd">
                  This Shopify store is not linked to a Patterns workspace. Click below to securely
                  connect.
                </Text>
                <InlineStack>
                  <Button variant="primary" url={`/connect?shop=${shopDomain}`} target="_top">
                    Connect Workspace
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const installedDate = installation.installedAt
    ? new Date(installation.installedAt).toLocaleDateString()
    : 'N/A';

  return (
    <Page>
      <TitleBar title="Patterns Shopify Integration" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Shopify Store
                  </Text>
                  <Text as="span" variant="bodyMd">
                    {shopDomain}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Workspace
                  </Text>
                  <Text as="span" variant="bodyMd">
                    {installation.workspace?.name || 'Unknown'}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Integration
                  </Text>
                  <Text as="span" variant="bodyMd">
                    Shopify
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Connection
                  </Text>
                  <Text as="span" variant="bodyMd" tone="success">
                    Connected
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Installed
                  </Text>
                  <Text as="span" variant="bodyMd">
                    {installedDate}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Last Verified
                  </Text>
                  <Text as="span" variant="bodyMd">
                    Today
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Data Source
                  </Text>
                  <Text as="span" variant="bodyMd">
                    Patterns CMS
                  </Text>
                </InlineStack>
              </BlockStack>

              <hr style={{ borderTop: '1px solid var(--p-color-border)' }} />

              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Products
                  </Text>
                  <Text as="span" variant="bodyMd" tone="success">
                    Live
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Categories
                  </Text>
                  <Text as="span" variant="bodyMd" tone="success">
                    Live
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Templates
                  </Text>
                  <Text as="span" variant="bodyMd" tone="success">
                    Live
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Assets
                  </Text>
                  <Text as="span" variant="bodyMd" tone="success">
                    Live
                  </Text>
                </InlineStack>
              </BlockStack>

              <hr style={{ borderTop: '1px solid var(--p-color-border)' }} />

              <InlineStack gap="300">
                <Button onClick={() => window.open('http://localhost:3000', '_blank')}>
                  View Workspace
                </Button>
                <Button onClick={() => window.open('http://localhost:3000', '_blank')}>
                  Open Patterns CMS
                </Button>
                <Button url={`/connect?shop=${shopDomain}`} target="_top">
                  Reconnect
                </Button>
                <Button
                  tone="critical"
                  onClick={() => submit({}, { method: 'POST', action: '/app/disconnect' })}
                >
                  Disconnect
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
