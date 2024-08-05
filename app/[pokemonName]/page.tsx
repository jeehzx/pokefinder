import { getPokemon } from "@/lib/pokemonAPI";
import { PokemonImage } from "@/components/pokemon-image";

import React from "react";

import Finder from "@/components/Finder";
import { Footer } from "@/components/sections";

// pokemonName = "eevee" => show the eevee page

export default async function PokemonPage({
  params,
}: {
  params: { pokemonName: string };
}) {
  const { pokemonName } = params;
  //get the API data for pokemon >>
  const pokemonObject = await getPokemon(pokemonName);

  return (
    <main className="relative">
      <Finder />
      <section className="w-full flex flex-1 xl:flex-row flex-col justify-center gap- my-4 max-container">
        <div className="max-container relative flex flex-col justify-center items-center w-full max-xl:padding-x pt-4 mb-2 max-container">
          <h1 className="text-white text-shadow-sm font-semibold text-[36px] font-montserrat shadow-2xl max-md:text-[24px] my-10">
            {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}
          </h1>
          <div
            className=" text-center pr-3 pl-3"
            style={{
              position: "relative",
              width: "300px",
              height: "300px",
            }}
          >
            <PokemonImage
              image={
                pokemonObject.sprites.other["official-artwork"].front_default
              }
              name={pokemonName}
            />
          </div>
        </div>
      </section>
      <div className="flex-wrap justify-center items-start text-center w-full mb-6 font-palanquin">
        <h3 className="text-white font-bold px-4 rounded-full"> Type: </h3>
        <div className=" card-types ">
          {pokemonObject?.types?.map((type: { type: { name: any } }) => {
            return (
              <span key={type.type.name} className={type.type.name}>
                {type.type.name}
              </span>
            );
          })}
        </div>
        <br></br>
        <div className="flex justify-center gap-2">
          <h3 className="font-bold text-[20px] text-white">Ability: </h3>
          {pokemonObject?.abilities?.map(
            (ability: { ability: { name: any } }) => {
              return (
                <p
                  key={ability.ability.name}
                  className="text-[18px] font-semibold"
                >
                  {" "}
                  {ability.ability.name},
                </p>
              );
            }
          )}
        </div>
      </div>
      <>
        {pokemonObject.stats.map((statObject: any) => {
          const statName = statObject.stat.name;
          const statValue = statObject.base_stat;
          return (
            <>
              <div className="w-full container m-auto">
                <div className="flex justify-between bg-red-800 px-4 py-2 mb-2 rounded-lg">
                  <span className="font-medium text-white dark:text-white items-start text-sm">
                    {statName}:
                  </span>
                  <div className="w-full pl-4 mt-1">
                    <div
                      className="bg-yellow-400 h-5 rounded-10"
                      style={{
                        width: `${(statObject.base_stat / 100) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium white dark:text-white items-end text-end">
                    {statValue}
                  </span>
                </div>
              </div>
            </>
          );
        })}
      </>

      <section className="bg-black w-full pb-4 mt-16">
        <Footer />
      </section>
    </main>
  );
}
