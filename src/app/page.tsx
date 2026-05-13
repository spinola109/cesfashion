import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <Highlights />
      </main>
      <Footer />
    </>
  );
}
