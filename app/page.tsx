"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Finder from "@/components/Finder";
import gsap from "gsap";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioned, setIsTransitioned] = useState(false);
  const initialImageRef = useRef<HTMLDivElement>(null);
  const initialImgRef = useRef<HTMLImageElement>(null);
  const finalImageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const rotomRef = useRef<HTMLDivElement>(null);

  // Animação do Rotom - só inicia após a transição
  useEffect(() => {
    if (!rotomRef.current || !isTransitioned) return;

    // Posições apenas no bottom, alternando entre left e right
    const positions = [
      { bottom: "6rem", right: "2rem", left: "auto" }, // Bottom right
      { bottom: "6rem", right: "auto", left: "2rem" }, // Bottom left
    ];

    let currentPositionIndex = 0;

    const createRotomCycle = () => {
      const currentPos = positions[currentPositionIndex];
      const nextPos = positions[(currentPositionIndex + 1) % positions.length];
      
      const tl = gsap.timeline();
      
      // Aparece na posição atual
      tl.set(rotomRef.current, {
        ...currentPos,
        top: "auto",
        opacity: 0,
        scale: 0.8,
        rotationY: 0,
        y: 0,
      })
      .to(rotomRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      })
      // Fica visível por alguns segundos (pulando)
      .to(rotomRef.current, {
        y: -15,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(rotomRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power2.in",
      })
      .to(rotomRef.current, {
        y: -12,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(rotomRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.in",
      })
      // Pausa antes do flip
      .to({}, { duration: 1.5 })
      // Animação de flip e desaparece
      .to(rotomRef.current, {
        rotationY: 180,
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      })
      // Move para próxima posição (invisível)
      .set(rotomRef.current, {
        ...nextPos,
        top: "auto",
        rotationY: 0,
        y: 0,
      });

      currentPositionIndex = (currentPositionIndex + 1) % positions.length;
      
      return tl;
    };

    // Criar timeline principal que repete
    const mainTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    
    const startCycle = () => {
      const cycle = createRotomCycle();
      mainTimeline.add(cycle);
    };

    // Iniciar primeiro ciclo após um pequeno delay
    setTimeout(() => {
      startCycle();
    }, 1000);

    // Adicionar novos ciclos continuamente
    const interval = setInterval(() => {
      startCycle();
    }, 9000); // Aproximadamente 9 segundos por ciclo

    return () => {
      mainTimeline.kill();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioned]);

  // Desabilitar scroll antes da transição
  useEffect(() => {
    if (!isTransitioned) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isTransitioned]);

  useEffect(() => {
    if (isHovered && !isTransitioned) {
      const tl = gsap.timeline();

      // Shake inicial
      tl.to(initialImageRef.current, {
        duration: 0.15,
        x: -10,
        ease: "power2.inOut",
      })
        .to(initialImageRef.current, {
          duration: 0.15,
          x: 10,
          ease: "power2.inOut",
        })
        .to(initialImageRef.current, {
          duration: 0.15,
          x: -8,
          ease: "power2.inOut",
        })
        .to(initialImageRef.current, {
          duration: 0.15,
          x: 8,
          ease: "power2.inOut",
        })
        .to(initialImageRef.current, {
          duration: 0.15,
          x: 0,
          ease: "power2.inOut",
        })
        // Animação da imagem inicial: encolher e mover para a direita (mais lenta)
        .to(initialImageRef.current, {
          duration: 2,
          scale: 0.5,
          x: "calc(50vw - 25%)",
          ease: "power2.inOut",
        })
        // Fade out completo da imagem inicial
        .to(
          initialImageRef.current,
          {
            duration: 0.6,
            opacity: 0,
            ease: "power2.inOut",
          },
          "-=0.4"
        )
        // Esconder completamente a imagem inicial
        .set(initialImageRef.current, { display: "none" })
        // Mostrar layout 50/50
        .set(layoutRef.current, { display: "grid" })
        // Fade in do texto (mais lento)
        .fromTo(
          textRef.current,
          { opacity: 0, x: -50 },
          {
            duration: 1.2,
            opacity: 1,
            x: 0,
            ease: "power2.out",
          },
          "-=0.2"
        )
        // Fade in da imagem final no container (mais lento)
        .fromTo(
          finalImageRef.current,
          { opacity: 0, scale: 0.8 },
          {
            duration: 1.2,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
          },
          "-=1"
        )
        .call(() => {
          setIsTransitioned(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, isTransitioned]);

  const handleMouseEnter = () => {
    if (!isTransitioned) {
      setIsHovered(true);
    }
  };

  return (
    <main className="min-h-screen bg-primary relative w-full overflow-hidden flex flex-col">
      {/* Navbar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 z-30 relative">
        <Finder />
      </div>

      {/* Rotom animado no background - apenas mobile */}
      {isTransitioned && (
        <div
          ref={rotomRef}
          className="fixed z-0 pointer-events-none opacity-0 lg:hidden"
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <img
            src="/rotom-um.webp"
            alt="Rotom"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            style={{ transform: "translateZ(0)" }}
          />
        </div>
      )}

      {/* Zona de hover no meio da tela */}
      {!isTransitioned && (
        <div
          className="fixed inset-0 z-20 cursor-pointer"
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* Estado inicial: Imagem centralizada fullscreen */}
      {!isTransitioned && (
        <div
          ref={initialImageRef}
          className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <img
            ref={initialImgRef}
            src="/home-desktop2.webp"
            alt="Pokédex"
            className="w-full h-full object-contain max-w-5xl"
          />
        </div>
      )}

      {/* Estado final: Layout 50/50 */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-4 sm:py-6 md:py-8 lg:py-12">
        <div
          ref={layoutRef}
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          style={{ display: isTransitioned ? "grid" : "none" }}
        >
          {/* Texto centralizado no mobile */}
          <div ref={textRef} className="text-white space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 opacity-0 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold leading-tight">
              <span 
                className="bg-gradient-to-r from-type-electric via-[#FFD700] to-type-electric bg-clip-text text-transparent"
                style={{
                  textShadow: "0 2px 8px rgba(249, 207, 48, 0.6), 0 0 20px rgba(249, 207, 48, 0.3)",
                  filter: "drop-shadow(0 2px 4px rgba(249, 207, 48, 0.5))",
                }}
              >
                Bem-vindo,
              </span>
            </h1>
            <div className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg leading-relaxed text-white/95">
              <p>
                A Pokédex é uma ferramenta icônica no universo Pokémon,
                desempenhando um papel crucial na jornada de treinadores.
              </p>
              <p>
                Na primeira geração, esta enciclopédia eletrônica é o companheiro
                constante de treinadores em sua busca para &quot;pegar todos&quot;.
              </p>
              <p>
                Desenvolvida pelo Professor Carvalho, a Pokédex tem como principal
                propósito catalogar e fornecer informações sobre as criaturas que
                habitam o mundo Pokémon.
              </p>
            </div>
            <Link
              href="/page"
              className="inline-block mt-4 sm:mt-5 md:mt-6 lg:mt-8 px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 bg-gradient-to-r from-type-electric to-[#FFD700] text-white font-bold text-xs sm:text-sm md:text-base lg:text-base xl:text-lg rounded-lg hover:from-[#FFD700] hover:to-type-electric transition-all duration-300 shadow-drop-6dp hover:shadow-drop-2dp hover:scale-105 transform"
              style={{
                boxShadow: "0px 4px 12px rgba(249, 207, 48, 0.5), 0px 2px 6px rgba(249, 207, 48, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
            >
              Vamos achar seu Pokémon!
            </Link>
          </div>

          {/* Imagem à direita - oculta no mobile */}
          <div
            ref={finalImageRef}
            className="hidden lg:flex items-center justify-center h-full opacity-0"
          >
            <img
              src="/home-desktop.webp"
              alt="Pokédex"
              className="h-full max-h-[600px] w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Footer - aparece apenas após a transição */}
      {isTransitioned && (
        <footer className="w-full py-3 bg-primary mt-auto">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-white text-center text-xs">
              2025 © Jéssica Rodrigues. Todos os direitos reservados
            </p>
          </div>
        </footer>
      )}
    </main>
  );
}
