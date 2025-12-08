"use client";

import { useState, useEffect, useRef } from "react";
import { getAllPokemonWithDetails } from "@/lib/pokemonAPI";
import { PokemonCard } from "@/components/pokemon-card";
import { PokedexLabel } from "@/components/pokedex-label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Finder from "@/components/Finder";
import { Search } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { translate, translateEggGroup, translateType, gen1EggGroups, normalizeEggGroupName } from "@/lib/translations";

// Registrar ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedEggGroup, setSelectedEggGroup] = useState("");
  const [selectedEvolutionStage, setSelectedEvolutionStage] = useState("");
  const rotomDoisRef = useRef(null);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const data = await getAllPokemonWithDetails();
        setPokemonList(data);
      } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemon();
  }, []);

  useEffect(() => {
    if (loading || !rotomDoisRef.current) return;

    // Limpar animações anteriores
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars?.id === "rotom-dois") {
        trigger.kill();
      }
    });

    // Calcular valores baseados na altura do scroll
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const midPoint = scrollHeight * 0.5;

    // Animação do Rotom-dois: aparece suavemente a partir dos 50%
    gsap.fromTo(
      rotomDoisRef.current,
      {
        opacity: 0,
        y: 25,
      },
      {
        scrollTrigger: {
          trigger: document.body,
          start: () => `top+=${midPoint} top`,
          end: "bottom bottom",
          scrub: 1.2,
          id: "rotom-dois",
          onUpdate: function (self) {
            if (rotomDoisRef.current) {
              // Aumenta opacidade mais rapidamente para melhor visibilidade
              const opacity = Math.min(1, self.progress * 1.3);
              rotomDoisRef.current.style.opacity = opacity.toString();
              
              if (self.progress > 0.15) {
                rotomDoisRef.current.style.pointerEvents = "auto";
              } else {
                rotomDoisRef.current.style.pointerEvents = "none";
              }
            }
          },
        },
        opacity: 1,
        y: 0,
        ease: "sine.in",
      }
    );

    // Atualizar ScrollTrigger quando o conteúdo mudar
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars?.id === "rotom-dois") {
            trigger.kill();
          }
        });
      };
  }, [loading, pokemonList.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Obter opções únicas para os filtros
  const uniqueTypes = Array.from(
    new Set(pokemonList.flatMap((p) => p.types || []))
  ).sort();

  // Filtrar apenas egg groups válidos da Gen I
  const uniqueEggGroups = Array.from(
    new Set(
      pokemonList
        .flatMap((p) => p.eggGroups || [])
        .map((group) => normalizeEggGroupName(group))
        .filter((group) => group && gen1EggGroups.includes(group))
    )
  ).sort();

  const uniqueEvolutionStages = Array.from(
    new Set(pokemonList.map((p) => p.evolutionStage ?? 0))
  ).sort((a, b) => a - b);

  const filteredPokemon = pokemonList.filter((pokemon) => {
    // Filtro de busca por nome ou ID
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.id.toString().includes(searchTerm);

    // Filtro de tipo
    const matchesType =
      !selectedType || (pokemon.types || []).includes(selectedType);

    // Filtro de egg group (normalizar para comparação)
    const matchesEggGroup =
      !selectedEggGroup ||
      (pokemon.eggGroups || [])
        .map((group) => normalizeEggGroupName(group))
        .includes(normalizeEggGroupName(selectedEggGroup));

    // Filtro de estágio de evolução
    const matchesEvolutionStage =
      selectedEvolutionStage === "" ||
      (pokemon.evolutionStage ?? 0) === parseInt(selectedEvolutionStage);

    return (
      matchesSearch &&
      matchesType &&
      matchesEggGroup &&
      matchesEvolutionStage
    );
  });

  if (loading) {
    return (
      <main 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: "url('/pokeball-bg.webp')",
          backgroundSize: "contain",
          backgroundPosition: "top left",
          backgroundRepeat: "repeat",
          backgroundAttachment: "scroll",
          backgroundColor: "#e84a44",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="w-full flex justify-center pt-6 pb-4">
            <Finder />
          </div>
          <div className="bg-white rounded-t-3xl rounded-b-lg shadow-inner-2dp mt-4 p-6 sm:p-8 max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-medium text-lg">Carregando Pokémon...</p>
            </div>
          </div>
        </div>
      </main>
    );
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

      {/* Rotom-dois - Canto inferior direito, Back to Top */}
      <button
        ref={rotomDoisRef}
        onClick={scrollToTop}
        className="fixed right-4 bottom-4 sm:right-8 sm:bottom-8 md:right-12 md:bottom-12 z-20 cursor-pointer hover:scale-110 transition-transform opacity-0"
        style={{ pointerEvents: "none" }}
        aria-label="Voltar ao topo"
      >
        <img 
          src="/rotom-dois.webp" 
          alt="Rotom Back to Top" 
          className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
        />
      </button>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="w-full flex justify-center pt-6 pb-4">
          <Finder />
        </div>

        {/* Container branco para os cards */}
        <div className="flex justify-center mt-4 w-full">
          <div className="bg-white rounded-t-3xl rounded-b-lg shadow-container p-4 sm:p-6 md:p-8 pb-12 sm:pb-16 w-full max-w-6xl mx-auto">
            {/* Pokedex Label */}
            <PokedexLabel pokemonCount={filteredPokemon.length} />

            {/* Aviso sobre Gen 1 */}
            <div className="mb-3 sm:mb-4 text-center">
              <p className="text-xs sm:text-sm text-medium/80 italic">
                * Esta Pokédex foca exclusivamente na Geração 1, mantendo apenas o conhecimento e padrões disponíveis naquela geração.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-medium z-10" />
                <Input
                  type="text"
                  placeholder="Buscar Pokémon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base shadow-drop-2dp bg-white"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Filtro de Tipo */}
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 min-w-[120px] sm:min-w-[140px]"
              >
                <option value="">{translate('Type')}</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {translateType(type)}
                  </option>
                ))}
              </Select>

              {/* Filtro de Egg Group */}
              <Select
                value={selectedEggGroup}
                onChange={(e) => setSelectedEggGroup(e.target.value)}
                className="flex-1 min-w-[120px] sm:min-w-[140px]"
              >
                <option value="">{translate('Egg Group')}</option>
                {uniqueEggGroups
                  .map((group) => ({
                    value: group,
                    label: translateEggGroup(group),
                  }))
                  .filter((item) => item.label) // Remover grupos sem tradução
                  .map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
              </Select>

              {/* Filtro de Estágio de Evolução */}
              <Select
                value={selectedEvolutionStage}
                onChange={(e) => setSelectedEvolutionStage(e.target.value)}
                className="flex-1 min-w-[120px] sm:min-w-[140px]"
              >
                <option value="">{translate('Evolution')}</option>
                {uniqueEvolutionStages.map((stage) => (
                  <option key={stage} value={stage.toString()}>
                    {stage === 0
                      ? translate('Base')
                      : stage === 1
                      ? "1ª Evolução"
                      : stage === 2
                      ? "2ª Evolução"
                      : `${stage}ª Evolução`}
                  </option>
                ))}
              </Select>
            </div>

            {/* Pokemon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} {...pokemon} />
              ))}
            </div>

            {filteredPokemon.length === 0 && (
              <div className="text-center py-12">
                <p className="text-medium text-lg">Nenhum Pokémon encontrado</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Padding no fim para mostrar fundo vermelho */}
        <div className="h-16"></div>
      </div>

      {/* Footer */}
      <footer className="w-full py-3" style={{ backgroundColor: "#bf1e2e" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-white text-center text-xs">
            2025 © Jéssica Rodrigues. Todos os direitos reservados
          </p>
        </div>
      </footer>
    </main>
  );
}
