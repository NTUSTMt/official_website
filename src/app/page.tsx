import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import Quote from "@/components/Quote";
import { cmsService } from "@/services/cmsService";

export default async function Home() {
  const config = await cmsService.getConfig();

  return (
    <main className="min-h-screen">
      <Hero />
      <Navbar announcement={config.announcement} />
      <Features />
      <Quote />
    </main>
  );
}
