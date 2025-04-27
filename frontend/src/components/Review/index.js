import styles from "./Review.module.scss";
import className from "classnames/bind";
import Button from "../../components/Button";
import StarsRating from "../../components/StarsRating";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addReview } from "../../redux/reviewSlice";
import { successToast, dangerToast } from "../../redux/toastSlice";

const cx = className.bind(styles);

function Review({ id }) {
  id = parseInt(id);
  const token = localStorage.getItem("token");
  console.log(token);
  const dispatch = useDispatch();
  // State lưu rating và description
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  console.log({ description, rating });
  // Hàm xử lý khi chọn số sao
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Hàm xử lý khi gửi đánh giá
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !description) {
      dispatch(dangerToast({ message: "Vui lòng điền đầy đủ thông tin !!!" }));
    }
    if (rating && description) {
      try {
        await dispatch(
          addReview({ productId: id, rating: rating, comment: description })
        ).unwrap();
        dispatch(successToast({ message: "Đánh giá thành công !!!" }));
        setRating(0); // Reset rating
        setDescription(""); // Reset description
      } catch (err) {
        dispatch(dangerToast({ message: "Có lỗi !!!" }));
      }
    }
  };
  return (
    <div className={cx("wrapper")}>
      {/* Rating */}
      <div className={cx("rating")}>
        <span style={{ marginRight: "10px" }}>Rating:</span>
        <StarsRating rating={rating} onClick={handleRatingChange} />
      </div>

      {/* Description */}
      <div className={cx("description")}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your review here..."
          className={cx("text")}
        />

        {/* Submit Button */}
        <Button large onClick={handleSubmit}>
          Submit Review
        </Button>
      </div>
    </div>
  );
}
export default Review;
