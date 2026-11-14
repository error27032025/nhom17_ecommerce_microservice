import { Toast, ToastContainer } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./ToastNoti.module.scss";

const cx = classNames.bind(styles);

function ToastNoti({ show, message, onClose, variant = "success" }) {
  return (
    <ToastContainer className={cx("toast-container")} position="top-end">
      <Toast
        className={cx("toast", `toast-${variant}`)}
        show={show}
        delay={3000}
        onClose={onClose}
        autohide
      >
        {/* ✅ Chỉ đổi màu cho header, không đổi toàn bộ Toast */}
        <Toast.Header className={cx("toast-header")}>
          <strong className="me-auto">Thông báo</strong>
        </Toast.Header>
        <Toast.Body className={cx("toast-body")}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNoti;
