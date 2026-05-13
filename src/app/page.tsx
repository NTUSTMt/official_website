import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Introduction from "@/components/Introduction";
import Quote from "@/components/Quote";
import { cmsService } from "@/services/cmsService";

export default async function Home() {
  const config = await cmsService.getConfig();

  return (
    <main className="min-h-screen bg-background">
      <Hero title={config.siteName} subtitle={config.heroSubtext} />
      <Navbar announcement={config.announcement} />
      <Introduction content={config.introduction} />
      <Quote text={config.slogan} label={config.sloganLabel} />
    </main>
  );
}
