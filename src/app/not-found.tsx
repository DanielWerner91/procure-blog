import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
        <div className="mb-4 text-5xl">🔍</div>
        <h1 className="mb-2 text-2xl font-semibold text-card-foreground">
          Article not found
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          This page doesn&apos;t exist. The article may have been removed or the
          URL might be incorrect.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Back to latest news
        </Link>
      </div>
    </div>
  );
}
