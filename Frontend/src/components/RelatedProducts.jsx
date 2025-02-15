import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ brand, category }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && brand !== undefined && category !== undefined) {
      let filteredProducts = products.filter(
        (item) => item.brand_id === brand && item.category_id === category
      );
      setRelated(filteredProducts.slice(0, 5)); // Take up to 5 related products
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
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
