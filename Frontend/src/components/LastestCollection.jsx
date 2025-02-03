import { createContext, useEffect, useState } from "react";
import api from "../api";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        console.log("API response:", response.data); // Để debug
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setLatestProduct(products.slice(0, 5));
    } else {
      setLatestProduct([]);
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LASTEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our latest collection of new products designed to elevate your
          life with style and performance.
        </p>
      </div>
      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProduct.map((item) => (
          <ProductItem
            key={item.id || item._id} // Tùy thuộc vào cấu trúc API của bạn
            product_id={item.product_id || item._id}
            product_image={item.product_image || item.images} // Điều chỉnh theo tên trường trong API
            product_name={item.product_name || item.product_name}
            price={parseFloat(item.variants[0].product_price)}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
