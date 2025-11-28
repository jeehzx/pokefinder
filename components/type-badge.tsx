import { cn } from "@/lib/utils";
import { translateType } from "@/lib/translations";

type PokemonType =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "normal"
  | "grass"
  | "ground"
  | "ice"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";

interface TypeBadgeProps {
  type: PokemonType;
  className?: string;
}

const typeColors: Record<PokemonType, string> = {
  bug: "bg-type-bug",
  dark: "bg-type-dark",
  dragon: "bg-type-dragon",
  electric: "bg-type-electric",
  fairy: "bg-type-fairy",
  fighting: "bg-type-fighting",
  fire: "bg-type-fire",
  flying: "bg-type-flying",
  ghost: "bg-type-ghost",
  normal: "bg-type-normal",
  grass: "bg-type-grass",
  ground: "bg-type-ground",
  ice: "bg-type-ice",
  poison: "bg-type-poison",
  psychic: "bg-type-psychic",
  rock: "bg-type-rock",
  steel: "bg-type-steel",
  water: "bg-type-water",
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-sm font-semibold text-white capitalize",
        "shadow-md border border-white/30",
        "hover:shadow-lg hover:scale-105 transition-all duration-200",
        "backdrop-blur-sm",
        typeColors[type],
        className
      )}
      style={{
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      }}
    >
      {translateType(type)}
    </span>
  );
}

