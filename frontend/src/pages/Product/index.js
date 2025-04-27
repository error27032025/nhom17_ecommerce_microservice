import { Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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


const cx = classNames.bind(styles);

function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const reviewsCall = useSelector((state) => state.review || [null]);
  const reviews = reviewsCall.reviews[id];

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 0 }).format(
      price
    );
  };

  const [product, setProduct] = useState(null);
  const sliderRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(
//           `http://34.87.146.141:3001
// /api/v1/products/${id}`
//         );
//         setProduct(response.data);
//         if (response.data.images?.length > 0) {
//           setSelectedImage(
//             `http://34.87.146.141:3001
// /${response.data.images[0].filepath}`
//           );
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  const MinusQuantityChange = () => {
    setQuantity(quantity > 1 ? quantity - 1 : 1);
  };

  const AddQuantityChange = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        name: product.title,
        price: product.price,
        image: selectedImage,
        id: product.id,
        quantity: quantity,
      })
    );
    dispatch(
      successToast({ message: "Sản phẩm đã được thêm vào giỏ hàng !!!" })
    );
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

  return (
    <div className={cx("wrapper")}>

        <Breadcrumb page={product.title}/>


      <ScrollReveal>
        <Container>
          <Row>
            <Col md={6}>
              <div className={cx("left")}>
                <Container>
                  <Row>
                    <Col md={10}>
                      <div className={cx("image")}>
                        <img src={selectedImage} alt="Selected" />
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className={cx("slider")}>
                        <Slider ref={sliderRef} {...sliderSettings}>
                          {product.images?.map((image, index) => (
                            <div
                              className={cx("item")}
                              key={index}
                              onClick={() => {
                                setSelectedImage(
                                  "http://34.87.146.141:3001/" + image.filepath
                                );
                                sliderRef.current.slickGoTo(index);
                              }}
                              style={{
                                cursor: "pointer",
                                padding: "5px",
                                border:
                                  selectedImage ===
                                  "http://34.87.146.141:3001/" + image.filepath
                                    ? "2px solid var(--primary)"
                                    : "none",
                              }}
                            >
                              <img
                                src={
                                  "http://34.87.146.141:3001/" + image.filepath
                                }
                                alt={image.filename}
                                style={{ width: "100%" }}
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Col>
            <Col md={6}>
              <div className={cx("right")}>
                <h1 className={cx("title")}>
                  {product.title}
                  <h4 className={cx("stock")}> Còn lại: {product.stock}</h4>
                </h1>
                <h2 className={cx("price")}>
                  {formatCurrency(product.price)} đ
                </h2>
                <div className={cx("description")}>
                  <div className={cx("stars")}>
                    <StarsRating rating={product.averageRating} />
                  </div>
                  <p>{product.description}</p>
                </div>
                <div className={cx("buttons")}>
                  <div className={cx("quantity")}>
                    <div onClick={MinusQuantityChange} className={cx("minus")}>
                      -
                    </div>
                    <div className={cx("value")}>{quantity}</div>
                    <div onClick={AddQuantityChange} className={cx("add")}>
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
                {reviews?.map((review, index) => (
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
                    <h3 style={{ margin: "0 0 5px 0" }}>{review?.user.name}</h3>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "5px",
                        marginRight: "10px",
                      }}
                    >
                      <StarsRating white rating={review?.rating} />
                    </div>
                    <p style={{ margin: "5px 0", color: "var(--white)" }}>
                      {review?.comment}
                    </p>
                    <small style={{ color: "#999" }}>
                      {new Date(review?.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
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
