import classNames from "classnames/bind";
import styles from "./Button.module.scss";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);

function Button({
  fwidth,
  large,
  med,
  small,
  children,
  to,
  href,
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

  const classes = cx("wrapper", { small, large, fwidth });

  return (
    <Comp className={classes} {...props}>
      {children} {/* Hiển thị nội dung bên trong hoặc mặc định là "Shop Now" */}
    </Comp>
  );
}

export default Button;
