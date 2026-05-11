import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Rules from "@/components/Rules";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Editorial Quote Section */}
      <section className="py-40 bg-surface relative overflow-hidden flex items-center justify-center text-center px-6 border-y border-border">
        <div 
          className="absolute inset-0 opacity-10 bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <div className="relative z-10 max-w-4xl">
          <h3 className="text-4xl md:text-6xl font-display italic leading-tight mb-8">
            “ 登山不是為了征服山，<br />
            實是為了在山的懷抱中，學會謙卑與誠實。 ”
          </h3>
          <div className="font-mono text-[10px] tracking-[0.4em] text-accent uppercase font-bold">
            Wilderness_Philosophy
          </div>
        </div>
      </section>

      <Rules />
      <Footer />
    </main>
  );
}
