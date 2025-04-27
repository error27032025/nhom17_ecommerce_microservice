import React, { useState, useEffect, useCallback } from "react";
import { Form } from "react-bootstrap"; // Dùng React-Bootstrap để tạo Checkbox
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // CSS của rc-slider
import styles from "./Filter.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Filter = ({ categories, onFilterChange, selectedCate }) => {
  const [selectedCateId, setSelectedCateId] = useState(selectedCate);
  const [priceRange, setPriceRange] = useState([0, 400000]);

  useEffect(() => {
    setSelectedCateId(selectedCate);
  }, [selectedCate]);

  // Debounce xử lý filter
  const debouncedFilter = useCallback(
    (newFilter) => {
      const timeout = setTimeout(() => {
        onFilterChange(newFilter);
      }, 500); // Debounce 500ms
      return () => clearTimeout(timeout);
    },
    [onFilterChange]
  );

  const handleCheckboxChange = (cateId) => {
    const newCateId = cateId === "all" ? null : cateId;
    setSelectedCateId(newCateId);
    debouncedFilter({ cateId: newCateId, price: priceRange });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    debouncedFilter({ cateId: selectedCateId, price: value });
  };

  return (
    <div
      className={cx("wrapper")}
      style={{
        padding: "20px",
        background: "#f8f9fa",
        borderRadius: "8px",
        width: "250px",
      }}
    >
      <h4>Bộ Lọc</h4>

      {/* Filter by Category */}
      <h5 className={cx("title-1")} style={{ marginTop: "20px" }}>
        Lọc theo danh mục
      </h5>

      {/* Danh sách categories */}
      {categories.map((category) => (
        <Form.Check
          key={category.id}
          type="radio"
          id={`custom-radio-${category.id}`}
          label={category.title}
          checked={selectedCateId === category.id}
          onChange={() => handleCheckboxChange(category.id)}
          className="d-flex align-items-center"
        />
      ))}

      {/* Filter by Price */}
      <h5 className={cx("title-2")} style={{ marginTop: "20px" }}>
        Lọc giá sản phẩm
      </h5>
      <Slider
        range
        min={0}
        max={1000000}
        step={10000}
        value={priceRange}
        onChange={handlePriceChange}
        trackStyle={[{ backgroundColor: "#fc7c7c" }]}
        handleStyle={[{ borderColor: "#fc7c7c" }, { borderColor: "#fc7c7c" }]}
      />
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        Giá: {priceRange[0].toLocaleString()} đ -
        {priceRange[1].toLocaleString()} đ
      </p>
    </div>
  );
};

export default Filter;
