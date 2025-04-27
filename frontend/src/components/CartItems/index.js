import styles from "./CartItems.module.scss";
import className from "classnames/bind";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/cartSlice";
const cx = className.bind(styles);

function CartItems({ name, cost, quantity, image, id }) {
  const dispatch = useDispatch();
  return (
    <div className={cx("wrapper")}>
      <div
        className={cx("remove")}
        onClick={() => dispatch(removeFromCart(id))}
      >
        x
      </div>
      <img src={image} alt={name} />
      <div className={cx("details")}>
        <h3>{name}</h3>
        <div className={cx("info")}>
          <p> {quantity}</p>
          <span>x</span>
          <p> {Number(cost).toLocaleString("vi-VN")} đ</p>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
