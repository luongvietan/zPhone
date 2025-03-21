import { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  getProducts,
  uploadImage,
  getBrands,
  getCategories,
} from "../../services/productService";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Save, ArrowLeft } from "lucide-react";

const ProductForm = ({ product = {} }) => {
  const [formData, setFormData] = useState({
    product_name: product.product_name || "",
    product_description: product.product_description || "",
    product_image: product.product_image || [],
    stock_quantity: product.stock_quantity || 0,
    brand_id: product.brand_id || "",
    category_id: product.category_id || "",
    variants: product.variants || [],
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      // Tự động tạo product_id khi tạo sản phẩm mới
      const fetchLastProductId = async () => {
        const products = await getProducts();
        const lastProductId =
          products.length > 0 ? products[products.length - 1].product_id : 0;
        setFormData((prev) => ({ ...prev, product_id: lastProductId + 1 }));
      };
      fetchLastProductId();
    }

    // Lấy danh sách brands và categories
    const fetchBrandsAndCategories = async () => {
      const brandsData = await getBrands();
      const categoriesData = await getCategories();
      setBrands(brandsData);
      setCategories(categoriesData);
    };
    fetchBrandsAndCategories();
  }, [id]);
  // console.log("Brands:", brands);
  // console.log("Categories:", categories);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, e) => {
    const newVariants = [...formData.variants];
    newVariants[index][e.target.name] = e.target.value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { storage: "", product_price: 0, product_sku: "" },
      ],
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileName = await uploadImage(file); // Gọi API upload ảnh và lấy tên tệp
        setFormData({ ...formData, product_image: [fileName] }); // Lưu tên tệp vào formData
        setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh preview
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data before submit:", formData);

    // Chuyển đổi category_id thành số nếu cần
    const updatedFormData = {
      ...formData,
      category_id: Number(formData.category_id),
    };

    try {
      if (id) {
        await updateProduct(id, updatedFormData);
      } else {
        await createProduct(updatedFormData);
      }
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
  useEffect(() => {
    if (!id) {
      // Tự động tạo product_id khi tạo sản phẩm mới
      const fetchLastProductId = async () => {
        const products = await getProducts();
        const lastProductId =
          products.length > 0 ? products[products.length - 1].product_id : 0;
        setFormData((prev) => ({ ...prev, product_id: lastProductId + 1 }));
      };
      fetchLastProductId();
    }

    // Lấy danh sách brands và categories
    const fetchBrandsAndCategories = async () => {
      try {
        const brandsData = await getBrands();
        const categoriesData = await getCategories();
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching brands and categories:", error);
      }
    };
    fetchBrandsAndCategories();
  }, [id]);
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {id ? "Edit Product" : "Create New Product"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand.brand_id}>
                      {brand.brand_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  name="product_image"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {previewImage && (
                  <img
                    src={`https://zphone.onrender.com/uploads/${formData.product_image[0]}`} // Xây dựng lại đường dẫn
                    alt="Product Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Variants
                  </h2>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </button>
                </div>

                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="p-4 mb-4 bg-gray-50 rounded-lg space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage
                      </label>
                      <input
                        type="text"
                        name="storage"
                        value={variant.storage}
                        onChange={(e) => handleVariantChange(index, e)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        name="product_price"
                        value={variant.product_price}
                        onChange={(e) => handleVariantChange(index, e)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        name="product_sku"
                        value={variant.product_sku}
                        onChange={(e) => handleVariantChange(index, e)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
