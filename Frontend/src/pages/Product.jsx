import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";

export const Product = () => {
  const { product_id } = useParams();
  const { products, currency } = useContext(ShopContext);
  const { addToCart } = useContext(CartContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const fetchProductData = useCallback(() => {
    if (products && products.length > 0 && product_id) {
      const foundProduct = products.find(
        (item) => item.product_id === parseInt(product_id)
      );
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.product_image[0]);

        // Set default size to first variant
        setSize(foundProduct.variants[0].storage);
        setSelectedVariant(foundProduct.variants[0]);
      }
    }
  }, [products, product_id]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleQuantityChange = (event) => {
    const value =
      event.target.value === "" || event.target.value === "0"
        ? 1
        : Number(event.target.value);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (productData && selectedVariant) {
      const price = selectedVariant.product_price * 1000000;

      const productToAdd = {
        product_id: productData.product_id,
        product_name: productData.product_name,
        price: price,
        product_image: productData.product_image,
        storage: selectedVariant.storage,
      };

      console.log("Product being added to cart:", productToAdd);
      addToCart(productToAdd);
    }
  };

  return (
    <div>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <ol role="list" className="flex items-center">
              <li className="text-left">
                <div className="-m-1">
                  <a
                    href="/"
                    className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                  >
                    Home
                  </a>
                </div>
              </li>

              <li className="text-left">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <div className="-m-1">
                    <a
                      href="/collection"
                      className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                    >
                      Collection
                    </a>
                  </div>
                </div>
              </li>

              <li className="text-left">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <div className="-m-1">
                    <a
                      href=""
                      className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                      aria-current="page"
                    >
                      {productData?.product_name}
                    </a>
                  </div>
                </div>
              </li>
            </ol>
          </nav>

          <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="lg:flex lg:items-start">
                <div className="lg:order-2 lg:ml-5">
                  <div className="max-w-xl overflow-hidden rounded-lg transition-transform duration-300 hover:scale-110">
                    <img
                      className="h-full w-full max-w-full object-cover transition-transform duration-300"
                      src={`http://localhost:5000/phone_images/${image}.png`}
                      alt={productData?.product_name}
                    />
                  </div>
                </div>

                <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                  <div className="flex flex-row items-start lg:flex-col">
                    {productData?.product_image.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 transition-transform duration-300 hover:scale-110 ${
                          image === img
                            ? "border-gray-900"
                            : "border-transparent"
                        } text-center`}
                        onClick={() => setImage(img)}
                      >
                        <img
                          className="h-full w-full object-cover"
                          src={`http://localhost:5000/phone_images/${img}.png`}
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">
                {productData?.product_name}
              </h1>

              <h2 className="mt-8 text-base text-gray-900">Storage</h2>
              <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                {productData?.variants.map((variant, index) => (
                  <label key={index} className="">
                    <input
                      type="radio"
                      name="storage"
                      value={variant.storage}
                      className="peer sr-only"
                      defaultChecked={index === 0}
                      onChange={() => {
                        setSize(variant.storage);
                        setSelectedVariant(variant);
                      }}
                    />
                    <p className="peer-checked:bg-black peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold">
                      {variant.storage}
                    </p>
                    <span className="mt-1 block text-center text-xs">
                      {(variant.product_price * 1000000).toLocaleString()} VND
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                <div className="flex items-end">
                  <h1 className="text-3xl font-bold">
                    {(selectedVariant
                      ? selectedVariant.product_price * 1000000
                      : productData?.variants[0]?.product_price * 1000000
                    ).toLocaleString()}{" "}
                    VND
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0 mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Add to cart
                </button>
              </div>

              <div className="lg:col-span-3">
                <div className="border-b border-gray-300">
                  <nav className="flex gap-4">
                    <a
                      href="#"
                      title=""
                      className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800"
                    >
                      Description
                    </a>
                  </nav>
                </div>

                <div className="mt-8 flow-root sm:mt-12">
                  <p className="mt-4">{productData?.product_description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
