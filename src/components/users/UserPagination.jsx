import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function UserPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Users pagination">
      <button
        type="button"
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
        <span>Previous</span>
      </button>

      <div className="pagination-pages">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="pagination-ellipsis"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`pagination-page ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={
                currentPage === page ? "page" : undefined
              }
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

export default UserPagination;