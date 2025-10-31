import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import "./style.css";

const apiURL = process.env.REACT_APP_API_URL;

// -------------------- Category List --------------------
const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getAllCategory();
        if (responseData?.Categories) {
          setCategories(responseData.Categories);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`${data.categoryListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="py-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories && categories.length > 0 ? (
          categories.map((item, index) => (
            <Fragment key={index}>
              <div
                onClick={() => history.push(`/products/category/${item._id}`)}
                className="col-span-1 m-2 flex flex-col items-center justify-center space-y-2 cursor-pointer"
              >
                <img
                  src={`${apiURL}/uploads/categories/${item.cImage}`}
                  alt={item.cName}
                />
                <div className="font-medium">{item.cName}</div>
              </div>
            </Fragment>
          ))
        ) : (
          <div className="text-xl text-center my-4">No Category</div>
        )}
      </div>
    </div>
  );
};

// -------------------- Filter List --------------------
const FilterList = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [range, setRange] = useState(0);

  const fetchData = async (price) => {
    if (price === "all") {
      try {
        const responseData = await getAllProduct();
        if (responseData?.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch({ type: "loading", payload: true });
      try {
        setTimeout(async () => {
          const responseData = await productByPrice(price);
          if (responseData?.Products) {
            dispatch({ type: "setProducts", payload: responseData.Products });
          }
          dispatch({ type: "loading", payload: false });
        }, 700);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const rangeHandle = (e) => {
    const value = e.target.value;
    setRange(value);
    fetchData(value);
  };

  const closeFilterBar = () => {
    fetchData("all");
    dispatch({
      type: "filterListDropdown",
      payload: !data.filterListDropdown,
    });
    setRange(0);
  };

  return (
    <div className={`${data.filterListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col">
        <div className="font-medium py-2">Filter by price</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2 w-2/3 lg:w-2/4">
            <label htmlFor="points" className="text-sm">
              Price (between 0 and 1000₹):{" "}
              <span className="font-semibold text-yellow-700">
                {range}.00₹
              </span>
            </label>
            <input
              value={range}
              className="slider"
              type="range"
              id="points"
              min="0"
              max="1000"
              step="10"
              onChange={rangeHandle}
            />
          </div>
          <div onClick={closeFilterBar} className="cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- Search --------------------
const Search = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState([]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const fetchData = async () => {
      dispatch({ type: "loading", payload: true });
      timeoutId = setTimeout(async () => {
        try {
          const responseData = await getAllProduct();
          if (isMounted && responseData?.Products) {
            setPa(responseData.Products);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (isMounted) dispatch({ type: "loading", payload: false });
        }
      }, 700);
    };

    fetchData();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dispatch]); // ✅ fixed ESLint warning

  const searchHandle = (e) => {
    setSearch(e.target.value);
    dispatch({
      type: "searchHandleInReducer",
      payload: e.target.value,
      productArray,
    });
  };

  const closeSearchBar = () => {
    dispatch({ type: "searchDropdown", payload: !data.searchDropdown });
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  return (
    <div
      className={`${
        data.searchDropdown ? "" : "hidden"
      } my-4 flex items-center justify-between`}
    >
      <input
        value={search}
        onChange={searchHandle}
        className="px-4 text-xl py-4 focus:outline-none"
        type="text"
        placeholder="Search products..."
      />
      <div onClick={closeSearchBar} className="cursor-pointer">
        <svg
          className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};

// -------------------- Wrapper --------------------
const ProductCategoryDropdown = () => {
  return (
    <Fragment>
      <CategoryList />
      <FilterList />
      <Search />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
