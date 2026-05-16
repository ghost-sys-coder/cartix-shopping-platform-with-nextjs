import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface ClerkAuthLayoutProps {
  children: ReactNode;
  mode: "sign-in" | "sign-up";
}

export function ClerkAuthLayout({ children, mode }: ClerkAuthLayoutProps) {
  const isSignIn = mode === "sign-in";

  return (
    <main className="min-h-screen bg-[#eef5f8] text-foreground lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <section className="relative min-h-[320px] overflow-hidden bg-[#d7e7f0] lg:min-h-screen">
        <Image
          src="/assets/home-hero-section.png"
          alt="Cartix storefront preview"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 54vw"
          className="object-cover object-left-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#eef5f8]/20 via-transparent to-[#eef5f8]/80 lg:to-[#eef5f8]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eef5f8] to-transparent lg:h-64" />

        <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-white/85 px-4 py-2 text-xl font-headline font-black tracking-tight text-[#346482] shadow-sm backdrop-blur"
          >
            Cartix
          </Link>
        </div>

        <div className="absolute bottom-8 left-5 right-5 max-w-xl sm:left-8 sm:right-8 lg:bottom-12">
          <div className="rounded-[1.25rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-[#346482]/10 backdrop-blur-md sm:p-6">
            <p className="text-sm font-label font-semibold text-[#346482]">
              {isSignIn ? "Welcome back" : "Create your Cartix account"}
            </p>
            <h1 className="mt-2 text-3xl font-headline font-black leading-tight tracking-tight text-[#0b1115] sm:text-4xl">
              Velocity meets vision.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#53626b] sm:text-base">
              Shop faster, manage orders, and keep your Cartix experience synced
              across every device.
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-320px)] items-center justify-center px-5 py-10 sm:px-8 lg:min-h-screen lg:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link
              href="/"
              className="text-2xl font-headline font-black tracking-tight text-[#346482] lg:hidden"
            >
              Cartix
            </Link>
            <h2 className="mt-5 text-3xl font-headline font-black tracking-tight text-[#0b1115] lg:mt-0">
              {isSignIn ? "Sign in" : "Sign up"}
            </h2>
            <p className="mt-2 text-sm text-[#5f6d75]">
              {isSignIn
                ? "Continue to your account with Clerk secure authentication."
                : "Join Cartix with Clerk secure authentication."}
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">{children}</div>
        </div>
      </section>
    </main>
  );
}
