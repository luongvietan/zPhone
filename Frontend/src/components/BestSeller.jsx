import React, { useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import api from "../api";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await api.get("api/orders/stats/top-selling");
        setBestSeller(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
        setBestSeller([]);
      }
    };
    fetchTopSellingProducts();
  }, []);

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
        {bestSeller.slice(0, 5).map((item, index) => {
          const price = item.product_price?.[0] ?? 0; // Giá trị mặc định là 0 nếu không có giá
          return (
            <ProductItem
              key={item._id}
              product_id={item._id}
              product_image={item.product_image}
              product_name={item.product_name}
              price={price}
              stock_quantity={item.stock_quantity ?? 0} // Thêm stock_quantity, mặc định là 0 nếu không có
            />
          );
        })}
      </div>
    </div>
  );
};

export default BestSeller;
