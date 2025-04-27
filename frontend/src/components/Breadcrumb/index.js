import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";
import img from "../../assets/img/others/breadcrumbs-bg.png";
import styles from "./Breadcrumb.module.scss";
const cx = classNames.bind(styles);

function Breadcrumb({ page }) {
  return (
    <div className={cx("wrapper")}>
      <Container fluid>
        <Row>
          <Col lg={12}>
            <h1 className={cx("title")}>{page}</h1>
            <img src={img} alt="breadcrumb" className={cx("img")} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Breadcrumb;
