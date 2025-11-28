const POKEMON_API = "https://pokeapi.co/api/v2/";

export async function getPokemonList() {
  const response = await fetch(POKEMON_API + "pokemon?limit=151&offset=0");
  const data = await response.json();
  return data.results;
}

export async function getPokemon(name: string) {
  try {
    const response = await fetch(POKEMON_API + "pokemon/" + name, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    throw error;
  }
}

export async function getPokemonDetails(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getPokemonSpecies(id: number) {
  try {
    const response = await fetch(POKEMON_API + "pokemon-species/" + id, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    if (!response.ok) return null;
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
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    return null;
  }
}

// Função para determinar o estágio de evolução
function getEvolutionStage(chain: any, pokemonId: number, stage: number = 0): number | null {
  if (!chain) return null;
  
  const chainId = parseInt(chain.species.url.split('/').slice(-2, -1)[0]);
  
  if (chainId === pokemonId) {
    return stage;
  }
  
  if (chain.evolves_to && chain.evolves_to.length > 0) {
    for (const evolution of chain.evolves_to) {
      const result = getEvolutionStage(evolution, pokemonId, stage + 1);
      if (result !== null) return result;
    }
  }
  
  return null;
}

export async function getAllPokemonWithDetails() {
  const list = await getPokemonList();
  const pokemonWithDetails = await Promise.all(
    list.map(async (pokemon: any) => {
      const details = await getPokemonDetails(pokemon.url);
      
      // Buscar species para egg groups e evolution chain
      const species = await getPokemonSpecies(details.id);
      
      // Egg groups
      const eggGroups = species?.egg_groups?.map((group: any) => group.name) || [];
      
      // Evolution stage
      let evolutionStage: number | null = null;
      if (species?.evolution_chain?.url) {
        const evolutionChain = await getEvolutionChain(species.evolution_chain.url);
        if (evolutionChain?.chain) {
          evolutionStage = getEvolutionStage(evolutionChain.chain, details.id);
        }
      }
      
      // Busca sprites animados (GIF) - versão Black/White tem sprites animados
      const animatedSprites = details.sprites.versions?.["generation-v"]?.["black-white"]?.animated;
      
      // Sprites estáticos como fallback
      const staticMaleSprite = 
        details.sprites.versions?.["generation-i"]?.["red-blue"]?.front_default ||
        details.sprites.front_default ||
        details.sprites.other?.["official-artwork"]?.front_default;
      
      const staticFemaleSprite = 
        details.sprites.front_female || 
        staticMaleSprite;
      
      // Se houver sprites animados, garante que ambos (male e female) sejam animados
      // Se não houver female animado, usa o male animado para manter consistência
      let imageMale: string;
      let imageFemale: string;
      let hasAnimated = false;
      
      if (animatedSprites?.front_default) {
        hasAnimated = true;
        imageMale = animatedSprites.front_default;
        // Se não houver female animado, usa o male animado para manter consistência
        imageFemale = animatedSprites.front_female || animatedSprites.front_default;
      } else {
        // Sem sprites animados, usa estáticos
        imageMale = staticMaleSprite;
        imageFemale = staticFemaleSprite;
      }
      
      return {
        id: details.id,
        name: details.name,
        types: details.types.map((t: any) => t.type.name),
        image: staticMaleSprite, // Imagem padrão estática
        imageMale,
        imageFemale,
        hasAnimated,
        // Sprites estáticos para fallback caso o animado não carregue
        staticImageMale: staticMaleSprite,
        staticImageFemale: staticFemaleSprite,
        eggGroups,
        evolutionStage: evolutionStage !== null ? evolutionStage : 0, // 0 = base, 1 = primeira evolução, 2 = segunda evolução
      };
    })
  );
  return pokemonWithDetails;
}
