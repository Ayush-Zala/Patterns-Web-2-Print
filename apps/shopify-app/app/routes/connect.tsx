import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return new Response('Missing shop parameter', { status: 400 });
  }

  // Determine the URL for the Patterns application
  // During dev, this might be localhost:3000 where the CMS/Website runs
  const patternsUrl = process.env.PATTERNS_APP_URL || 'http://localhost:3002';

  // The redirect URL that Patterns should send the merchant back to after linking
  const redirectUri = `${process.env.SHOPIFY_APP_URL}/callback`;

  // Redirect the merchant to the Patterns login and workspace selection flow
  return redirect(
    `${patternsUrl}/oauth/shopify?shop=${shop}&redirect_uri=${encodeURIComponent(redirectUri)}`,
  );
};
