import React from "react";
import { Table, Button } from "react-bootstrap";
import styles from "./CartTable.module.scss";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  addToCart,
  handleSubtract,
} from "../../redux/cartSlice";
const cx = classNames.bind(styles);

const CartTable = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };
  const handleAddItem = (item) => {
    dispatch(addToCart(item));
  };
  const handleSubtractItem = (id) => {
    dispatch(handleSubtract(id));
  };

  return (
    <div className={cx("wrapper")}>
      <Table className={cx("table")} responsive bordered hover>
        <thead>
          <tr>
            <th>Xóa</th>
            <th>Ảnh</th>
            <th>Giá</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>
                <Button onClick={() => handleRemove(item.id)}>&times;</Button>
              </td>
              <td>
                <img
                  src={item.image}
                  alt="product"
                  style={{ width: 50, height: 50 }}
                />
              </td>
              <td>
                {new Intl.NumberFormat("vi-VN").format(Number(item.price) || 0)}{" "}
                đ
              </td>

              <td>
                <div className={cx("quantity-buttons")}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleSubtractItem(item)}
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleAddItem(item)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>
                {new Intl.NumberFormat("vi-VN").format(
                  Number(item.price) * (item.quantity || 1)
                )}{" "}
                đ
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CartTable;
