import React, { useEffect, useState } from "react";
import api from "../api";

// eslint-disable-next-line react/prop-types
const ProductList = ({ refresh }) => {
  const [products, setProducts] = useState([]);

  const removeProduct = async (pid) => {
    await api.delete(`/products/${pid}`);
    setProducts(products.filter((product) => product.pid !== pid));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.get("/products");
      setProducts(response.data);
    };
    fetchProducts();
  }, [refresh]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">PID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">SubCategory</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Sizes</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={`${product.pid}-${index}`} // Sử dụng pid kết hợp với index để tạo khóa duy nhất
              >
                <td className="px-4 py-4">{product.pid}</td>
                <td className="px-4 py-4">{product.name}</td>
                <td className="px-4 py-4">${product.price}</td>
                <td className="px-4 py-4">{product.category}</td>
                <td className="px-4 py-4">{product.subCategory}</td>
                <td className="px-4 py-4">
                  <img
                    src={`http://localhost:5000/assets/${product.image[0]}.png`}
                    alt={product.name}
                    className="w-16 h-auto object-cover"
                  />
                </td>
                <td className="px-4 py-4">
                  <p>
                    {Array.isArray(product.sizes) && product.sizes.length > 0
                      ? product.sizes.join(", ")
                      : "No sizes available"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => removeProduct(product.pid)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
