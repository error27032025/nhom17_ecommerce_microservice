import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Mỗi khi pathname thay đổi, cuộn lên đầu trang

  return null;
}

export default ScrollToTop;
