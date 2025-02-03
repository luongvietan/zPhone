import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import api from "../api";

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);
  const [bestSeller, setBestSeller] = useState([]);

  // Kiểm tra kiểu dữ liệu của products

  useEffect(() => {
    if (Array.isArray(products)) {
      const bestProduct = products.filter((item) => item.bestseller);
      setBestSeller(bestProduct.slice(0, 5));
    } else {
      console.error("products is not an array");
    }
  }, [products]);

  useEffect(() => {
    console.log(`best seller : `, bestSeller);
  }, [bestSeller]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"}></Title>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our top 5 best-selling soccer gear items, trusted by players
          for their quality and performance.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
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

export default BestSeller;
