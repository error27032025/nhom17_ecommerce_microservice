import { Link, useLocation } from "react-router-dom";
import styles from "./NavBtn.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function NavBtn({ to, label }) {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const isActive = location.pathname === (to === "home" ? "/" : `/${to}`); // So sánh

  const classes = cx("wrapper", { active: isActive });

  return (
    <div className={classes}>
      <Link to={to === "home" ? "/" : `/${to}`}>{label}</Link>
    </div>
  );
}

export default NavBtn;
