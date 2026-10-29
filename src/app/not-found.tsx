import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
        404
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-neutral-900 sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-lg text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="press mt-10 rounded-full bg-violet-600 px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-500/30"
      >
        Back to home
      </Link>
    </main>
  );
}
