import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WishlistPage } from "@/components/frontend/wishlist/wishlist-page";
import { getCurrentWishlistData } from "@/lib/wishlist/wishlist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View and manage products saved to your Cartix wishlist.",
};

export default async function AccountWishlistPage() {
  const wishlist = await getCurrentWishlistData();

  if (!wishlist) {
    redirect("/sign-in?redirect_url=/account/wishlist");
  }

  return <WishlistPage wishlist={wishlist} />;
}
