import { Main, Footer } from "@/components/sections";
import Finder from "@/components/Finder";

const Inicial = () => (
  <main className="relative">
    <Finder />
    <section className="h-full flex flex-col padding-b mb-56 mt-20 ml-6 mr-6">
      <Main />
    </section>
    <section className="bg-black w-full mt-16">
      <Footer />
    </section>
  </main>
);

export default Inicial;
