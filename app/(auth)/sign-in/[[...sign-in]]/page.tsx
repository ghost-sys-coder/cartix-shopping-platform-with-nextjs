import { SignIn } from "@clerk/nextjs";
import { ClerkAuthLayout } from "@/components/auth/clerk-auth-layout";
import { clerkAuthAppearance } from "@/components/auth/clerk-appearance";

export default function SignInPage() {
  return (
    <ClerkAuthLayout mode="sign-in">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/api/auth/sync?redirect=/"
        appearance={clerkAuthAppearance}
      />
    </ClerkAuthLayout>
  );
}
