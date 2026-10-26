import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Work />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
