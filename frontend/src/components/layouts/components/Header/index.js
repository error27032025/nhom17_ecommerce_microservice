import { CiSearch, CiShoppingCart } from "react-icons/ci";
import styles from "./Header.module.scss";
import NavBtn from "../NavBtn";
import { Dropdown } from "react-bootstrap";
import logo from "../../../../assets/img/logo/logo.png";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { CiMenuBurger } from "react-icons/ci";
import { RiMenuFold3Line } from "react-icons/ri";
const cx = classNames.bind(styles);

function Header({ toggleOverlay, toggleSearch, toggleMenu }) {
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  const token = localStorage.getItem("token");

  const cartItems = useSelector((state) => state.cart.items);
  return (
    <div className={cx("wrapper")}>
      <div className={cx("top")}>
        <Container>
          <Row className={cx("top-inner")}>
            <Col lg={6} md={12} sm={12} className={cx("welcome")}>
              <p>Tiệm PC Chính Hãng – Bảo Hành 24 tháng, Uy tín, Chất Lượng!</p>
            </Col>

            <Col lg={6} md={12} sm={12} className={cx("infor")}>
              <p className={cx("phone")}>+00 123 456 789</p>
              <p className={cx("email")}>nhom17@iuh.com</p>
              <Dropdown className={cx("account")}>
                <Dropdown.Toggle
                  className={cx("dropdown-toggle")}
                  id="dropdown-basic"
                >
                  Account
                </Dropdown.Toggle>

                <Dropdown.Menu className={cx("dropdown-menu")}>
                  {token ? (
                    <>
                      <Dropdown.Item
                        className={cx("dropdown-item")}
                        href="#/my-account"
                      >
                        <Link to="/orders">Đơn hàng</Link>
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => {
                          localStorage.removeItem("token");
                          window.location.reload();
                        }}
                        className={cx("dropdown-item")}
                      >
                        Log-out
                      </Dropdown.Item>
                    </>
                  ) : (
                    <Dropdown.Item className={cx("dropdown-item")}>
                      <Link to="/auth">Log-in</Link>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={cx("bottom")}>
        <Container className={cx("bottom-inner")}>
          <div className={cx("image")}>
            <Link to="">
              <img
                alt=""
                className={cx("logo")}
                referrerpolicy="origin-when-cross-origin"
                src={logo}
              />
            </Link>
          </div>
          <div className={cx("nav")}>
            {token ? (
              <>
                <NavBtn to="home" label="Home" />
                <NavBtn to="shop" label="Shop" />
                <NavBtn to="cart" label="Cart" />
              </>
            ) : (
              <>
                <NavBtn to="home" label="Home" />
                <NavBtn to="shop" label="Shop" />
              </>
            )}
          </div>
          <div onClick={toggleMenu} className={cx("menu")}><RiMenuFold3Line /></div>
          <div className={cx("right")}>
            {!isCartPage ? (
              <>
                <div onClick={toggleSearch} className={cx("search")}>
                  <CiSearch />
                </div>
                <div onClick={toggleOverlay} className={cx("cart")}>
                  <CiShoppingCart className={cx("icon")} />
                  <div className={cx("count")}>{cartItems.length}</div>
                </div>
              </>
            ) : (
              <div onClick={toggleSearch} className={cx("search")}>
                <CiSearch />
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Header;
