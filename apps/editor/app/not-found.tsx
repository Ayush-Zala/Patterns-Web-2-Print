export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-heading-xl font-bold">404</h1>
      <h2 className="text-heading-m mt-4">Page Not Found</h2>
      <p className="text-muted mt-2">The page you are looking for does not exist.</p>
    </div>
  );
}
