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

  // State quản lý dữ liệu
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
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
  const CATEGORY_API_URL = "http://192.168.100.53:8086/api/categories";
  const PRODUCT_API_URL = "http://192.168.100.53:8086/api/products";

  // Lấy params từ URL (category, search)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cateIdParam = queryParams.get("category");
    const cateId = cateIdParam ? parseInt(cateIdParam) : null;
    const search = queryParams.get("search") || "";

    setSelectedCate(cateId);
    setFilters((prev) => ({
      ...prev,
      cateId,
      search,
    }));
    setPage(1);
  }, [location.search]);

  // Lấy danh mục từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await axios.get(CATEGORY_API_URL);
        // Thêm "Tất cả" làm lựa chọn đầu tiên
        setCategories([
          { categoryId: null, categoryTitle: "Tất cả" },
          ...res.data,
        ]);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Lấy toàn bộ sản phẩm theo filters (không phân trang backend)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);
      try {
        const params = {
          minPrice: filters.price[0],
          maxPrice: filters.price[1],
        };
        if (filters.cateId !== null) params.category = filters.cateId;
        if (filters.search) params.search = filters.search;

        const res = await axios.get(PRODUCT_API_URL, { params });

        setProducts(res.data || []);
        setTotalItems(res.data.length || 0);
        setTotalPages(Math.ceil((res.data.length || 0) / limit));
      } catch (error) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [filters]);

  // Tính sản phẩm cho trang hiện tại
  const indexOfLastProduct = page * limit;
  const indexOfFirstProduct = indexOfLastProduct - limit;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Khi filter thay đổi từ component Filter
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setSelectedCate(newFilters.cateId); // đồng bộ selectedCate với filter mới
  };

  // Chuyển trang
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
                      {currentProducts.map((product) => (
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
