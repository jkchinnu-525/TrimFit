import Hero from "@/components/Hero";
import Linegradient from "@/components/Linegradient";
import Footer from "@/components/Footer";
import Aboutus from "@/components/Aboutus";
import Pricing from "@/components/Pricing";
import Section from "@/components/Section";
import Header from "@/components/Header";
import Template from "@/Effects/Transition";
import ScrollEffect from "@/Effects/Scroll";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <ScrollEffect>
      <Template>
        <Header />
        <Section />
        <Hero />
        <Aboutus />
        <Pricing />
        <FAQ />
        <Linegradient />
        <Footer />
      </Template>
    </ScrollEffect>
  );
}
