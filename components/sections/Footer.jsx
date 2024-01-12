
const Footer = () => {
  return (
    <footer className="max-container">
      <div className="flex justify-between items-star gap-2 flew-wrap max-lg:flex-col max-sm:flex-col">
        <a href="https://github.com/jeehzx"><p className="mt-8 text-[20px] leading-7 font-palanquin text-white sm:max-w-sm cursor-pointer"> PokeFinder by Jéssica/jeehzx</p>
        </a>
       </div>   
       <div className="flex justify-between text-white mt-10 max-sm:flex-col max-sm:items-center">
        <div className="flex flex-1 justify-start gap-2 font-montserrat cursor-pointer"><img src="copyright-sign.svg" alt="copyright" width={20} height={20} className="rounded-full m-0" />
        <p>Copyright. All rights reserved.</p>
        </div>
        <p>Terms & Conditions </p>
       </div>
    </footer>
  )
}

export default Footer
