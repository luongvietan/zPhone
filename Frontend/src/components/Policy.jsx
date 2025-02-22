import { RiExchangeFundsFill } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";

const Policy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <RiExchangeFundsFill className="w-12 m-auto mb-5" size={80} />
        {/* <img
          src={assets.exchange_icon}
          className="w-12 m-auto mb-5"
          alt="exchange_icon"
        /> */}
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400">We offer hassle free exchange policy</p>
      </div>
      <div>
        <GrStatusGood className="w-12 m-auto mb-5" size={80} />
        {/* <img
          src={assets.quality_icon}
          className="w-12 m-auto mb-5"
          alt="quality_icon"
        /> */}
        <p className="font-semibold">7 Days Return Policy</p>
        <p className="text-gray-400">We provide 7 days free return policy</p>
      </div>
      <div>
        <BiSupport className="w-12 m-auto mb-5" size={80} />
        {/* <img
          src={assets.support_img}
          className="w-12 m-auto mb-5"
          alt="support_icon"
        /> */}
        <p className="font-semibold">Best customer support</p>
        <p className="text-gray-400">We provide 24/7 customer support</p>
      </div>
    </div>
  );
};

export default Policy;
