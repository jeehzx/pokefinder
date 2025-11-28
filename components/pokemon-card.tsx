"use client";

import Link from "next/link";
import { TypeBadge } from "./type-badge";
import { useState, useRef } from "react";

interface PokemonCardProps {
  id: number;
  name: string;
  types: string[];
  image: string;
  imageMale?: string;
  imageFemale?: string;
  hasAnimated?: boolean;
  staticImageMale?: string;
  staticImageFemale?: string;
}

export function PokemonCard({ 
  id, 
  name, 
  types, 
  image, 
  imageMale, 
  imageFemale,
  hasAnimated,
  staticImageMale,
  staticImageFemale
}: PokemonCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMale, setIsMale] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastMouseX = useRef<number>(0);

  const hasMultipleSprites = !!(imageMale && imageFemale && imageMale !== imageFemale);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !hasMultipleSprites) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    
    // Se o mouse está na metade direita do card, alterna para female
    if (mouseX >= centerX) {
      if (isMale && imageFemale) {
        setIsMale(false);
      }
    } 
    // Se o mouse está na metade esquerda do card, volta para male
    else {
      if (!isMale && imageMale) {
        setIsMale(true);
      }
    }
    
    lastMouseX.current = mouseX;
  };

  const currentImage = isMale 
    ? (imageMale || image) 
    : (imageFemale || image);

  return (
    <Link href={`/${name}`}>
      <div
        ref={cardRef}
        className="bg-white rounded-lg p-3 shadow-drop-2dp hover:shadow-drop-6dp transition-all duration-200 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsMale(true); // Reset para male ao sair
        }}
        onMouseMove={handleMouseMove}
      >
        {/* ID e Nome na mesma linha */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-medium font-medium">
            #{id.toString().padStart(3, "0")}
          </span>
          <h3 className="text-[11px] font-semibold text-identity-dark">
            {name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
          </h3>
        </div>

        {/* Imagem */}
        <div className="bg-background rounded-md mb-2 flex items-center justify-center p-2 relative overflow-hidden" style={{ minHeight: "80px", height: "80px" }}>
          <img
            src={currentImage}
            alt={name}
            style={{
              imageRendering: hasAnimated ? "auto" : "pixelated",
              width: hasAnimated ? "56px" : "60px",
              height: hasAnimated ? "56px" : "60px",
              maxWidth: hasAnimated ? "56px" : "60px",
              maxHeight: hasAnimated ? "56px" : "60px",
              minWidth: hasAnimated ? "56px" : "60px",
              minHeight: hasAnimated ? "56px" : "60px",
              objectFit: "contain",
              display: "block",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
            width={hasAnimated ? 56 : 60}
            height={hasAnimated ? 56 : 60}
            onError={(e) => {
              // Fallback estático apenas se o animado não carregar
              if (hasAnimated) {
                const target = e.target as HTMLImageElement;
                // Usa o sprite estático correspondente ao gênero atual
                const fallbackImage = isMale 
                  ? (staticImageMale || image)
                  : (staticImageFemale || image);
                target.src = fallbackImage;
                // Ajusta o tamanho para estático após fallback
                target.style.width = "60px";
                target.style.height = "60px";
                target.style.maxWidth = "60px";
                target.style.maxHeight = "60px";
                target.style.minWidth = "60px";
                target.style.minHeight = "60px";
                target.setAttribute("width", "60");
                target.setAttribute("height", "60");
              }
            }}
          />
          
          {/* Símbolo de gênero no canto superior direito */}
          {hasMultipleSprites && (
            <span className={`absolute top-1 right-1 text-xs font-black ${isMale ? "text-blue-600" : "text-pink-500"}`}>
              {isMale ? "♂" : "♀"}
            </span>
          )}
          
          {/* Dots indicadores de múltiplos sprites */}
          {hasMultipleSprites && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isMale ? "bg-primary shadow-sm" : "bg-light opacity-40"
                }`}
              />
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  !isMale ? "bg-primary shadow-sm" : "bg-light opacity-40"
                }`}
              />
            </div>
          )}
        </div>

        {/* Type Badges */}
        <div className="flex gap-1 justify-center flex-wrap">
          {types.map((type) => (
            <TypeBadge
              key={type}
              type={type as any}
              className="text-[10px]"
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
