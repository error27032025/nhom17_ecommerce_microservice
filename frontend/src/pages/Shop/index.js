import classNames from "classnames/bind";
import styles from "./Shop.module.scss";
import Breadcrumb from "../../components/Breadcrumb";
import Filter from "../../components/Filter";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductItem from "../../components/ProductItem";
import Pagination from "../../components/Pagination";
import ScrollReveal from "../../components/layouts/components/ScrollReveal";

const cx = classNames.bind(styles);

function Shop() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    cateId: null,
    price: [0, 10000],
    search: "",
  });
  const [selectedCate, setSelectedCate] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState(null);

  const limit = 8;
  const BASE_IMAGE_URL = "http://192.168.100.53:8086/";
  const API_URL = "http://192.168.100.53:8086/api";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cateId = queryParams.get("category")
      ? parseInt(queryParams.get("category"))
      : null;
    const search = queryParams.get("search") || "";

    setSelectedCate(cateId);
    setFilters((prev) => ({
      ...prev,
      cateId,
      search,
    }));
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories([{ id: null, title: "Tất cả" }, ...res.data]);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);
      try {
        const params = {
          page,
          limit,
          minPrice: filters.price[0],
          maxPrice: filters.price[1],
        };

        if (filters.cateId !== null) params.category = filters.cateId;
        if (filters.search) params.search = filters.search;

        const res = await axios.get(
          "http://192.168.100.53:8086/api/products?page=1&limit=8&minPrice=0&maxPrice=400000",
          { params }
        );

        // Backend trả về mảng sản phẩm thẳng, không có data, totalPages, totalItems
        setProducts(res.data || []);
        setTotalPages(1); // Nếu backend chưa hỗ trợ phân trang, để 1 trang
        setTotalItems(res.data.length || 0);
      } catch (error) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageClick = (selectedPage) => {
    setPage(selectedPage);
  };

  return (
    <div className={cx("wrapper")}>
      <Breadcrumb page="Products" />
      <ScrollReveal>
        <Container>
          <Row>
            <Col lg={3} md={12} sm={12}>
              <div className={cx("left")}>
                <Filter
                  selectedCate={selectedCate}
                  categories={categories}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </Col>
            <Col lg={9} md={12} sm={12}>
              <div className={cx("right")}>
                <div className={cx("product-count")}>
                  <h4>{totalItems} sản phẩm được tìm thấy</h4>
                </div>
                {error && <p className={cx("error")}>{error}</p>}
                {loadingProducts ? (
                  <p>Đang tải sản phẩm...</p>
                ) : (
                  <Container className={cx("product")}>
                    <Row className="justify-content-center">
                      {products.map((product) => (
                        <Col key={product.productId} lg={3} md={4} sm={6}>
                          <ProductItem
                            name={product.productTitle}
                            price={product.priceUnit}
                            image={
                              product.imageUrl || BASE_IMAGE_URL + "default.jpg"
                            }
                            id={product.productId}
                            to={`/product/${product.productId}`}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Container>
                )}
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageClick}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </ScrollReveal>
    </div>
  );
}

export default Shop;
