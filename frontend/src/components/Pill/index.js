import styles from "./Pill.module.scss";
import { Link } from "react-router";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function Pill({
  to,
  href,
  circle,
  medium,
  large,
  small,
  children,
  ...passProps
}) {
  let Comp = "button";
  const props = {
    ...passProps,
  };

  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = "a";
  }

  const classes = cx("wrapper", { small, large, circle });

  return (
    <Comp className={classes} {...props}>
      {children || "Mua ngay "}{" "}
      {/* Hiển thị nội dung bên trong hoặc mặc định là "Shop Now" */}
    </Comp>
  );
}

export default Pill;
