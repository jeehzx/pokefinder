"use client"
import Image from "next/image"

export function PokemonImage({ image, name }: { image: string; name: string }) {
  return (
    <Image
      src={image}
      alt={"Picture of " + name}
      priority={true}
      fill={true}
      sizes="(max-width: 200px, max-height: 200px)"
      style={{ objectFit: "contain" }}
      className="transition-opacity opacity-0 duration[-2s]"
      onLoadingComplete={(image) => image.classList.remove("opacity-0")}
    />
  )
}
