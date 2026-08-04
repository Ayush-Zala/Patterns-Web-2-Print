import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Find the installation to disconnect
  const installation = await prisma.shopifyInstallation.findUnique({
    where: { shopDomain: session.shop },
  });

  if (!installation) {
    return new Response('Installation not found', { status: 404 });
  }

  // Disconnect simply updates the status, leaving tokens and history intact
  await prisma.shopifyInstallation.update({
    where: { shopDomain: session.shop },
    data: {
      status: 'DISCONNECTED',
    },
  });

  return redirect('/app');
};
