import type { ActionFunctionArgs } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import db from '../db.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    await db.shopifySession.deleteMany({ where: { shop } });
  }

  // Find the installation and mark it as uninstalled, stripping tokens
  const installation = await db.shopifyInstallation.findUnique({
    where: { shopDomain: shop },
  });

  if (installation) {
    await db.shopifyInstallation.update({
      where: { shopDomain: shop },
      data: {
        status: 'UNINSTALLED',
        shopifyAccessToken: null,
        patternsConnectionToken: '',
        uninstalledAt: new Date(),
      },
    });
  }

  return new Response();
};
