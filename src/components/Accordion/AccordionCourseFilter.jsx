import React, { useRef, useEffect, useState, useCallback } from 'react';
import { apiCategory } from '../../apis/category';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Icon() {
    return (
        <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function IconRadio() {
    return (
        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-blue-500 opacity-0 transition-opacity peer-checked:opacity-100">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 16 16"
                fill="currentColor"
            >
                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
            </svg>
        </div>
    );
}


const AccordionCourseFilter = ({ parentCategoryId, deleteFilter }) => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const [childCategory, setChildCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchChildCategory = async (addParams) => {
        try {
            setLoading(true);
            const params = {
                build_type: "TREE",
                ...addParams,
            };

            const response = await apiCategory(params);

            if (response?.data?.length > 0) {
                setChildCategory(response.data);
            } else {
                setChildCategory([]);
            }
        } catch (error) {
            console.error("Error fetching course data", error);
            setChildCategory([]);
        } finally {
            setLoading(false);
        }
    };
    const handleCheckChildCategory = (e, category) => {
        setLoading(true);

        const check = e?.target?.checked;

        setSearchParams((currentSearchParams) => {
            const newSearchParams = new URLSearchParams(currentSearchParams.toString());

            if (check) {
                newSearchParams.append('subcategory', category?.id);
            } else {
                newSearchParams.delete('subcategory', category?.id);
            }

            return newSearchParams;
        });

        setLoading(false);
    };

    useEffect(() => {
        if (!searchParams.getAll('subcategory')) {
            searchChildCategory({ level: 1 });
        }
    }, [searchParams, isLoggedIn]);

    useEffect(() => {
        searchChildCategory({ parent_ids: searchParams.get('category') });
    }, [parentCategoryId, searchParams]);

    useEffect(() => {
        searchChildCategory({ level: 1 });
    }, [deleteFilter]);
    return (
        <div>
            <div className="">
                {childCategory?.length > 0 && (
                    <details open className="group [&_summary::-webkit-details-marker]:hidden border-y">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 py-4 text-gray-900">
                            <h2 className="font-medium">
                                Danh mục con
                            </h2>
                            <Icon />
                        </summary>

                        <div className="mb-4 leading-relaxed text-gray-700">
                            {!loading && (
                                <div>
                                    {childCategory.map((child, index) => (
                                        <div key={index} className="col-span-6 p-2 cursor-pointer hover:bg-slate-200">
                                            <label className="flex gap-4 cursor-pointer">
                                                <input defaultChecked={searchParams.getAll('subcategory').includes(child.id)} onClick={(e) => handleCheckChildCategory(e, child)} type="checkbox"
                                                    className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm" />
                                                <span className="text-sm text-gray-700">
                                                    {child?.title}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </details>
                )}

                <details open className="group [&_summary::-webkit-details-marker]:hidden rounded-t-1 border-b">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 py-4 text-gray-900">
                        <h2 className="font-medium">
                            Giá tiền
                        </h2>
                        <Icon />
                    </summary>

                    <div className="mb-4 leading-relaxed text-gray-700">
                        <div className="grid">
                            <div className="inline-flex items-center">
                                <label
                                    className="relative flex cursor-pointer items-center rounded-full p-3"
                                    data-ripple-dark="true">
                                    <input id="low-to-high"
                                        name="type"
                                        type="radio"
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-5" />
                                    <IconRadio />
                                </label>
                                <label
                                    className="mt-px cursor-pointer select-none font-light text-gray-700">
                                    Từ thấp đến cao
                                </label>
                            </div>
                            <div className="inline-flex items-center">
                                <label
                                    className="relative flex cursor-pointer items-center rounded-full p-3"
                                    data-ripple-dark="true">
                                    <input id="high-to-low"
                                        name="type"
                                        type="radio"
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-5" />
                                    <IconRadio />
                                </label>
                                <label className="mt-px cursor-pointer select-none font-light text-gray-700">
                                    Từ cao đến thấp
                                </label>
                            </div>
                        </div>
                    </div>
                </details>
            </div>

        </div>
    );

};

export default AccordionCourseFilter;