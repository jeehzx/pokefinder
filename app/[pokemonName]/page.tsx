import { getPokemon } from "@/lib/pokemonAPI";
import { PokemonImage } from "@/components/pokemon-image";
import { TypeBadge } from "@/components/type-badge";
import { Tabs } from "@/components/tabs";
import { EvolutionChain } from "@/components/evolution-chain";
import Finder from "@/components/Finder";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { translate, translateStatName, translateEggGroup, translateAbilityName } from "@/lib/translations";

const POKEMON_API = "https://pokeapi.co/api/v2/";

function capitalizePokemonName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function getPokemonSpecies(id: number) {
  try {
    const response = await fetch(`${POKEMON_API}pokemon-species/${id}`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    if (!response.ok) throw new Error('Failed to fetch species');
    return response.json();
  } catch (error) {
    console.error('Error fetching species:', error);
    return null;
  }
}

async function getEvolutionChain(url: string) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    if (!response.ok) throw new Error('Failed to fetch evolution chain');
    return response.json();
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    return null;
  }
}

async function getItemSprite(itemName: string) {
  try {
    const response = await fetch(`${POKEMON_API}item/${itemName}`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.sprites?.default || null;
  } catch (error) {
    console.error(`Error fetching item sprite for ${itemName}:`, error);
    return null;
  }
}

export default async function PokemonPage({
  params,
}: {
  params: { pokemonName: string };
}) {
  const { pokemonName } = params;
  
  try {
    const pokemonObject = await getPokemon(pokemonName);
    if (!pokemonObject) {
      throw new Error('Pokemon not found');
    }
    
    const pokemonId = pokemonObject.id;
    const prevId = pokemonId > 1 ? pokemonId - 1 : 151;
    const nextId = pokemonId < 151 ? pokemonId + 1 : 1;
    
    // Buscar dados adicionais em paralelo
    const [species, prevPokemon, nextPokemon] = await Promise.all([
      getPokemonSpecies(pokemonObject.id),
      getPokemon(prevId.toString()),
      getPokemon(nextId.toString()),
    ]);
    
    // Descrição em português (tentar diferentes versões e idiomas)
    let description = "Descrição não disponível.";
    
    if (species?.flavor_text_entries && species.flavor_text_entries.length > 0) {
      // Priorizar português brasileiro, depois português, depois inglês
      // Tentar diferentes versões do jogo para encontrar descrições em português
      const ptBrEntries = species.flavor_text_entries.filter(
        (entry: any) => entry.language.name === "pt-BR"
      );
      const ptEntries = species.flavor_text_entries.filter(
        (entry: any) => entry.language.name === "pt"
      );
      const enEntries = species.flavor_text_entries.filter(
        (entry: any) => entry.language.name === "en"
      );
      
      // Usar a primeira disponível na ordem de prioridade
      // Priorizar versões mais recentes (últimas no array geralmente são mais recentes)
      if (ptBrEntries.length > 0) {
        description = ptBrEntries[ptBrEntries.length - 1].flavor_text;
      } else if (ptEntries.length > 0) {
        description = ptEntries[ptEntries.length - 1].flavor_text;
      } else if (enEntries.length > 0) {
        // Se só tiver em inglês, usar a mais recente
        description = enEntries[enEntries.length - 1].flavor_text;
      }
    }
    
    // Altura e peso (em metros e kg)
    const height = (pokemonObject.height / 10).toFixed(1);
    const weight = (pokemonObject.weight / 10).toFixed(1);
    
    // Egg groups
    const eggGroups = species?.egg_groups?.map((group: any) => group.name) || [];
    
    // Processar cadeia de evolução mantendo estrutura hierárquica
    let evolutionData: any = null;
    if (species?.evolution_chain?.url) {
      const evolutionChain = await getEvolutionChain(species.evolution_chain.url);
      if (evolutionChain?.chain) {
        const processEvolutionChain = (chain: any): any => {
          const pokemonId = parseInt(chain.species.url.split('/').slice(-2, -1)[0]);
          
          // Filtrar apenas Gen I
          if (pokemonId < 1 || pokemonId > 151) {
            return null;
          }
          
          const basePokemon = {
            name: chain.species.name,
            id: pokemonId,
            details: null,
            evolvesTo: [] as any[],
          };
          
          if (chain.evolves_to && chain.evolves_to.length > 0) {
            chain.evolves_to.forEach((evolution: any) => {
              const evoId = parseInt(evolution.species.url.split('/').slice(-2, -1)[0]);
              
              // Filtrar apenas Gen I
              if (evoId >= 1 && evoId <= 151) {
                const evoDetails = evolution.evolution_details?.[0] || null;
                const evolvedPokemon = {
                  name: evolution.species.name,
                  id: evoId,
                  details: evoDetails,
                  evolvesTo: [] as any[],
                };
                
                // Processa próximas evoluções recursivamente
                if (evolution.evolves_to && evolution.evolves_to.length > 0) {
                  evolution.evolves_to.forEach((nextEvolution: any) => {
                    const nextEvoId = parseInt(nextEvolution.species.url.split('/').slice(-2, -1)[0]);
                    if (nextEvoId >= 1 && nextEvoId <= 151) {
                      const nextEvoDetails = nextEvolution.evolution_details?.[0] || null;
                      evolvedPokemon.evolvesTo.push({
                        name: nextEvolution.species.name,
                        id: nextEvoId,
                        details: nextEvoDetails,
                        evolvesTo: [],
                      });
                    }
                  });
                }
                
                basePokemon.evolvesTo.push(evolvedPokemon);
              }
            });
          }
          
          return basePokemon;
        };
        
        evolutionData = processEvolutionChain(evolutionChain.chain);
        
        // Buscar sprites para todos os Pokémon na cadeia e itens
        const fetchSprites = async (pokemon: any): Promise<any> => {
          try {
            const pokemonData = await getPokemon(pokemon.id.toString());
            const animatedSprites = pokemonData.sprites.versions?.["generation-v"]?.["black-white"]?.animated;
            
            // Buscar sprite do item se houver
            let itemSprite = null;
            if (pokemon.details?.item?.name) {
              itemSprite = await getItemSprite(pokemon.details.item.name);
            } else if (pokemon.details?.held_item?.name) {
              itemSprite = await getItemSprite(pokemon.details.held_item.name);
            }
            
            return {
              ...pokemon,
              animatedSprite: animatedSprites?.front_default || null,
              staticSprite: pokemonData.sprites.other?.["official-artwork"]?.front_default || 
                           pokemonData.sprites.front_default || null,
              itemSprite: itemSprite,
              evolvesTo: await Promise.all(pokemon.evolvesTo.map(fetchSprites)),
            };
          } catch (error) {
            console.error(`Error fetching sprite for ${pokemon.name}:`, error);
            return {
              ...pokemon,
              animatedSprite: null,
              staticSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
              itemSprite: null,
              evolvesTo: await Promise.all(pokemon.evolvesTo.map(fetchSprites)),
            };
          }
        };
        
        if (evolutionData) {
          evolutionData = await fetchSprites(evolutionData);
        }
      }
    }

  return (
    <main 
      className="min-h-screen relative w-full overflow-hidden"
      style={{
        backgroundImage: "url('/pokeball-bg.webp')",
        backgroundSize: "contain",
        backgroundPosition: "top left",
        backgroundRepeat: "repeat",
        backgroundAttachment: "scroll",
        backgroundColor: "#e84a44",
      }}
    >

      {/* Header com logo */}
      <div className="w-full pt-6 pb-4 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <Finder />
        </div>
      </div>

      {/* Container principal */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-8 relative z-10">
        {/* Primeiro container - Topo com navegação */}
        <div className="mb-6 w-full">
          {/* Barra superior: Voltar | Nome | #ID */}
          <div className="flex items-center justify-between mb-4 sm:mb-8 w-full max-w-2xl mx-auto relative">
            <Link 
              href="/page"
              className="flex items-center gap-1 sm:gap-2 text-white hover:opacity-80 transition-opacity flex-shrink-0 z-10"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-xs sm:text-sm md:text-base hidden sm:inline">Voltar para a Pokedex</span>
              <span className="font-semibold text-xs sm:hidden">Voltar</span>
            </Link>
            
            <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold drop-shadow-lg absolute left-1/2 transform -translate-x-1/2 px-2 text-center">
              {capitalizePokemonName(pokemonName)}
            </h1>
            
            <span className="text-white text-sm sm:text-base md:text-xl lg:text-2xl font-semibold flex-shrink-0 z-10">
              #{pokemonId.toString().padStart(3, "0")}
            </span>
          </div>

          {/* Setas + Imagem do Pokémon */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 w-full max-w-2xl mx-auto relative">
            <Link
              href={`/${prevPokemon?.name || prevId}`}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex-shrink-0 z-10"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </Link>
            
            <div className="relative flex justify-center z-[2]" style={{ bottom: "-40px" }}>
              <div className="relative" style={{ width: "200px", height: "200px"}}>
                <div className="sm:hidden">
                  <PokemonImage
                    image={pokemonObject.sprites.other["official-artwork"].front_default}
                    name={pokemonName}
                  />
                </div>
                <div className="hidden sm:block" style={{ width: "300px", height: "300px"}}>
                  <PokemonImage
                    image={pokemonObject.sprites.other["official-artwork"].front_default}
                    name={pokemonName}
                  />
                </div>
              </div>
            </div>
            
            <Link
              href={`/${nextPokemon?.name || nextId}`}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex-shrink-0 z-10"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </Link>
          </div>
        </div>

        {/* Container secundário branco */}
        <div className="bg-white rounded-2xl shadow-container p-4 sm:p-6 md:p-8 relative overflow-visible w-full max-w-2xl mx-auto">
          {/* Conteúdo do container */}
          <div>
            {/* 1. Badges de tipo centralizadas */}
            <div className="flex justify-center gap-2 mb-6">
              {pokemonObject.types.map((type: { type: { name: string } }) => (
                <TypeBadge
                  key={type.type.name}
                  type={type.type.name as any}
                  className="text-xs px-2.5 py-0.5"
                />
              ))}
            </div>

            {/* 2. Weight | Height | Egg Group | Abilities */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-light text-center">
              <div className="text-center">
                <p className="text-medium text-xs sm:text-sm mb-1">{translate('Weight')}</p>
                <p className="text-identity-dark font-semibold text-base sm:text-lg">{weight} kg</p>
              </div>
              <div className="text-center">
                <p className="text-medium text-xs sm:text-sm mb-1">{translate('Height')}</p>
                <p className="text-identity-dark font-semibold text-base sm:text-lg">{height} m</p>
              </div>
              <div className="text-center">
                <p className="text-medium text-xs sm:text-sm mb-1">{translate('Egg Group')}</p>
                <div className="flex flex-col gap-0.5">
                  {eggGroups.map((group: string) => (
                    <p key={group} className="text-identity-dark font-semibold text-xs sm:text-sm">
                      {translateEggGroup(group)}
                    </p>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <p className="text-medium text-xs sm:text-sm mb-1">{translate('Abilities')}</p>
                <div className="flex flex-col gap-0.5">
                  {pokemonObject.abilities.map((ability: { ability: { name: string } }) => (
                    <p key={ability.ability.name} className="text-identity-dark font-semibold text-xs sm:text-sm">
                      {translateAbilityName(ability.ability.name)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Descrição breve */}
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 text-center">
              <h3 className="text-identity-dark font-bold text-sm sm:text-base md:text-lg mb-2">{translate('Description')}</h3>
              <p className="text-medium text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto px-2">
                {description.replace(/\f/g, ' ').replace(/\n/g, ' ')}
              </p>
            </div>

            {/* 4 & 5. Tabs: Base Stats e Evolution Chain */}
            <Tabs
              items={[
                {
                  label: translate('Base Stats'),
                  content: (
                    <div className="space-y-2">
                      {pokemonObject.stats.map((stat: any) => {
                        const statName = translateStatName(stat.stat.name);
                        const statValue = stat.base_stat;
                        const maxStat = 200; // Valor máximo de stat
                        const percentage = (statValue / maxStat) * 100;
                        
                        return (
                          <div key={stat.stat.name} className="flex items-center justify-center gap-2 sm:gap-3 w-full">
                            <span className="text-medium text-xs sm:text-sm font-medium w-20 sm:w-24 text-center flex-shrink-0">
                              {statName}:
                            </span>
                            <div className="flex-1 bg-light rounded-full h-5 sm:h-6 overflow-hidden w-full">
                              <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-identity-dark font-semibold text-xs sm:text-sm w-10 sm:w-12 text-center flex-shrink-0">
                              {statValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ),
                },
                {
                  label: translate('Evolution Chain'),
                  content: (
                    <EvolutionChain 
                      evolutionData={evolutionData} 
                      currentPokemonId={pokemonId}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-3 mt-4" style={{ backgroundColor: "#bf1e2e" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-white text-center text-xs">
            2025 © Jéssica Rodrigues. Todos os direitos reservados
          </p>
        </div>
      </footer>
    </main>
  );
  } catch (error) {
    console.error('Error loading Pokemon:', error);
    return (
      <main 
        className="min-h-screen relative w-full overflow-hidden"
        style={{
          backgroundImage: "url('/pokeball-bg.webp')",
          backgroundSize: "contain",
          backgroundPosition: "top left",
          backgroundRepeat: "repeat",
          backgroundAttachment: "scroll",
          backgroundColor: "#e84a44",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 relative z-10">
          <Finder />
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-container p-6 sm:p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-identity-dark font-bold text-xl mb-4">Pokémon não encontrado</h2>
            <p className="text-medium mb-4">Não foi possível carregar os dados do Pokémon.</p>
            <Link 
              href="/page"
              className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para a Pokedex
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 mt-8" style={{ backgroundColor: "#bf1e2e" }}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-white text-center text-sm">
              2025 © Jéssica Rodrigues. Todos os direitos reservados
            </p>
          </div>
        </footer>
      </main>
    );
  }
}
