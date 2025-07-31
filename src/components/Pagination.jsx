import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  const handleClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
      <button
        onClick={() => !isFirst && onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={`px-3 py-1 rounded border ${
          isFirst ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-100'
        }`}
      >
        &laquo;
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handleClick(page)}
          className={`px-3 py-1 rounded border ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'cursor-default text-gray-400'
              : 'hover:bg-blue-100'
          }`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => !isLast && onPageChange(currentPage + 1)}
        disabled={isLast}
        className={`px-3 py-1 rounded border ${
          isLast ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-100'
        }`}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
