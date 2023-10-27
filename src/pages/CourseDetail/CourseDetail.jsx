import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CourseAccordion from '../../components/Accordion/CourseAccordion';
import { Breadcrumbs } from "@material-tailwind/react";
import { RatingBar } from '../../components/RatingBar/RatingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCirclePlay,
    faPenToSquare,
    faPersonChalkboard,
    faInfinity
} from '@fortawesome/free-solid-svg-icons';
import {
    faBookmark,
    faFileAudio,

} from '@fortawesome/free-regular-svg-icons';

import Button from '../../components/Button/Button';

const CourseDeTail = () => {
    const { slug } = useParams();
    useEffect(() => {
        document.title = slug;
    }, []);

    return (
        <div className='pt-[80px] mb-[80px]'>
            <div className='h-auto  bg-[#003a47]'>
                <div className='my-0 mx-auto py-12 max-w-6xl '>
                    <div className='max-w-[46rem]'>
                        <div className=' text-white '>
                            <div className=''>
                                <Breadcrumbs separator='>' className='p-0 mb-4 text-[#87CEEB] text-2xl font-bold'>
                                    <a href="#" className="opacity-100 hover:opacity-60">
                                        Docs
                                    </a>
                                    <a href="#" className="opacity-100 hover:opacity-60">
                                        Components
                                    </a>
                                    <a href="#">Breadcrumbs</a>
                                </Breadcrumbs>
                                <h1 className='text-3xl font-bold  mb-4'>JavaScript - Basics to Advanced step by step</h1>
                                <div className='text-1xl mb-4'>A perfect JavaScript course for all those who want to learn and master JavaScript programming skills right from scratch.</div>
                                <div className='mb-2 flex gap-2 text-sm'>
                                    <RatingBar value={4.2} totalReview={245} />
                                    <span>22.245 đã đăng kí.</span>
                                </div>
                                <div className='font-normal text-sm mb-2'>
                                    <span>
                                        <FontAwesomeIcon icon={faPersonChalkboard} className='mr-1 text-[#faaf00]' />
                                        Được tạo bởi:
                                    </span>
                                    <span className='text-[#64ceeb]'> Faisal Zamir</span>
                                </div>
                                <div className='font-normal text-sm mb-2'>
                                    <span>
                                        <FontAwesomeIcon icon={faPenToSquare} className='mr-1 text-[#faaf00]' />
                                        Cập nhật gần nhất:
                                    </span>
                                    <span className='text-[#64ceeb]'> 10/2012</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='my-0 mx-auto py-12 max-w-6xl'>
                <div className='max-w-[46rem] '>
                    <h1 className='font-bold text-2xl'>
                        TÓM TẮT
                    </h1>
                </div>
                <div className='mt-4 max-w-[46rem]'>
                    <div>
                        <span>
                            This course focuses on the fundamentals of Python in the beginning and with the passage of time, the content and lectures become advanced and more practical. But before everything, the introduction of python is discussed. Python is one of the fastest-growing programming languages and if we specifically look from the perspective of things going on in this era, there is no other choice then “python” as a programming language.

                            First of all, this is an introductory session on python for those who are not very good with python and then there is an exercise for python that is supposed to be solved by you but if you feel any difficulty in solving the exercise, the solution is also provided.

                            Then we moved on towards the advanced concepts of Python and we start from OOP, Data Structures, File Handling, and leading towards the end, where there is a complete project of Scrapy that we’ll do together.

                            During all of these lectures, we’ll be learning a few classical and a few advanced python problems. Some of them will be implemented from scratch and the others will be implemented by using the builtin libraries of python. At the end of every main topic and concept, there will be a practice task or mini-project.
                        </span>
                    </div>
                </div>
            </div>
            <div className='my-0 mx-auto pb-12 max-w-6xl '>
                <div className='max-w-[46rem] '>
                    <h1 className='font-bold text-2xl'>
                        NỘI DUNG KHÓA HỌC
                    </h1>
                </div>
                <div className='mt-4 max-w-[46rem]'>
                    <CourseAccordion title={`Section 1`} content={"Content 1"} />
                    <CourseAccordion title={`Section 2`} content={"Content 2"} />
                    <CourseAccordion title={`Section 3`} content={"Content 3"} />
                </div>
            </div>

            <div className='my-0 mx-auto pb-12 max-w-6xl'>
                <div className='max-w-[46rem] '>
                    <h1 className='font-bold text-2xl'>
                        YÊU CẦU KHÓA HỌC
                    </h1>
                </div>
                <div className='mt-4 max-w-[46rem]'>
                    <ul className='list-disc list-inside'>
                        <li className=''>Kiến thức cơ bản về toán học</li>
                        <li className=''>Đam mê với lập trình</li>
                    </ul>
                </div>
            </div>

            <div className='my-0 mx-auto max-w-6xl h-0'>
                <div className='ml-[50rem] shadow-lg transition border-solid border stroke-white w-[22rem] absolute top-28'>
                    <div className='w-full'>
                        <div className=''>
                            <div className='relative border-solid border-b stroke-white'>
                                <span className='cursor-pointer absolute z-10 flex  justify-center items-center mx-auto my-0 w-full h-full'>
                                    <FontAwesomeIcon className='h-20 text-white border-solid border-b-2 stroke-white rounded-full bg-[#003a47]' icon={faCirclePlay} />
                                    <span className='absolute z-20 bottom-4 w-full flex justify-center items-center text-white font-bold'>
                                        Xem trước khóa học
                                    </span>
                                </span>
                                
                                <span className='absolute h-full w-full bg-gradient-to-b from-transparent to-black  '>
                                </span>

                                <img className='h-full w-full bg-cover' src='https://ethicalads.blob.core.windows.net/media/images/2023/08/CSPR_Acquisition_Ad-set1_Ethical_240x180.jpg' />

                            </div>
                        </div>
                        <div className='p-6  bg-white'>
                            <div className=' mb-6 text-[#003a47] text-[2.2rem]'>
                                <span className='font-mono font-semibold'>266,666</span>
                                <span className=' underline  decoration-solid '>vnđ</span>
                            </div>
                            <div className='mb-6 flex gap-2'>
                                <Button style="flex-1 bg-[#29abe2] shadow-lg w-full h-[60px] hover:bg-[#088ab7] font-bold text-white" label="Đăng kí học" severity="info" rounded />
                                <Button style="w-[60px] h-[60px] shadow-lg bg-white ring-gray-300 hover:bg-gray-100" label={<FontAwesomeIcon icon={faBookmark} />} severity="info" rounded />
                            </div>

                            <div className='mb-6 '>
                                <div>
                                    <h2 className='font-bold mb-2'>Khóa học này bao gồm:</h2>
                                    <div>
                                        <ul>
                                            <li className='flex items-center '>
                                                <FontAwesomeIcon icon={faFileAudio} className='w-[2rem]' />
                                                <span className='ml-1'>Khóa học uy tín</span>
                                            </li>
                                            <li className='flex items-center '>
                                                <FontAwesomeIcon icon={faInfinity} className='w-[2rem]' />
                                                <span className='ml-1'>Truy cập trọn đời</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Button style="w-full h-[60px] shadow-lg bg-white ring-gray-300 hover:bg-gray-100" label={'Chia sẻ'} severity="info" rounded />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDeTail;