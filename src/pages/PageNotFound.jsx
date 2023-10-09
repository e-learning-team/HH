import React, { useRef, useEffect, useState, useCallback } from 'react';

import { NavLink } from "react-router-dom";
import Path from "../utils/path";
const PageNotFound = () => {
    useEffect(() => {
        document.title = 'Lỗi';
    });
    return (
        <>
            <section className="relative z-10 bg-primary py-[120px] h-screen">
                <div className="container">
                    <div className="flex -mx-4">
                        <div className="w-full px-4">
                            <div className="mx-auto max-w-[700px] text-center">
                                <h2 className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]">
                                    404
                                </h2>
                                <h4 className="mb-3 text-[30px] font-semibold leading-tight text-white">
                                    Ôi! Trang bạn muốn đến không thể tìm thấy
                                </h4>
                                <p className="mb-8 text-lg text-white">
                                    Có thể nó đã bị xóa hoặc đã có lỗi kỹ thuật.
                                </p>
                                <p className="mb-8 text-lg text-white">
                                    Hãy liên hệ với quản trị viên và đồng thời kiểm tra lại đường dẫn của bạn.
                                </p>
                                <NavLink
                                    to={Path.HOME}
                                    className="inline-block px-8 py-3 text-base font-semibold text-center text-white transition border border-white rounded-lg hover:bg-white hover:text-primary"
                                >
                                    Trang chủ
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full space-x-5 -z-10 md:space-x-8 lg:space-x-14">
                    <div className="h-full w-1/3 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]" />
                    <div className="flex w-1/3 h-full">
                        <div className="h-full w-1/2 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]" />
                        <div className="h-full w-1/2 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]" />
                    </div>
                    <div className="h-full w-1/3 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]" />
                </div>
            </section>
        </>
    );
};
export default PageNotFound;
