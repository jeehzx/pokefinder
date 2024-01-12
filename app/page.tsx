import { Main, Footer } from "@/components/sections"
import Finder from "@/components/Finder"

const Inicial = () => (
  <main className="relative">
    <Finder />
    <section className="x1:padding-1 wide:padding-r padding-b">
      <Main />
    </section>
    <section className="bg-black padding-x pb-4 h-full">
      <Footer />
    </section>
  </main>
)

export default Inicial
