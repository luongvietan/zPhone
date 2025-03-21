/* eslint-disable react/no-unescaped-entities */
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import api from "../api";
import { MdArrowDropDown, MdOutlineCancel } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { ShopContext } from "../context/ShopContext";
import { Spinner } from "@material-tailwind/react";

const Collection = () => {
  const { filteredProducts, search, setSearch } = useContext(ShopContext);
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("default");
  const [visibleProductsCount, setVisibleProductsCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const lastProductRef = useRef(null);
  // Refs để theo dõi giá trị hiện tại của state
  const visibleProductsCountRef = useRef(visibleProductsCount);
  const filterProductsRef = useRef(filterProducts);

  // Cập nhật ref khi state thay đổi
  useEffect(() => {
    visibleProductsCountRef.current = visibleProductsCount;
  }, [visibleProductsCount]);

  useEffect(() => {
    filterProductsRef.current = filterProducts;
  }, [filterProducts]);

  // Reset số lượng sản phẩm hiển thị khi bộ lọc thay đổi
  useEffect(() => {
    setVisibleProductsCount(12);
  }, [filterProducts]);
  // Optimized scroll handler với Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (
        firstEntry.isIntersecting &&
        !isLoading &&
        visibleProductsCount < filterProducts.length
      ) {
        setIsLoading(true);
        // Giả lập API call nhanh hơn
        setTimeout(() => {
          setVisibleProductsCount((prev) => prev + 12);
          setIsLoading(false);
        }, 100); // Giảm thời gian delay
      }
    }, options);

    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }

    return () => {
      if (lastProductRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(lastProductRef.current);
      }
    };
  }, [isLoading, visibleProductsCount, filterProducts.length]);
  // Reset số lượng sản phẩm hiển thị khi filter thay đổi
  useEffect(() => {
    setVisibleProductsCount(12);
    // Cuộn lên đầu trang khi filter thay đổi
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filterProducts]);
  // Xử lý scroll
  useEffect(() => {
    const throttle = (func, limit) => {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const handleScroll = throttle(() => {
      if (
        visibleProductsCountRef.current >= filterProductsRef.current.length ||
        isLoading
      )
        return;

      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleProductsCount((prev) => prev + 12);
          setIsLoading(false);
        }, 500); // Giả lập thời gian tải
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

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

    if (search) {
      productCopy = productCopy.filter((item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand.length > 0) {
      productCopy = productCopy.filter(
        (item) => item.brand_id && brand.includes(item.brand_id.toString())
      );
    }

    if (category.length > 0) {
      productCopy = productCopy.filter(
        (item) =>
          item.category_id && category.includes(item.category_id.toString())
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
  }, [products, category, brand, search, sortType]);

  useEffect(() => {
    applyFilter();
  }, [brand, category, search, showSearch, sortType, applyFilter]);

  const handleProductClick = () => {
    setShowSearch(false);
    setSearch("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        {/* Filter Section */}
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
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="flex gap-2 items-center">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={value}
                    onChange={toggleBrand}
                  />
                  {getBrandName(value)}
                </label>
              ))}
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
              {[1, 2].map((value) => (
                <label key={value} className="flex gap-2 items-center">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={value}
                    onChange={toggleCategory}
                  />
                  {getCategoryName(value)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
            {search ? (
              <h2 className="text-2xl font-bold">
                Search results for: {search}
              </h2>
            ) : (
              <Title text1={"ALL"} text2={"COLLECTIONS"} />
            )}

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="flex items-center gap-2">
                {showSearch ? (
                  <>
                    <CiSearch className="w-6 h-6 text-gray-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="text-sm outline-none bg-transparent border-b-2 border-gray-300 focus:border-black w-32 transition-all"
                      type="text"
                      placeholder="Search products..."
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        setSearch("");
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MdOutlineCancel className="w-5 h-5 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <CiSearch className="w-6 h-6 text-gray-500 cursor-pointer" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                onChange={(e) => setSortType(e.target.value)}
                className="border-2 border-gray-300 text-sm px-2 py-1 rounded"
              >
                <option value="default">Sort by: Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filterProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products found</p>
          ) : (
            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
                {filterProducts
                  .slice(0, visibleProductsCount)
                  .map((item, index) => {
                    if (index === visibleProductsCount - 1) {
                      return (
                        <div ref={lastProductRef} key={item.id || item._id}>
                          <ProductItem
                            product_id={item.product_id || item._id}
                            product_image={item.product_image || item.images}
                            product_name={
                              item.product_name || item.product_name
                            }
                            price={parseFloat(item.variants[0].product_price)}
                            stock_quantity={item.stock_quantity ?? 0} // Thêm stock_quantity, mặc định là 0 nếu không có
                            onClick={handleProductClick}
                          />
                        </div>
                      );
                    }
                    return (
                      <ProductItem
                        key={item.id || item._id}
                        product_id={item.product_id || item._id}
                        product_image={item.product_image || item.images}
                        product_name={item.product_name || item.product_name}
                        price={parseFloat(item.variants[0].product_price)}
                        stock_quantity={item.stock_quantity ?? 0} // Thêm stock_quantity, mặc định là 0 nếu không có
                        onClick={handleProductClick}
                      />
                    );
                  })}
              </div>
              {/* Hiển thị Spinner khi đang tải */}
              {isLoading && (
                <div className="w-full flex justify-center my-8">
                  <Spinner className="h-8 w-8" />
                </div>
              )}
              {!isLoading && visibleProductsCount >= filterProducts.length && (
                <p className="text-center text-gray-500 mt-4">
                  You've reached the end of products
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for brand/category names
const getBrandName = (id) => {
  const brands = {
    1: "Apple",
    2: "Samsung",
    3: "Xiaomi",
    4: "OPPO",
    5: "Vivo",
  };
  return brands[id] || "Unknown Brand";
};

const getCategoryName = (id) => {
  const categories = {
    1: "Smartphones",
    2: "Gaming Phones",
  };
  return categories[id] || "Unknown Category";
};

export default Collection;
