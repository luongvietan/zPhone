import React, { useContext, useEffect, useState, useCallback } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import api from "../api";
import { MdArrowDropDown } from "react-icons/md";

const Collection = () => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
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
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("default");

  const toggleBrand = (e) => {
    if (brand.includes(e.target.value)) {
      setBrand((previous) =>
        previous.filter((item) => item !== e.target.value)
      );
    } else {
      setBrand((previous) => [...previous, e.target.value]);
    }
  };
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((previous) =>
        previous.filter((item) => item !== e.target.value)
      );
    } else {
      setCategory((previous) => [...previous, e.target.value]);
    }
  };
  const applyFilter = useCallback(() => {
    let productCopy = [...products];

    if (showSearch && search) {
      productCopy = productCopy.filter((item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand.length > 0) {
      productCopy = productCopy.filter((item) =>
        brand.includes(item.brand_id.toString())
      );
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category_id.toString())
      );
    }

    switch (sortType) {
      case "low-high":
        productCopy.sort(
          (a, b) => a.variants[0].product_price - b.variants[0].product_price
        );
        break;
      case "high-low":
        productCopy.sort(
          (a, b) => b.variants[0].product_price - a.variants[0].product_price
        );
        break;
      default:
        break;
    }

    setFilterProducts(productCopy);
  }, [products, category, brand, search, showSearch, sortType]);

  useEffect(() => {
    applyFilter();
  }, [brand, category, search, showSearch, sortType, applyFilter]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTER
          <MdArrowDropDown
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
          />
        </p>
        {/* Brand Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">BRAND</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="1"
                onChange={toggleBrand}
              />
              Apple
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="2"
                onChange={toggleBrand}
              />
              Samsung
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="3"
                onChange={toggleBrand}
              />
              Xiaomi
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="4"
                onChange={toggleBrand}
              />
              OPPO
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="5"
                onChange={toggleBrand}
              />
              Vivo
            </p>
          </div>
        </div>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="1"
                onChange={toggleCategory}
              />
              Smartphones
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="2"
                onChange={toggleCategory}
              />
              Gaming Phones
            </p>
          </div>
        </div>
      </div>
      {/* Right side (Collection) */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="default">Sort by: Default</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={item.id || item._id}
              product_id={item.product_id || item._id}
              product_image={item.product_image || item.images}
              product_name={item.product_name || item.product_name}
              price={parseFloat(item.variants[0].product_price)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
