import { FaChevronRight } from "react-icons/fa6";

import styles from "./Cart.module.scss";
import classNames from "classnames/bind";
import CartItems from "../../../CartItems";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../../redux/cartSlice";
const cx = classNames.bind(styles);

function Cart({ toggleOverlay }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };
  const token = localStorage.getItem("token")
  // 🔹 Tính tổng tiền
  const total = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  console.log(cartItems);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2>Cart</h2>
        <div onClick={toggleOverlay} className={cx("close")}>
          <FaChevronRight />
        </div>
      </div>

      <div className={cx("content")}>
        {cartItems.map((item) => (
          <CartItems
            key={item.id} 
            remove={handleRemove}
            name={item.name}
            cost={item.price}
            quantity={item.quantity}
            image={item.image}
            id={item.id} 
          />
        ))}
      </div>

      <div className={cx("total")}>
        Total: {total.toLocaleString("vi-VN")} đ
      </div>
      <div className={cx("button")}>
        
        {token ?(<Link to="/cart">
          <button onClick={toggleOverlay}>Xem giỏ hàng</button>
        </Link>):(<Link to="auth">
        <button onClick={toggleOverlay}>Đăng nhập</button>

        </Link>)}
      </div>
    </div>
  );
}

export default Cart;
