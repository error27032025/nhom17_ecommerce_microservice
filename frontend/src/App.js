import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CartPrimary from "./pages/CartPrimary";
import DefaultLayout from "./components/layouts/DefaultLayout";
import Product from "./pages/Product";
import Auth from "./pages/Auth";
import ToastNoti from "./components/ToastNoti";
import { hideToast } from "./redux/toastSlice";
import Orders from "./pages/Orders";
import ScrollToTop from "./components/layouts/components/Scroll";

function App() {
  const { show, message, variant } = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  useEffect(() => {}, [show, message, variant]);
  const handleHideToast = () => {
    dispatch(hideToast());
  };
  return (
    <Router>
      <div className="App">
        <DefaultLayout>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<CartPrimary />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/Orders" element={<Orders />} />
          </Routes>
        </DefaultLayout>
        <ToastNoti
          show={show}
          message={message}
          onClose={() => handleHideToast()}
          variant={variant}
        />
      </div>
    </Router>
  );
}

export default App;
