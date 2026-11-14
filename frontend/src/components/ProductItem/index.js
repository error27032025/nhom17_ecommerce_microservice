import styles from "./ProductItem.module.scss";

import { FaRegEye } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { successToast } from "../../redux/toastSlice";

const cx = classNames.bind(styles);

function ProductItem({ name, price, image, id, to }) {
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    dispatch(successToast({ message: "Sản phẩm đã thêm vào giỏ hàng" }));
    dispatch(addToCart({ name, price, image, id, quantity: 1 }));
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 0 }).format(
      price
    );
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("img")}>
        <img src={image} alt={name} />
      </div>
      <div className={cx("action")}>
        <div onClick={handleAddToCart} className={cx("add")}>
          <CiShoppingCart />
        </div>
        <Link to={to}>
          <div className={cx("view")}>
            <FaRegEye />
          </div>
        </Link>
      </div>
      <div className={cx("text")}>
        <Link to="/"> {name}</Link>
        <div className={cx("price")}>{formatCurrency(price)}</div>
      </div>
    </div>
  );
}

export default ProductItem;
