import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src="/logo.png" className="mb-5 w-32" alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600">
            ZPHONE – Your destination for authentic smartphones with a wide
            range of models from top brands. We are committed to delivering
            high-quality products, competitive prices, and dedicated customer
            service.
          </p>{" "}
          <p className="w-full md:w-2/3 text-gray-600">
            ZPHONE – Connecting you to technology and unforgettable experiences.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="/collection">
              <li>Collection</li>
            </Link>
            <Link to="/about">
              <li>About Us</li>
            </Link>
            <Link to="/contact">
              <li>Contact</li>
            </Link>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+84 384 398 634</li>
            <li>luongvietan.231123@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
      </div>
    </div>
  );
};

export default Footer;
