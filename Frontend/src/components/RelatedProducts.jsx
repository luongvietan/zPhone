import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ brand, category }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (
      products.length > 0 &&
      (brand !== undefined || category !== undefined)
    ) {
      // Lọc sản phẩm có cùng brand hoặc category
      let filteredProducts = products.filter(
        (item) => item.brand_id === brand || item.category_id === category
      );

      // Loại bỏ sản phẩm hiện tại (nếu có) để không hiển thị sản phẩm đang xem
      filteredProducts = filteredProducts.filter(
        (item) => item.brand_id !== brand || item.category_id !== category
      );

      // Chọn ngẫu nhiên 5 sản phẩm từ danh sách đã lọc
      const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());
      setRelated(shuffledProducts.slice(0, 5));
    }
  }, [products, brand, category]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item.product_id}
            product_id={item.product_id}
            product_name={item.product_name}
            price={item.variants?.[0]?.product_price ?? 0}
            product_image={item.product_image ?? ["fallback-image"]}
            stock_quantity={item.stock_quantity ?? 0} // Thêm stock_quantity, mặc định là 0 nếu không có
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
