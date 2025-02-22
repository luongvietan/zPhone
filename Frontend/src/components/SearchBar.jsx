// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CiSearch } from "react-icons/ci";
// import { MdOutlineCancel } from "react-icons/md";

// const SearchBar = () => {
//   const { search, setSearch, showSearch, setShowSearch } =
//     useContext(ShopContext);
//   const [visible, setVisible] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();

//   //   useEffect(() => {
//   //     if (location.pathname.includes("collection")) {
//   //       setVisible(true);
//   //     } else {
//   //       setVisible(false);
//   //       if (showSearch) {
//   //         navigate("/collection");
//   //       }
//   //     }
//   //   }, [location, showSearch, navigate]);

//   if (!showSearch) return null;

//   return (
//     <>
//       <div className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
//           <CiSearch className="w-6 h-6 text-gray-500 cursor-pointer" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1 text-lg outline-none bg-transparent"
//             type="text"
//             placeholder="Search"
//             autoFocus
//           />
//           <button
//             onClick={() => {
//               setShowSearch(false);
//               setSearch("");
//             }}
//             className="p-2 hover:bg-gray-100 rounded-full"

//           >
//             <MdOutlineCancel className="w-6 h-6 text-gray-500" />
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SearchBar;
