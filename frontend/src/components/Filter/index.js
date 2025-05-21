import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./Filter.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Filter = ({ categories = [], onFilterChange, selectedCate }) => {
  const [selectedCateId, setSelectedCateId] = useState(selectedCate);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const timeoutRef = useRef(null);

  useEffect(() => {
    setSelectedCateId(selectedCate);
  }, [selectedCate]);

  const debounceFilter = useCallback(
    (newFilter) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onFilterChange(newFilter);
      }, 500);
    },
    [onFilterChange]
  );

  const handleCheckboxChange = (cateId) => {
    const newCateId = cateId === "all" ? null : cateId;
    setSelectedCateId(newCateId);
    debounceFilter({ cateId: newCateId, price: priceRange });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    debounceFilter({ cateId: selectedCateId, price: value });
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
      {Array.isArray(categories) &&
        categories.map((category, index) => {
          const id = category?.id ?? `unknown-${index}`;
          const label = category?.title ?? `Danh mục ${index + 1}`;
          return (
            <Form.Check
              key={`cate-${id}`} // đảm bảo key duy nhất và ổn định
              type="radio"
              id={`custom-radio-${id}`}
              label={label}
              checked={selectedCateId === category.id}
              onChange={() => handleCheckboxChange(category.id)}
              className="d-flex align-items-center"
            />
          );
        })}

      {/* Filter by Price */}
      <h5 className={cx("title-2")} style={{ marginTop: "20px" }}>
        Lọc giá sản phẩm
      </h5>
      <Slider
        range
        min={0}
        max={10000}
        step={500}
        value={priceRange}
        onChange={handlePriceChange}
        trackStyle={[{ backgroundColor: "#fc7c7c" }]}
        handleStyle={[{ borderColor: "#fc7c7c" }, { borderColor: "#fc7c7c" }]}
      />
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        Giá: {priceRange[0].toLocaleString()} $ -{" "}
        {priceRange[1].toLocaleString()} $
      </p>
    </div>
  );
};

export default Filter;
