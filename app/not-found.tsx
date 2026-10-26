import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">404</p>
      <h1 className="text-gradient mt-4 text-5xl font-semibold md:text-7xl">Lost in latent space.</h1>
      <p className="mt-4 max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist — or it hasn&apos;t shipped yet.</p>
      <Link href="/" className="mt-10 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90">
        Back home
      </Link>
    </main>
  );
}
