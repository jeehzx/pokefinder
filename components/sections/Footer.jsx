const Footer = () => {
  return (
    <div className="bg-black w-full flex md:flex-row flex-col justify-around items-center">
      <div className="p-2">
        <a href="https://github.com/jeehzx">
          <p className="text-white font-palanquin font-semibold text-2xl pb-2 text-center">
            Made by
            <span className="text-red-500 hover:text-white"> Jeehzx</span>
          </p>
        </a>
        <div className="flex flex-col justify-center items-center text-center text-2xl font-palanquin p-2">
          <h1 className="text-white font-semibold">
            &copy; All rights reserved.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
