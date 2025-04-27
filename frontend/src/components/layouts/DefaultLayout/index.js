import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import Search from "../components/Search";
import Menu from "../components/Menu";
import { AnimatePresence } from "framer-motion"; // 🔥 Quan trọng!
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const toggleOverlay = () => setIsOverlayOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);
  const toggleMenu = () => setMenu((prev) => !prev);

  return (
    <div className={cx("wrapper")}>
      {/* Header */}
      <Header toggleOverlay={toggleOverlay} toggleSearch={toggleSearch} toggleMenu={toggleMenu} />

      {/* Nội dung chính */}
      <div>{children}</div>

      {/* Footer */}
      <Footer />

      {/* Overlay */}
      {isOverlayOpen && (
        <>
          <div className={cx("overlay")} onClick={toggleOverlay}></div>
          <Cart toggleOverlay={toggleOverlay} />
        </>
      )}

      {isSearchOpen && <Search toggleSearch={toggleSearch} />}

      {/* 🔥 Bọc Menu trong AnimatePresence để animation thoát hoạt động */}
      <AnimatePresence>
        {menu && <Menu toggleMenu={toggleMenu} isMenuOpen={menu} />}
      </AnimatePresence>
    </div>
  );
}

export default DefaultLayout;
