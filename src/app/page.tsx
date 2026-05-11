import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import Rules from "@/components/Rules";
import Quote from "@/components/Quote";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Navbar />
      <Features />
      <Rules />
      <Quote />
    </main>
  );
}
