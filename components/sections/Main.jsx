import background from "@/public/background.png"

const Main = () => {
  return (
    <section id="home" className="max-container flex min-h-[450px] justify-between text-center md:mx-20 md:pt-32 pt-28  bg-red-500">
      <div className="flex flex-col md:ml-20 mx-10 mt-10">
          <h1 className="font-montserrat font-bold text-4xl text-left mb-5 text-yellow-400">Bem-vindo,</h1>
            <p className="font-montserrat text-white text-left text-[11.5px] mb-5 flex-wrap">
            A Pokédex é uma ferramenta icônica no universo Pokémon,<br/> desempenhando um papel crucial na jornada de treinadores. <br/>Na primeira geração, esta enciclopédia eletrônica é o companheiro <br/>constante de treinadores em sua busca para <span className="text-yellow-400">"pegar todos".</span> <br/>Desenvolvida pelo Professor Carvalho, a Pokédex tem como principal propósito catalogar e fornecer informações sobre as<br/> criaturas que habitam o mundo <span className="text-yellow-400">Pokémon.</span>
            </p>
      <a href="/page" className="font-semibold text-white md:mt-10 mt-4 pt-5 bg-yellow-400 rounded-[30px] w-62 h-16 text-lg hover:bg-black"> Vamos achar seu Pokémon! </a>
      </div>
      <div className="w-3/4 h-96 shadow-xl rounded-full relative px-10 hidden md:block">
        <img
          src="background.png"
          alt="rottom"
          layout='fill'
          objectfit='cover'
          className="rounded-full cursor-pointer"
        />
      </div>
    </section>
  )
}

export default Main
