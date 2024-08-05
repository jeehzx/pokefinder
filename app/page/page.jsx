import { PokemonGrid } from "@/components/pokemon-grid";
import { getPokemonList } from "@/lib/pokemonAPI";
import { Footer } from "@/components/sections";

import Finder from "@/components/Finder";

export default async function Home() {
  const pokemonList = await getPokemonList();
  return (
    <main className="relative">
      <Finder />
      <section className="x1:padding-1 wide:padding-r padding-b">
        <div>
          <PokemonGrid pokemonList={pokemonList} />
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </main>
  );
}
