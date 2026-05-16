import { SignUp } from "@clerk/nextjs";
import { ClerkAuthLayout } from "@/components/auth/clerk-auth-layout";
import { clerkAuthAppearance } from "@/components/auth/clerk-appearance";

export default function SignUpPage() {
  return (
    <ClerkAuthLayout mode="sign-up">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/api/auth/sync?redirect=/"
        appearance={clerkAuthAppearance}
      />
    </ClerkAuthLayout>
  );
}
