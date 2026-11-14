import classNames from "classnames/bind";
import { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { successToast, dangerToast } from "../../redux/toastSlice";

import styles from "./Auth.module.scss";
import Button from "../../components/Button";
import Breadcrumb from "../../components/Breadcrumb";
import ScrollReveal from "../../components/layouts/components/ScrollReveal";

const cx = classNames.bind(styles);

function Auth({ showToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [auth, setAuth] = useState("login");
  const fullnameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      usernameRef.current.value = savedEmail;
      setRememberMe(true);
    }
  }, []);

  const authApi = async (endpoint, data) => {
    try {
      const response = await axios.post(
        `http://localhost:8088/api/auth/${endpoint}`,
        data
      );

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);

        if (endpoint === "signin") {
          setTimeout(() => navigate("/"), 1000);
          dispatch(successToast({ message: "Đăng nhập thành công" }));
        } else {
          setAuth("login");
          dispatch(successToast({ message: "Đăng ký thành công" }));
          fullnameRef.current.value = "";
          usernameRef.current.value = "";
          passwordRef.current.value = "";
          emailRef.current.value = "";
        }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", usernameRef.current.value);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      }
    } catch (error) {
      // Kiểm tra xem lỗi có phản hồi từ server không và có dữ liệu không
      const errorMessage = error?.response?.data?.msg || "Lỗi không xác định";

      // Gửi thông báo lỗi với thông điệp từ server
      dispatch(dangerToast({ message: errorMessage }));

      // In ra lỗi vào console để debug
      console.log(error);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <ScrollReveal>
        <Breadcrumb page={auth === "login" ? "Sign In" : "Sign Up"} />
      </ScrollReveal>
      <Container className={cx("auth")}>
        <Row>
          <Col>
            {auth === "login" && (
              <ScrollReveal>
                <div className={cx("login")}>
                  <div className={cx("header")}>
                    <h2
                      className={cx("active")}
                      onClick={() => setAuth("login")}
                    >
                      Sign-in
                    </h2>
                    <h2 onClick={() => setAuth("signup")}>Sign-up</h2>
                  </div>
                  <div
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        authApi("signin", {
                          username: usernameRef.current.value,
                          password: passwordRef.current.value,
                        });
                      }
                    }}
                    className={cx("form")}
                  >
                    <input
                      ref={usernameRef}
                      type="text"
                      placeholder="Username"
                    />
                    <input
                      ref={passwordRef}
                      type="password"
                      placeholder="Password"
                    />
                    <div className={cx("remember")}>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <p>Remember me</p>
                    </div>
                    <Button
                      onClick={() =>
                        authApi("signin", {
                          username: usernameRef.current.value,
                          password: passwordRef.current.value,
                        })
                      }
                      fwidth
                    >
                      Sign In
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {auth === "signup" && (
              <ScrollReveal>
                <div className={cx("signup")}>
                  <div className={cx("header")}>
                    <h2 onClick={() => setAuth("login")}>Sign-in</h2>
                    <h2
                      className={cx("active")}
                      onClick={() => setAuth("signup")}
                    >
                      Sign-up
                    </h2>
                  </div>
                  <div
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        authApi("signup", {
                          fullname: fullnameRef.current.value,
                          username: usernameRef.current.value,
                          password: passwordRef.current.value,
                          email: emailRef.current.value,
                        });
                      }
                    }}
                    className={cx("form")}
                  >
                    <div className={cx("form-group")}>
                      <label htmlFor="fullname">Fullname</label>
                      <input
                        id="fullname"
                        ref={fullnameRef}
                        type="text"
                        placeholder="Fullname"
                      />
                    </div>

                    <div className={cx("form-group")}>
                      <label htmlFor="username">Username</label>
                      <input
                        id="username"
                        ref={usernameRef}
                        type="text"
                        placeholder="Username"
                      />
                    </div>

                    <div className={cx("form-group")}>
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                      />
                    </div>

                    <div className={cx("form-group")}>
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        ref={emailRef}
                        type="text"
                        placeholder="Email"
                      />
                    </div>
                    <Button
                      onClick={() =>
                        authApi("signup", {
                          fullname: fullnameRef.current.value,
                          username: usernameRef.current.value,
                          password: passwordRef.current.value,
                          email: emailRef.current.value,
                        })
                      }
                      fwidth
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Auth;
