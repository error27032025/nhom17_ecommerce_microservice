import React from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-container">
      <ReactPaginate
        previousLabel={"«"}
        nextLabel={"»"}
        breakLabel={"..."}
        pageCount={totalPages} // Tổng số trang
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={(selected) => onPageChange(selected.selected + 1)} // Chuyển trang
        containerClassName={"pagination"}
        activeClassName={"active"}
        forcePage={currentPage - 1} // Đảm bảo pagination hiển thị đúng trang hiện tại
      />
    </div>
  );
};

export default Pagination;
