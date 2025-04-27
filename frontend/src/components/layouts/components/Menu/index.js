import { motion } from "framer-motion";
import styles from "./Menu.module.scss";
import classNames from "classnames/bind";
import { RiMenuFold4Line } from "react-icons/ri";
import {Link} from "react-router-dom"

const cx = classNames.bind(styles);

const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
};

function Menu({ toggleMenu, isMenuOpen }) {
  return (
    <motion.div
      className={cx("wrapper")}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
    >
      <div  className={cx("title")}>
        <h2>Menu</h2>
        <RiMenuFold4Line className={cx("close")} onClick={toggleMenu} />
      </div>
      <div onClick={toggleMenu} className={cx("item")}>
          <Link to="/">
          Trang Chủ 
          </Link>
        </div>
      <div onClick={toggleMenu} className={cx("item")}>
          <Link to="/shop">
          Sản Phẩm  
          </Link>
        </div>
      <div onClick={toggleMenu} className={cx("item")}>
          <Link to="/cart">
          Giỏ Hàng  
          </Link>
        </div>
      <div onClick={toggleMenu} className={cx("item")}>
          <Link to="/orders">
          Đơn Hàng  
          </Link>
        </div>
      <div onClick={toggleMenu} className={cx("item")}>
          <Link to="/auth" >
          Đăng Nhập 
          </Link>
        </div>
    </motion.div>
  );
}

export default Menu;
