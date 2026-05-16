import { Navbar } from "@/components/frontend/navbar";
import { Footer } from "@/components/frontend/footer";
import { CartDrawer } from "@/components/frontend/cart-drawer";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
