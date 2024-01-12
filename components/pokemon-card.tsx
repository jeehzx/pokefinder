import Link from "next/link"

interface PokemonCardProps {
  name: string
}

export function PokemonCard({ name }: PokemonCardProps) {
  return (
    <Link
      href={name}
      className="group flex rounded-lg border border-transparent px-4 py-3 text-center items-center justify-center transition-colors dark:border-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      key={name + "Card"}
    >
      <h2 className={`text-base font-semibold`}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </h2>
    </Link>
  )
}
