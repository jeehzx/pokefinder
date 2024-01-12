import { getPokemon } from "@/lib/pokemonAPI";
import { PokemonImage } from "@/components/pokemon-image";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

import Finder from '@/components/Finder'
import { Footer } from "@/components/sections"

// pokemonName = "eevee" => show the eevee page

export default async function PokemonPage({params}: { params: { pokemonName: string };
}) {
  const { pokemonName } = params;
  //get the API data for pokemon >>
  const pokemonObject = await getPokemon(pokemonName);

  return (
    <>
    <main className="relative">
      <Finder />
    <section className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container">
      <div className="relative xl:w-2/5 flex flex-col justify-center items-center w-full max-xl:padding-x pt-28 padding-x mb-6">
        <h1 className="text-white text-shadow-sm font-semibold text-[36px] font-montserrat shadow-2xl">
          {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}
        </h1>
        <div
          className="m-4 text-center"
          style={{
            position: "relative",
            width: "250px",
            height: "250px",
          }}
        >
          <PokemonImage
            image={pokemonObject.sprites.other["official-artwork"].front_default}
            name={pokemonName}
          />
        </div>
        <div className="text-center font-semibold font-palanquin">
          <br></br>
          <h3>Weight: {pokemonObject.weight}</h3>
          <br></br>
        </div>
        <div className="flex-col grid place-content-center transition-colors dark:border-gray-500 hover:border-gray-300 hover:bg-red-800 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 border-transparent rounded-lg font-palanquin">
          {pokemonObject.stats.map((statObject: any) => {
            const statName = statObject.stat.name;
            const statValue = statObject.base_stat;
            return (
              <div className="flex items-stretch font-semibold sm:flex-col max-sm:text-center" style={{ width: "500px"}} key={statName}>
                <h3 className="p-3 w-2/4">
                  {statName}: {statValue}
                </h3>
                <Progress value={statValue} className="w-2/4 m-auto z-10"/>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    <section className="bg-black padding-x pb-4">
      <Footer />
    </section>
          </main>
    </>
  );
}