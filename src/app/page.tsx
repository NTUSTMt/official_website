import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Introduction from "@/components/Introduction";
import Quote from "@/components/Quote";
import { cmsService } from "@/services/cmsService";

export default async function Home() {
  const config = await cmsService.getConfig();

  return (
    <main className="min-h-screen">
      <div className="relative -mt-[100vh] h-screen z-20 pointer-events-none flex items-center justify-center">
        <Hero title={config.siteName} subtitle={config.heroSubtext} />
      </div>
      <Navbar 
        announcements={config.announcements} 
        className="-mt-[var(--nav-links-height,64px)]"
      />
      <div className="bg-background relative z-10">
        <Introduction content={config.introduction} />
        <Quote text={config.slogan} label={config.sloganLabel} />
      </div>
    </main>
  );
}
