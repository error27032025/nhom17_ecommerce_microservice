import { FaChevronRight } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import styles from "./Search.module.scss";
import classNames from "classnames/bind";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const cx = classNames.bind(styles);

function Search({ toggleSearch }) {
  const searchRef = useRef();
  const navigate = useNavigate();
  const searchApi = async () => {
    try {
      const searchValue = searchRef.current.value.trim();
      if (!searchValue) return; // Nếu input rỗng, không tìm kiếm

      await axios.get(
        "http://34.87.146.141:3001/api/v1/products/with-filters",
        {
          params: { search: searchValue },
        }
      );
      navigate(`/shop?search=${encodeURIComponent(searchValue)}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={cx("wrapper")}>
      <div onClick={toggleSearch} className={cx("exit")}>
        <FaChevronRight />
      </div>
      <div className={cx("search")}>
        <input
          ref={searchRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchApi();
              toggleSearch();
            }
          }}
          type="text"
          placeholder="Search products"
        />
        <IoIosSearch />
      </div>
    </div>
  );
}

export default Search;
