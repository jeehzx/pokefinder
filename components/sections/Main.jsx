const Main = () => {
  return (
    <section
      id="home"
      className="container mx-auto px-4 mt-4 md:mt-8 flex flex-col md:flex-row items-center justify-between"
    >
      <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
        <h1 className="text-yellow-400 text-4xl md:text-5xl font-bold mb-4">
          Bem-vindo,
        </h1>
        <p className="text-white text-lg md:text-xl leading-relaxed">
          A Pokédex é uma ferramenta icônica no universo Pokémon,
          <br /> desempenhando um papel crucial na jornada de treinadores.
          <br />
          Na primeira geração, esta enciclopédia eletrônica é o companheiro
          <br />
          constante de treinadores em sua busca para{" "}
          <span className="text-yellow-400">&quot;pegar todos&quot;.</span> <br />
          Desenvolvida pelo Professor Carvalho, a Pokédex tem como principal
          propósito catalogar e fornecer informações sobre as
          <br /> criaturas que habitam o mundo{" "}
          <span className="text-yellow-400">Pokémon.</span>
        </p>
        <a
          href="/page"
          className="inline-block mt-6 px-6 py-3 text-white bg-yellow-400 hover:bg-black rounded-full"
        >
          Vamos achar seu Pokémon!
        </a>
      </div>
      <div className="md:w-1/2 flex justify-center md:justify-end">
        <img
          src="background.png"
          className="w-max h-max rounded-full"
          alt="Background"
        />
      </div>
    </section>
  );
};

export default Main;
