"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { translate, translateItemName } from "@/lib/translations";

interface EvolutionDetails {
  min_level?: number;
  item?: { name: string };
  time_of_day?: string;
  location?: string;
  min_happiness?: number;
  min_beauty?: number;
  min_affection?: number;
  known_move_type?: string;
  trigger?: { name: string };
  gender?: number;
  held_item?: { name: string };
  needs_overworld_rain?: boolean;
  turn_upside_down?: boolean;
}

interface EvolutionPokemon {
  id: number;
  name: string;
  details: EvolutionDetails | null;
  animatedSprite?: string | null;
  staticSprite?: string | null;
  itemSprite?: string | null;
  evolvesTo: EvolutionPokemon[];
}

interface EvolutionChainProps {
  evolutionData: EvolutionPokemon | null;
  currentPokemonId: number;
}

export function EvolutionChain({ evolutionData, currentPokemonId }: EvolutionChainProps) {
  if (!evolutionData || evolutionData.evolvesTo.length === 0) {
    return (
      <div className="w-full text-center py-6 sm:py-8">
        <p className="text-medium text-sm">Este Pokémon não evolui.</p>
      </div>
    );
  }

  const formatItemName = (itemName: string | null | undefined) => {
    if (!itemName || typeof itemName !== 'string') {
      return '';
    }
    return translateItemName(itemName);
  };

  const getRequirementText = (details: EvolutionDetails | null): string => {
    if (!details) return translate('Level up');

    if (details.item?.name) {
      return formatItemName(details.item.name);
    }

    if (details.held_item?.name) {
      return formatItemName(details.held_item.name);
    }

    if (details.min_level) {
      return `Nv.${details.min_level}`;
    }

    if (details.min_happiness) {
      return `${translate('Happiness')} ${details.min_happiness}+`;
    }

    if (details.time_of_day) {
      return details.time_of_day === 'day' ? translate('Day') : translate('Night');
    }

    return translate('Level up');
  };

  const PokemonDisplay = ({ pokemon, isCurrent }: { pokemon: EvolutionPokemon; isCurrent: boolean }) => (
    <Link
      href={`/${pokemon.name}`}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80 flex-shrink-0",
        isCurrent && "opacity-100"
      )}
    >
      <img
        src={pokemon.animatedSprite || pokemon.staticSprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
        alt={pokemon.name}
        className="object-contain"
        style={{
          imageRendering: pokemon.animatedSprite ? 'auto' : 'pixelated',
          width: pokemon.animatedSprite ? '48px' : '56px',
          height: pokemon.animatedSprite ? '48px' : '56px',
          maxWidth: pokemon.animatedSprite ? '48px' : '56px',
          maxHeight: pokemon.animatedSprite ? '48px' : '56px',
          minWidth: pokemon.animatedSprite ? '48px' : '56px',
          minHeight: pokemon.animatedSprite ? '48px' : '56px',
        }}
        onError={(e) => {
          if (pokemon.animatedSprite && pokemon.staticSprite) {
            (e.target as HTMLImageElement).src = pokemon.staticSprite;
            (e.target as HTMLImageElement).style.imageRendering = 'pixelated';
            (e.target as HTMLImageElement).style.width = '64px';
            (e.target as HTMLImageElement).style.height = '64px';
          }
        }}
      />
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-identity-dark font-semibold text-xs text-center">
          {pokemon.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
        </span>
        <span className="text-medium text-[10px]">
          #{pokemon.id.toString().padStart(3, "0")}
        </span>
      </div>
    </Link>
  );

  // Se há múltiplas evoluções (como Eevee), mostrar em formato ramificado
  if (evolutionData.evolvesTo.length > 1) {
    return (
      <div className="w-full flex flex-col items-center gap-5 sm:gap-6 py-4 sm:py-6 px-2">
        {/* Pokémon Base */}
        <PokemonDisplay pokemon={evolutionData} isCurrent={evolutionData.id === currentPokemonId} />
        
        {/* Setas para baixo */}
        <ArrowDown className="w-4 h-4 text-medium flex-shrink-0" />
        
        {/* Evoluções ramificadas */}
        <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-8 w-full">
          {evolutionData.evolvesTo.map((evo, index) => {
            const requirement = getRequirementText(evo.details);
            const hasNextEvo = evo.evolvesTo.length > 0;
            const hasItem = evo.details?.item?.name || evo.details?.held_item?.name;
            
            return (
              <div key={evo.id} className="flex flex-col items-center gap-2.5">
                {/* Requisito com sprite do item se houver */}
                <div className="flex flex-col items-center gap-1.5">
                  {evo.itemSprite ? (
                    <div className="flex flex-col items-center gap-1">
                      <img 
                        src={evo.itemSprite} 
                        alt={requirement}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-[10px] text-medium font-medium text-center">
                        {requirement}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-medium font-medium text-center">
                      {requirement}
                    </span>
                  )}
                </div>
                
                {/* Seta */}
                <ArrowDown className="w-3 h-3 text-medium flex-shrink-0" />
                
                {/* Pokémon Evoluído */}
                <PokemonDisplay pokemon={evo} isCurrent={evo.id === currentPokemonId} />
                
                {/* Próxima evolução se houver */}
                {hasNextEvo && evo.evolvesTo.map((nextEvo) => {
                  const nextRequirement = getRequirementText(nextEvo.details);
                  const hasNextItem = nextEvo.details?.item?.name || nextEvo.details?.held_item?.name;
                  return (
                    <div key={nextEvo.id} className="flex flex-col items-center gap-2.5 mt-1">
                      <ArrowDown className="w-3 h-3 text-medium flex-shrink-0" />
                      {nextEvo.itemSprite ? (
                        <div className="flex flex-col items-center gap-1">
                          <img 
                            src={nextEvo.itemSprite} 
                            alt={nextRequirement}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-[10px] text-medium font-medium text-center">
                            {nextRequirement}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-[10px] text-medium font-medium">
                            {nextRequirement}
                          </span>
                        </div>
                      )}
                      <ArrowDown className="w-3 h-3 text-medium flex-shrink-0" />
                      <PokemonDisplay pokemon={nextEvo} isCurrent={nextEvo.id === currentPokemonId} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Evolução simples (linear)
  const renderLinearEvolution = (pokemon: EvolutionPokemon, isFirst: boolean = false): JSX.Element => {
    const isCurrent = pokemon.id === currentPokemonId;
    const requirement = getRequirementText(pokemon.details);
    
    return (
      <div key={pokemon.id} className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
        {!isFirst && (
          <>
            <ArrowRight className="w-4 h-4 text-medium flex-shrink-0" />
            {pokemon.itemSprite ? (
              <div className="flex items-center gap-1.5">
                <img 
                  src={pokemon.itemSprite} 
                  alt={requirement}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-[10px] text-medium font-medium whitespace-nowrap">
                  {requirement}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-medium font-medium whitespace-nowrap">
                {requirement}
              </span>
            )}
            <ArrowRight className="w-4 h-4 text-medium flex-shrink-0" />
          </>
        )}
        
        <PokemonDisplay pokemon={pokemon} isCurrent={isCurrent} />
        
        {pokemon.evolvesTo.length > 0 && pokemon.evolvesTo.map(nextEvo => 
          renderLinearEvolution(nextEvo, false)
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex items-center justify-center py-4 sm:py-6 px-4">
      <div className="w-full flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
        {renderLinearEvolution(evolutionData, true)}
      </div>
    </div>
  );
}
