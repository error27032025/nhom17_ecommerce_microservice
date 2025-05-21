import centerBanner from "../../assets/img/bg/hero-banner-shape.png";
import Pill from "../../components/Pill";
import cateImg1 from "../../assets/img/product/banh-man.jpg";
import cateImg2 from "../../assets/img/product/banh-ngot.jpg";
import cateImg3 from "../../assets/img/product/banh-tcay.jpg";
import cateImg4 from "../../assets/img/product/banh-pizza.jpeg";
import ProductItem from "../../components/ProductItem";
import banner1 from "../../assets/img/bg/banner1.png";
import banner2 from "../../assets/img/bg/banner2.png";
import styles from "./Home.module.scss";
import SimpleSlider from "../../components/Slider";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ScrollReveal from "../../components/layouts/components/ScrollReveal";

const cx = classNames.bind(styles);

function Home() {
  const navigate = useNavigate();
  const cateImg = [cateImg1, cateImg2, cateImg3, cateImg4];
  const [products, setProducts] = useState([]);
  const [cate, setCate] = useState([]);

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const response = await axios.get(
          "http://192.168.100.53:8086/api/categories"
        );
        setCate(response.data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCate();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://192.168.100.53:8086/api/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleCateNavi = (cateId) => {
    navigate(`/shop?category=${cateId}`);
  };

  return (
    <ScrollReveal>
      <div className={cx("wrapper")}>
        {/* Banner chính */}
        <Container fluid className={cx("banner")}>
          <Container>
            <Row>
              <Col lg={6} md={6} xs={12}>
                <div className={cx("inner")}>
                  <div className={cx("sale-off")}>
                    <span
                      style={{ color: "var(--active)", marginRight: "10px" }}
                    >
                      70%
                    </span>
                    <h3 style={{ fontSize: "30px" }}>Giảm sốc !!!</h3>
                  </div>
                  <div className={cx("description")}>
                    Máy Ngon, Giá Giảm – Mua Thả Ga!
                  </div>
                  <Pill to="shop" large />
                </div>
              </Col>
              <Col lg={6} md={6} xs={12} className="d-none d-md-block">
                <div className={cx("banner-img")}>
                  <motion.img
                    alt="banner"
                    src={centerBanner}
                    animate={{ y: [0, -30, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Container>

        {/* Danh mục */}
        <Container>
          <Row className={cx("services")}>
            {cate.slice(0, 4).map((category, index) => (
              <Col lg={3} md={6} sm={12} key={category.id}>
                <div className={cx("service")}>
                  <img alt={category.imageUrl} src={category.imageUrl} />
                  <button onClick={() => handleCateNavi(category.id)}>
                    {category.title}
                  </button>
                  <p>{category.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Banner nhỏ */}
        <Container>
          <div className={cx("small-banner")}>
            <Row className="flex-column flex-lg-row">
              <Col lg={6}>
                <div className={cx("banner1")}>
                  <img alt="banner1" src={banner1} />
                  <div className={cx("banner1-desc")}>
                    <h3>
                      <span
                        style={{ color: "var(--active)", marginRight: "10px" }}
                      >
                        70%
                      </span>
                      Giảm sốc !!!
                    </h3>
                    <h2>Giảm giá sốc !!!!</h2>
                    <Pill to="shop" small />
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className={cx("banner2")}>
                  <img alt="banner2" src={banner2} />
                  <div className={cx("banner2-desc")}>
                    <h3>
                      <span
                        style={{ color: "var(--active)", marginRight: "10px" }}
                      >
                        70%
                      </span>
                      Giảm sốc !!!
                    </h3>
                    <h2>PC & Laptop</h2>
                    <Pill to="shop" small />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* Sản phẩm nổi bật */}
        <Container>
          <div className={cx("product-header")}>
            <h2>Máy hot !!!</h2>
            <div className={cx("product-nav")}>
              <Link to="/shop">Xem thêm...</Link>
            </div>
          </div>
          <div className={cx("product-section")}>
            <Row>
              {products.slice(0, 8).map((product) => (
                <Col key={product.productId} lg={3} md={4} sm={6}>
                  <ProductItem
                    name={product.productTitle}
                    price={product.priceUnit}
                    image={product.imageUrl}
                    id={product.productId}
                    to={`/product/${product.productId}`}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Container>

        {/* Quảng cáo */}
        <Container fluid>
          <div className={cx("advertisment")}>
            <Row>
              <Col>
                <div className={cx("advertisment-desc")}>
                  <h3>
                    <span
                      style={{ color: "var(--active)", marginRight: "5px" }}
                    >
                      45%
                    </span>{" "}
                    Giảm sốc !!!
                  </h3>
                  <h2>Siêu Khuyến Mãi – Máy Ngon Giảm Siêu Rẻ!</h2>
                  <p>Chén ngay tại nhom17 !</p>
                  <Pill small />
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* Best Sellers */}
        <Container>
          <Row>
            <div className={cx("slider-header")}>
              <h2>Best Sellers</h2>
              <p>
                Best Seller của cửa hàng – chất lượng tuyệt hảo, ai cũng yêu
                thích!
              </p>
            </div>
          </Row>
          <Row>
            <SimpleSlider>
              {products.slice(0, 8).map((product) => (
                <Col key={product.productId} lg={3} md={6} sm={12}>
                  <ProductItem
                    name={product.productTitle}
                    price={product.priceUnit}
                    image={product.imageUrl}
                    id={product.productId}
                    to={`/product/${product.productId}`}
                  />
                </Col>
              ))}
            </SimpleSlider>
          </Row>
        </Container>
      </div>
    </ScrollReveal>
  );
}

export default Home;
