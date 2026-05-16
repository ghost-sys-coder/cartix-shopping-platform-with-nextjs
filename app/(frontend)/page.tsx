import { HomePage } from "@/components/frontend/home/home-page";
import { getHomePageData } from "@/lib/home/home-data";

export const dynamic = "force-dynamic";

export default async function FrontendHomePage() {
  const data = await getHomePageData();

  return <HomePage data={data} />;
}
