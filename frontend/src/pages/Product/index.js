import { Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import Review from "../../components/Review";
import StarsRating from "../../components/StarsRating";
import Breadcrumb from "../../components/Breadcrumb";
import paypalImage from "../../assets/img/others/paypal.png";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { successToast } from "../../redux/toastSlice";
import { fetchReviews } from "../../redux/reviewSlice";
import ScrollReveal from "../../components/layouts/components/ScrollReveal";
import axios from "axios";

const cx = classNames.bind(styles);

function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const reviewsCall = useSelector((state) => state.review || {});
  const reviews = reviewsCall.reviews?.[id] || [];

  const BASE_IMAGE_URL = "http://192.168.100.53:8086/";
  const BASE_API_URL = "http://192.168.100.53:8086/api/products"; // IP server backend
  const [product, setProduct] = useState(null);
  const sliderRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage; // ví dụ: trang 1 * 8 = 8
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // 8 - 8 = 0
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  useEffect(() => {
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/${id}`);
        console.log("Fetch product data:", response.data);
        setProduct(response.data);
        if (response.data.images?.length > 0) {
          setSelectedImage(BASE_IMAGE_URL + response.data.images[0].filepath);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatCurrency = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        name: product.title,
        price: product.price,
        image: selectedImage,
        id: product.id,
        quantity,
      })
    );
    dispatch(successToast({ message: "Sản phẩm đã được thêm vào giỏ hàng!" }));
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    arrows: false,
  };

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  const imageUrlList =
    product.images?.length > 0
      ? product.images.map((img) => BASE_IMAGE_URL + img.filepath)
      : product.imageUrl
      ? [BASE_IMAGE_URL + product.imageUrl]
      : [];

  return (
    <div className={cx("wrapper")}>
      <Breadcrumb page={product.title} />

      <ScrollReveal>
        <Container>
          <Row>
            <Col md={6}>
              <div className={cx("left")}>
                <Container>
                  <Row>
                    <Col md={10}>
                      <div id="pimg" className={cx("image")}>
                        <img src={product.imageUrl} alt="Selected" />
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className={cx("slider")}>
                        <Slider ref={sliderRef} {...sliderSettings}>
                          {product.images?.map((image, index) => {
                            return (
                              <div
                                className={cx("item")}
                                key={index}
                                onClick={() => {
                                  sliderRef.current?.slickGoTo(index);
                                }}
                                style={{
                                  cursor: "pointer",
                                  padding: "5px",
                                }}
                              ></div>
                            );
                          })}
                        </Slider>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Col>

            <Col md={6}>
              <div className={cx("right")}>
                <div className={cx("title-section")}>
                  <h1 className={cx("title")}>{product.productTitle}</h1>
                  <h4 className={cx("stock")}>Còn lại: {product.quantity}</h4>
                </div>
                <h2 className={cx("price")}>
                  {formatCurrency(product.priceUnit)} $
                </h2>

                <div className={cx("description")}>
                  <div className={cx("stars")}>
                    <StarsRating rating={product.averageRating || 0} />
                  </div>
                  <p>{product.description}</p>
                </div>

                <div className={cx("buttons")}>
                  <div className={cx("quantity")}>
                    <div
                      onClick={() => handleQuantityChange(-1)}
                      className={cx("minus")}
                    >
                      -
                    </div>
                    <div className={cx("value")}>{quantity}</div>
                    <div
                      onClick={() => handleQuantityChange(1)}
                      className={cx("add")}
                    >
                      +
                    </div>
                  </div>
                  <Button onClick={handleAddToCart} large>
                    Add to cart
                  </Button>
                </div>

                <img className={cx("paypal")} src={paypalImage} alt="Paypal" />
              </div>
            </Col>
          </Row>
        </Container>
      </ScrollReveal>

      <ScrollReveal>
        <Container>
          <Row>
            <Col>
              <div className={cx("reviews")}>
                <Review id={id} />
                {reviews.map((review, index) => (
                  <div
                    className={cx("review")}
                    key={index}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "15px",
                      marginBottom: "15px",
                      backgroundColor: "var(--primary)",
                      color: "var(--active)",
                    }}
                  >
                    <h3 style={{ marginBottom: "5px" }}>
                      {review?.user?.name}
                    </h3>
                    <StarsRating white rating={review?.rating} />
                    <p style={{ color: "var(--white)" }}>{review?.comment}</p>
                    <small style={{ color: "#999" }}>
                      {new Date(review?.createdAt).toLocaleString("vi-VN")}
                    </small>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </ScrollReveal>
    </div>
  );
}

export default Product;
