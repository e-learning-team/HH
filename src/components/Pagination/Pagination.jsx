// const Pagination = () => {
//     return(
//         <ol className="flex justify-center gap-1 text-xs font-medium">
//   <li>
//     <a
//       href="#"
//       className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
//     >
//       <span className="sr-only">Prev Page</span>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-3 w-3"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//       >
//         <path
//           fillRule="evenodd"
//           d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//           clipRule="evenodd"
//         />
//       </svg>
//     </a>
//   </li>

//   <li>
//     <a
//       href="#"
//       className="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
//     >
//       1
//     </a>
//   </li>

//   <li
//     className="block h-8 w-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-white"
//   >
//     2
//   </li>

//   <li>
//     <a
//       href="#"
//       className="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
//     >
//       3
//     </a>
//   </li>

//   <li>
//     <a
//       href="#"
//       className="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
//     >
//       4
//     </a>
//   </li>

//   <li>
//     <a
//       href="#"
//       className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
//     >
//       <span className="sr-only">Next Page</span>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-3 w-3"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//       >
//         <path
//           fillRule="evenodd"
//           d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//           clipRule="evenodd"
//         />
//       </svg>
//     </a>
//   </li>
// </ol>    
//     )
// }
// export default Pagination

import React, { useState } from 'react';

const Pagination = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePagination = () => {
    const paginationItems = [];

    // First and Previous buttons
    paginationItems.push(
      <li key="first" className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => goToPage(1)}>
        First
      </li>
    );

    paginationItems.push(
      <li key="previous" className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => goToPage(currentPage - 1)}>
        Previous
      </li>
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        paginationItems.push(
          <li key={i} className={`pagination-item ${i === currentPage ? 'active underline' : ''}`} onClick={() => goToPage(i)}>
            {i}
          </li>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        paginationItems.push(<li key={`ellipsis-${i}`} className="pagination-item">...</li>);
      }
    }

    // Next and Last buttons
    paginationItems.push(
      <li key="next" className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => goToPage(currentPage + 1)}>
        Next
      </li>
    );

    paginationItems.push(
      <li key="last" className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => goToPage(totalPages)}>
        Last
      </li>
    );

    return paginationItems;
  };

  return (
    <ul className="pagination flex gap-3">
      {generatePagination()}
    </ul>
  );
};

export default Pagination;
