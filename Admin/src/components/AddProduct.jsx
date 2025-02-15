import React, { useState } from "react";
import api from "../api";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// eslint-disable-next-line react/prop-types
const AddProduct = ({ onProductAdded }) => {
  const [pid, setPid] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [image, setImage] = useState(Array(4).fill(null));
  const [sizes, setSizes] = useState([]); // Thay đổi state để lưu nhiều size

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSizes(
      (prevSizes) =>
        prevSizes.includes(value)
          ? prevSizes.filter((size) => size !== value) // Xóa size nếu đã chọn
          : [...prevSizes, value] // Thêm size nếu chưa chọn
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      pid: pid,
      name: name,
      price: price,
      description: description,
      category: category,
      subCategory: subCategory,
      image: image
        .filter((img) => img !== null)
        .map((img) => img.name.split(".")[0]),
      sizes: sizes, // Thêm sizes vào newProduct
    };
    console.log(newProduct); // Kiểm tra dữ liệu gửi đi
    try {
      const response = await api.post("/products", newProduct);
      // Đặt lại các giá trị về ban đầu
      setPid("");
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setSubCategory("");
      setImage(Array(4).fill(null));
      setSizes([]);
      onProductAdded();
    } catch (error) {
      console.error("Error submitting form:", error); // Xử lý lỗi
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      console.log("file", file);
      try {
        const response = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newImages = [...image];
        newImages[index] = new File(
          [file],
          file.name.replace(/\.[^/.]+$/, ".png"),
          { type: "image/png" }
        ); // Chuyển đổi định dạng file sang .png
        setImage(newImages);
        console.log(`newImages : `, newImages);
      } catch (error) {
        console.error("Error uploading image:", error); // Xử lý lỗi
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto ">
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          id="product_name"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label
          htmlFor="product_name"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Name
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          id="product_id"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          required
        />
        <label
          htmlFor="product_id"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product ID
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <textarea
          id="product_description"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label
          htmlFor="product_description"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Description
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          id="product_price"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <label
          htmlFor="product_price"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Product Price
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group ">
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel className="text-sm text-gray-500 dark:text-gray-400">
              Category
            </InputLabel>
            <Select
              className="text-sm text-gray-900"
              id="category"
              value={category}
              label="category"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <MenuItem value="Premier League">Premier League</MenuItem>
              <MenuItem value="La Liga">La Liga</MenuItem>
              <MenuItem value="Bundesliga">Bundesliga</MenuItem>
              <MenuItem value="Serie A">Serie A</MenuItem>
              <MenuItem value="Ligue 1">Ligue 1</MenuItem>
              <MenuItem value="National">National</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">SubCategory</InputLabel>
            <Select
              id="subcategory"
              value={subCategory}
              label="subcategory"
              onChange={(e) => setSubCategory(e.target.value)}
              required
            >
              <MenuItem value="Men">Men</MenuItem>
              <MenuItem value="Women">Women</MenuItem>
              <MenuItem value="Kids">Kids</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Upload Image
        </label>
        <div className="flex space-x-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center"
            >
              {image[index] ? ( // Kiểm tra nếu đã có ảnh
                <img
                  src={URL.createObjectURL(image[index])}
                  alt={`Uploaded ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="hidden"
                    id={`upload_image_${index}`}
                  />
                  <label
                    htmlFor={`upload_image_${index}`}
                    className="cursor-pointer text-gray-500"
                  >
                    Upload
                  </label>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Select Sizes
        </label>
        <div className="flex space-x-4">
          {["S", "M", "L", "XL"].map((sizeOption) => (
            <div key={sizeOption}>
              <input
                type="checkbox" // Sử dụng checkbox để chọn nhiều size
                id={sizeOption}
                value={sizeOption}
                checked={sizes.includes(sizeOption)}
                onChange={handleSizeChange} // Cập nhật sizes
              />
              <label htmlFor={sizeOption} className="ml-2">
                {sizeOption}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      >
        Add Product
      </button>
      <br />
      <br />
    </form>
  );
};

export default AddProduct;
