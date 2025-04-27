import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import styles from "./Slider.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles); // Kết nối với SCSS

const CustomPrevArrow = ({ onClick }) => (
  <div className={cx("slick-prev")} onClick={onClick}>
    <FaChevronLeft />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className={cx("slick-next")} onClick={onClick}>
    <FaChevronRight />
  </div>
);

export default function SimpleSlider({ children }) {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />, // Sử dụng mũi tên trái tùy chỉnh
    nextArrow: <CustomNextArrow />, // Sử dụng mũi tên phải tùy chỉnh
    responsive: [
      {
        breakpoint: 992, // Màn hình nhỏ hơn hoặc bằng 1024px
        settings: {
          slidesToShow: 3, // Hiển thị 3 slide
          slidesToScroll: 1, // Scroll 1 slide
          infinite: true,
        },
      },
      {
        breakpoint: 768, // Màn hình nhỏ hơn hoặc bằng 768px
        settings: {
          slidesToShow: 2, // Hiển thị 2 slide
          slidesToScroll: 1,
          arrows: false
        },
      },
      {
        breakpoint: 500, // Màn hình nhỏ hơn hoặc bằng 480px
        settings: {
          slidesToShow: 1, // Hiển thị 1 slide
          slidesToScroll: 1,
           arrows: false
        },
      },
    ],
  };
  return <Slider {...settings}>{children}</Slider>;
}
