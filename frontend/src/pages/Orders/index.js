import Breadcrumb from "../../components/Breadcrumb";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Orders.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollReveal from "../../components/layouts/components/ScrollReveal";

const cx = classNames.bind(styles);

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersApi = async () => {
      try {
        const response = await axios.get(
          "http://34.87.146.141:3001/api/v1/orders"
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    ordersApi();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <Breadcrumb page="Orders" />
      <Container>
        <Row>
          <Col lg={12}>
            <ScrollReveal>
              <div className={cx("orders-container")}>
                <h2 className={cx("title")}>MY ORDERS</h2>
                <table className={cx("orders-table")}>
                  <thead>
                    <tr>
                      <th>ORDER</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td>#{order.id}</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>{order.status}</td>
                        <td>
                          {order.products
                            .reduce(
                              (total, prod) =>
                                total +
                                Number(prod.product_unit_price) *
                                  prod.product_quantity,
                              0
                            )
                            .toLocaleString("vi-VN")}{" "}
                          đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Orders;
