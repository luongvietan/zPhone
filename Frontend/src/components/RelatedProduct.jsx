import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import PropTypes from "prop-types";
import api from "../api";

const RelatedProducts = ({ brand_id, category_id }) => {
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
  const [related, setRelated] = useState([]);
  useEffect(() => {
    if (products.length > 0) {
      let productCopy = products.slice();

      productCopy = productCopy.filter((item) => brand_id === item.category);
      productCopy = productCopy.filter(
        (item) => category_id === item.subCategory
      );
      setRelated(productCopy.slice(1, 6));
    }
  }, [brand_id, category_id, products]);
  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
        {related.map((item, index) => (
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

RelatedProducts.propTypes = {
  brand_id: PropTypes.number.isRequired,
  category_id: PropTypes.number.isRequired,
};

export default RelatedProducts;
