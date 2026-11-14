import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // ✅ Import Provider từ react-redux
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalStyles from "../src/components/Globalstyles";
import store from "./redux/store"; // ✅ Import Redux store

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* ✅ Bọc toàn bộ ứng dụng trong Provider */}
      <GlobalStyles>
        <App />
      </GlobalStyles>
    </Provider>
  </React.StrictMode>
);
