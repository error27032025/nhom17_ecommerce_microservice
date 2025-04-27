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
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      emailRef.current.value = savedEmail;
      setRememberMe(true);
    }
  }, []);

  const authApi = async (endpoint, data) => {
    try {
      const response = await axios.post(
        `http://34.87.146.141:3001/api/v1/users/${endpoint}`,
        data
      );

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);

        if (endpoint === "signin") {
          setTimeout(() => navigate("/"), 1000);
          dispatch(successToast({ message: "Đăng nhập thành công" }));
        } else {
          setAuth("login");
          dispatch(successToast({ message: "Đăng ký thành công" }));
          emailRef.current.value = "";
          passwordRef.current.value = "";
          nameRef.current.value = "";
        }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", emailRef.current.value);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      }
    } catch (error) {
      dispatch(dangerToast({ message: `lỗi` }));
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
                          email: emailRef.current.value,
                          password: passwordRef.current.value,
                        });
                      }
                    }}
                    className={cx("form")}
                  >
                    <input ref={emailRef} type="text" placeholder="Email" />
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
                          email: emailRef.current.value,
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
                          email: emailRef.current.value,
                          password: passwordRef.current.value,
                          name: nameRef.current.value,
                        });
                      }
                    }}
                    className={cx("form")}
                  >
                    <input ref={emailRef} type="text" placeholder="Email" />
                    <input
                      ref={passwordRef}
                      type="password"
                      placeholder="Password"
                    />
                    <input ref={nameRef} type="text" placeholder="Name" />
                    <Button
                      onClick={() =>
                        authApi("signup", {
                          email: emailRef.current.value,
                          password: passwordRef.current.value,
                          name: nameRef.current.value,
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
