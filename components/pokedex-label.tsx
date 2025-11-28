interface PokedexLabelProps {
  pokemonCount: number;
}

export function PokedexLabel({ pokemonCount }: PokedexLabelProps) {
  return (
    <div className="mb-4 sm:mb-6 bg-white rounded-lg p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-baseline gap-1 sm:gap-2">
          <h2 className="text-sm sm:text-base font-bold text-identity-dark tracking-wide">
            POKEDEX KANTO
          </h2>
          <span className="text-[10px] sm:text-xs font-medium text-medium tracking-wide">
            GEN I
          </span>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-medium">
          {pokemonCount} POKÉMON
        </div>
      </div>
    </div>
  );
}

