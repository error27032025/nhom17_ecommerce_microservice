import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import classNames from "classnames/bind";
import styles from "./Filter.module.scss";

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

  const handleCategoryChange = (cateId) => {
    // Nếu chọn "Tất cả" (cateId === null), chuyển thành null
    const newCateId = cateId === null ? null : cateId;
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
        padding: 20,
        background: "#f8f9fa",
        borderRadius: 8,
        width: 250,
      }}
    >
      <h4>Bộ Lọc</h4>

      <h5 className={cx("title-1")} style={{ marginTop: 20 }}>
        Lọc theo danh mục
      </h5>

      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category, index) => {
          const id = category?.categoryId ?? `unknown-${index}`;
          const label = category?.categoryTitle ?? `Danh mục ${index + 1}`;
          return (
            <Form.Check
              key={`cate-${id}`}
              type="radio"
              id={`custom-radio-${id}`}
              label={label}
              name="categoryFilter"
              checked={selectedCateId === category.categoryId}
              onChange={() => handleCategoryChange(category.categoryId)}
              className="d-flex align-items-center"
            />
          );
        })
      ) : (
        <p>Không có danh mục</p>
      )}

      <h5 className={cx("title-2")} style={{ marginTop: 20 }}>
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
      <p style={{ marginTop: 10, fontWeight: "bold" }}>
        Giá: {priceRange[0].toLocaleString()} $ -{" "}
        {priceRange[1].toLocaleString()} $
      </p>
    </div>
  );
};

export default Filter;
