import Breadcrumb from "../../components/Breadcrumb";
import styles from "./CartPrimary.module.scss";
import classNames from "classnames/bind";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import CartTable from "../../components/CartTable";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useRef } from "react";
import axios from "axios";
import { clearCart } from "../../redux/cartSlice";
import { successToast, dangerToast } from "../../redux/toastSlice";
import ScrollReveal from "../../components/layouts/components/ScrollReveal";

const cx = classNames.bind(styles);

function CartPrimary() {
  const dispatch = useDispatch();
  const phoneRef = useRef();
  const nameRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const countryRef = useRef();
  const token = localStorage.getItem("token");
  const cartItems = useSelector((state) => state.cart);
  const [orderedProducts, setOrderedProducts] = useState([]);

  const placeOrder = async () => {
    const shippingAddress = {
      phone: phoneRef.current.value,
      name: nameRef.current.value,
      address: addressRef.current.value,
      city: cityRef.current.value,
      postcode: "100000",
      state: stateRef.current.value,
      country: countryRef.current.value,
    };

    try {
      if (!cartItems.items || cartItems.items.length === 0) {
        dispatch(dangerToast({ message: "Giỏ hàng trống !!!" }));
        return;
      }

      setOrderedProducts(
        cartItems.items.map((prod) => ({
          id: prod.id,
          product_unit_price: parseFloat(prod.price),
          product_quantity: parseInt(prod.quantity, 10),
        }))
      );

      const orderData = { shippingAddress, orderedProducts };
      const response = await axios.post(
        "http://34.87.146.141:3001/api/v1/orders",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        dispatch(successToast({ message: "Đặt hàng thành công !!!" }));
        dispatch(clearCart());
        setOrderedProducts([]);
      }
    } catch (error) {
      dispatch(
        dangerToast({
          message: (
            <div>
              {Array.isArray(error.response.data.message) ? (
                error.response.data.message.map((err, index) => (
                  <div key={index}>{err.replace("shippingAddress.", "")}</div>
                ))
              ) : (
                <div>
                  {error.response.data.message.replace("shippingAddress.", "")}
                </div>
              )}
            </div>
          ),
        })
      );
    }
  };

  return (
    <div className={cx("wrapper")}>
      <ScrollReveal>
        <Breadcrumb page="Giỏ hàng" />
      </ScrollReveal>
      <Container>
        <Row>
          <Col lg={12}>
            <ScrollReveal>
              <CartTable />
            </ScrollReveal>
          </Col>
        </Row>
        <Row>
          <Col>
            <ScrollReveal>
              <div className={cx("total")}>
                <input ref={phoneRef} type="text" placeholder="Số điện thoại" />
                <input ref={nameRef} type="text" placeholder="Tên" />
                <input ref={addressRef} type="text" placeholder="Địa chỉ" />
                <input ref={stateRef} type="text" placeholder="Tỉnh" />
                <input ref={cityRef} type="text" placeholder="Thành phố" />
                <input ref={countryRef} type="text" placeholder="Quốc gia" />
                <Button
                  variant="custom"
                  onClick={placeOrder}
                  className={cx("checkout-btn")}
                >
                  Đặt hàng
                </Button>
              </div>
            </ScrollReveal>    
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CartPrimary;
