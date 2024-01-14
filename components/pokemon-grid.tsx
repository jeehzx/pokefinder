"use client"
import { PokemonCard } from "./pokemon-card"
import { useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

interface PokemonGridProps {
  pokemonList: any
}

export function PokemonGrid({ pokemonList }: PokemonGridProps ) {
  const [searchText, setSearchText] = useState("")

  const searchFilter = (pokemonList: any) => {
    return pokemonList.filter((pokemon: any) =>
      pokemon.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  const filteredPokemonList = searchFilter(pokemonList)

  return (
    <>
    <section className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container">
      <div className="relative xl:w-2/5 flex flex-col justify-center items-center w-full max-xl:padding-x pt-28 padding-x" >
        <h3 className="text-lg py-6 text-center font-mono">
          Nome:
        </h3>
        <div className="text-center">
          <Label htmlFor="pokemonName"> </Label>
          <input
            type="text"
            value={searchText}
            autoComplete="off"
            id="pokemonName"
            placeholder=" Pikachu, Eevee, etc..."
            onChange={(e) => setSearchText(e.target.value)}
            />
        </div>
      <div>
        <h3 className="text-4x1 text-lg pt-12 pb-6 text-center font-mono">
          Pokémon Collection
        </h3>
      </div>
      <div className="grid text-center lg:mb-0 lg:grid-cols-4 gap-1.5">
        {filteredPokemonList.map((pokemon: any) => {
          return <PokemonCard name={pokemon.name} key={pokemon.name} />
        })}
      </div>
        </div>
      </section>
    </>
  )
}
