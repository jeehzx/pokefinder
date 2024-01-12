import background from "@/public/background.png"

const Main = () => {
  return (
    <section
      id="home"
      className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container bg-red-500">
      <div className="relative xl:w-2/5 flex flex-col justify-center items-start w-full max-xl:padding-x pt-28 padding-x">
        <a href="/page">
          <h1 className="mt-10 font-palanquin text-8xl sm:text-[60px] sm:leading-[1] max-sm:text-[20px] font-bold">
            <span className="text-white mt-3 inline-block">Search</span>
            <span className="relative z-10 pr-10 xl:whitespace-nowrap">
              {" "}
              For Your Pokémon!
            </span>
            <p className="font-montserrat text-white text-xl leading-6 mt-8 mb-20 sm:max-w-sm xl:max-w-sm">
              Pokédex apenas da 1º geração de Pokémon!
            </p>
          </h1>
        </a>
      </div>

      <div className="flex bg-cover bg-center">
        <img
          src="background.png"
          alt="rottom"
          fill={true}
          className="object-contain w-full z-10"
        />
      </div>
    </section>
  )
}

export default Main
