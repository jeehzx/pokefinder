const Footer = () => {
  return (
    <div className="bg-black w-full flex max-md:flex-row bottom-0 relative justify-around items-center">
      <div className="p-2">
        <p className="text-white font-palanquin font-semibold text-2xl pb-2 text-center">
          Made by
          <span className="text-red-500">
            <a
              href="https://github.com/jeehzx"
              target="_blank"
              className="cursor-pointer hover:text-white"
            >
              {" "}
              Jeehzx
            </a>
          </span>
        </p>

        <div className="flex flex-col justify-center items-center text-center text-2xl font-palanquin p-2">
          <p className="text-white font-semibold">
            &copy; All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
