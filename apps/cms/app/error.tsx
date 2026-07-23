"use client"

import * as React from "react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-4">
      <h2 className="text-heading-m font-bold">Something went wrong!</h2>
      <p className="mt-2 text-muted mb-6">An unexpected application error occurred.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-background rounded-md"
      >
        Try again
      </button>
    </div>
  )
}
