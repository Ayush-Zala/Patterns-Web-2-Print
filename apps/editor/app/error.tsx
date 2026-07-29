'use client';

import * as React from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="text-heading-m font-bold">Something went wrong!</h2>
      <p className="text-muted mt-2 mb-6">An unexpected application error occurred.</p>
      <button onClick={() => reset()} className="bg-primary text-background rounded-md px-4 py-2">
        Try again
      </button>
    </div>
  );
}
