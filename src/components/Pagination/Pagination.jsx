import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paginator } from 'primereact/paginator';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

 const Pagination = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('page')) {
      setCurrentPage(searchParams.get('page'));
    } else {
      setCurrentPage(1);
    }
    goToPage(searchParams.get('page'));
  }, [searchParams]);

  const goToPage = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      newSearchParams.set('page', page.toString());
    } else if (page <= 0) {
      setCurrentPage(1);
      newSearchParams.set('page', '1');
    } else if (page >= totalPages) {
      setCurrentPage(totalPages);
      newSearchParams.set('page', totalPages.toString());
    }
    // setSearchParams(newSearchParams);
  };


  const generatePagination = () => {
    const paginationItems = [];

    // First and Previous buttons
    paginationItems.push(
      <li key="first" className={`pagination-item ${currentPage === 1 ? 'disabled cursor-default text-slate-500' : ''} w-[40px] font-semibold cursor-pointer justify-center flex items-center h-full`} onClick={() => goToPage(1)}>
        Đầu
      </li>
    );

    paginationItems.push(
      <li key="previous" className={`pagination-item ${currentPage === 1 ? 'disabled cursor-not-allowed opacity-70' : 'hover:bg-slate-200'} w-[40px] font-semibold cursor-pointer  h-full border mx-1 border-slate-400 flex justify-center items-center rounded-full`} onClick={() => goToPage(currentPage - 1)}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </li>
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        paginationItems.push(
          <li key={i} className={`pagination-item ${i === currentPage ? 'active border-b-2 cursor-default border-emerald-800 ' : ''} w-[40px] font-semibold cursor-pointer justify-center flex items-center h-full`} onClick={() => goToPage(i)}>
            {i}
          </li>
        );
      }
      else if (i === currentPage - 2 || i === currentPage + 2) {
        paginationItems.push(<li key={`ellipsis-${i}`} className="pagination-item">...</li>);
      }
    }

    // Next and Last buttons
    paginationItems.push(
      <li key="next" className={`pagination-item ${currentPage === totalPages ? 'disabled cursor-not-allowed opacity-70' : 'hover:bg-slate-200'} w-[40px] font-semibold cursor-pointer  h-full border mx-1 border-slate-400 flex justify-center items-center rounded-full`} onClick={() => goToPage(currentPage + 1)}>
        <FontAwesomeIcon icon={faAngleRight} />
      </li>
    );

    paginationItems.push(
      <li key="last" className={`pagination-item ${currentPage === totalPages ? 'disabled cursor-default text-slate-500' : ''} w-[40px] font-semibold cursor-pointer justify-center flex items-center h-full`} onClick={() => goToPage(totalPages)}>
        Cuối
      </li>
    );

    return paginationItems;
  };

  return (
    <ul className="pagination h-[40px] flex gap-1 w-full justify-center items-center !list-none">
      {generatePagination()}
    </ul>
  );
};

export default Pagination