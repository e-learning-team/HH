import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import CourseAccordion from '../../components/Accordion/CourseDetailAccordion';
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
import { VideoReviewDialog } from '../../components/Dialog/VideoReviewDialog';
import { getVideoGoogleGDriveUrl, getVideoThumbnailGoogleGDriveUrl } from '../../utils/Constants';
import { extractVideoGoogleGDriveUrlId } from '../../utils/helper';

const CourseDeTail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const course = {
        "data": [
            {
                "id": "1000",
                "name": "Tự học thiết kế UX",
                "slug": "tu-hoc-thiet-ke-ux-1000",
                "type": "",
                "courseType": "DRAFT",
                "level": 1,
                "description": null,
                "requirement": null,
                "duration": null,
                "subscriptions": null,
                "children": [
                    {
                        "id": "1001",
                        "name": "CHƯƠNG 01. BẮT ĐẦU VỚI UX",
                        "slug": "chuong-01-bat-dau-voi-ux-1001",
                        "type": "",
                        "courseType": "DRAFT",
                        "level": 2,
                        "description": null,
                        "requirement": null,
                        "duration": null,
                        "subscriptions": null,
                        "children": [
                            {
                                "id": "1002",
                                "name": "Bài 01 Những hiểu biết cơ bản về UX và thiết kế UX",
                                "slug": "bai-01-nhung-hieu-biet-co-ban-ve-ux-va-thiet-ke-ux-1002",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 01 nhung hieu biet co ban ve ux va thiet ke ux",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/15vnu3konuNrZWAqfXighoIl6vNF-1YiV/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905582962,
                                "update_by": null,
                                "update_at": 1698297965891,
                                "is_deleted": false
                            },
                            {
                                "id": "1003",
                                "name": "Bài 02 Giới thiệu khóa học",
                                "slug": "bai-02-gioi-thieu-khoa-hoc-1003",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 02 gioi thieu khoa hoc",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/1LqVj-c5Zjtzc5wIfio7jbAzragLGut5I/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905644551,
                                "update_by": null,
                                "update_at": 1698297965891,
                                "is_deleted": false
                            },
                            {
                                "id": "1004",
                                "name": "Bài 03 UX trong cuộc sống",
                                "slug": "bai-03-ux-trong-cuoc-song-1004",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 03 ux trong cuoc song",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/1--YapvpZZm9vKHWZldaIM3bxF3aEkG4p/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905657890,
                                "update_by": null,
                                "update_at": 1698297965891,
                                "is_deleted": false
                            },
                            {
                                "id": "1005",
                                "name": "Bài 04 Thiết kế UX là gì",
                                "slug": "bai-04-thiet-ke-ux-la-gi-1005",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 04 thiet ke ux la gi",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/1TTujYq6as4phckz80Y7hCJa6lAXF7a6F/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905669145,
                                "update_by": null,
                                "update_at": 1698297965891,
                                "is_deleted": false
                            },
                            {
                                "id": "1006",
                                "name": "Bài 05 Một UX tốt là gì",
                                "slug": "bai-05-mot-ux-tot-la-gi-1006",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 05 mot ux tot la gi",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/1kuSSmnnH8zvTziDgnn9lXhDZVr3K5R0-/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905682720,
                                "update_by": null,
                                "update_at": 1698297965891,
                                "is_deleted": false
                            },
                            {
                                "id": "1007",
                                "name": "Bài 06 Điều gì sẽ tạo ra 1 UX tốt",
                                "slug": "bai-06-dieu-gi-se-tao-ra-1-ux-tot-1007",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 06 dieu gi se tao ra 1 ux tot",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/1uRCMwOdoMgHb4vqb1nEG53AZDxBtujcw/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905694287,
                                "update_by": null,
                                "update_at": 1698297965891,
                                "is_deleted": false
                            },
                            {
                                "id": "1008",
                                "name": "Bài 07 Các vị trí (role) trong UX",
                                "slug": "bai-07-cac-vi-tri-role-trong-ux-1008",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 07 cac vi tri %28role%29 trong ux",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/1sirQRKl_0tv0YoU-GI0I0COqZZs_y8Rx/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905709759,
                                "update_by": null,
                                "update_at": 1698297965892,
                                "is_deleted": false
                            },
                            {
                                "id": "1009",
                                "name": "Bài 08 Vai trò của thiết kế UX đối với doanh nghiệp",
                                "slug": "bai-08-vai-tro-cua-thiet-ke-ux-doi-voi-doanh-nghiep-1009",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 08 vai tro cua thiet ke ux doi voi doanh nghiep",
                                "parent_id": "1001",
                                "video_path": "https://drive.google.com/file/d/1xDKnLYuDHcJMOoEKk0RtRe-ZhaC0_orV/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905719176,
                                "update_by": null,
                                "update_at": 1698297965892,
                                "is_deleted": false
                            }
                        ],
                        "categoryIds": null,
                        "name_mode": "chuong 01. bat dau voi ux",
                        "parent_id": "1000",
                        "video_path": null,
                        "image_path": null,
                        "price_sell": null,
                        "price_promotion": null,
                        "total_lesson": null,
                        "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                        "created_at": 1697905486118,
                        "update_by": null,
                        "update_at": 1698297965841,
                        "is_deleted": false
                    },
                    {
                        "id": "1010",
                        "name": "CHƯƠNG 02. QUY TRÌNH THIẾT KẾ UX",
                        "slug": "chuong-02-quy-trinh-thiet-ke-ux-1010",
                        "type": "",
                        "courseType": "DRAFT",
                        "level": 2,
                        "description": null,
                        "requirement": null,
                        "duration": null,
                        "subscriptions": null,
                        "children": [
                            {
                                "id": "1011",
                                "name": "Bài 09: Quy trình thiết kế UX",
                                "slug": "bai-09-quy-trinh-thiet-ke-ux-1011",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 09%3A quy trinh thiet ke ux",
                                "parent_id": "1010",
                                "video_path": "https://drive.google.com/file/d/1XpDxryUIevyd__ACty4b1M4Hq0EKfpa9/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905751934,
                                "update_by": null,
                                "update_at": 1698297965892,
                                "is_deleted": false
                            },
                            {
                                "id": "1012",
                                "name": "Bài 10 Dự án mẫu",
                                "slug": "bai-10-du-an-mau-1012",
                                "type": "VIDEO",
                                "courseType": "DRAFT",
                                "level": 3,
                                "description": null,
                                "requirement": null,
                                "duration": null,
                                "subscriptions": null,
                                "children": [],
                                "categoryIds": null,
                                "name_mode": "bai 10 du an mau",
                                "parent_id": "1010",
                                "video_path": "https://drive.google.com/file/d/1EjTLKjisTQH8ZzF99IDqJRe_KHKJfAVR/preview",
                                "image_path": null,
                                "price_sell": null,
                                "price_promotion": null,
                                "total_lesson": null,
                                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                                "created_at": 1697905764067,
                                "update_by": null,
                                "update_at": 1698297965892,
                                "is_deleted": false
                            }
                        ],
                        "categoryIds": null,
                        "name_mode": "chuong 02. quy trinh thiet ke ux",
                        "parent_id": "1000",
                        "video_path": null,
                        "image_path": null,
                        "price_sell": null,
                        "price_promotion": null,
                        "total_lesson": null,
                        "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                        "created_at": 1697905731141,
                        "update_by": null,
                        "update_at": 1698297965841,
                        "is_deleted": false
                    }
                ],
                "categoryIds": null,
                "name_mode": "tu hoc thiet ke ux",
                "parent_id": null,
                "video_path": "https://drive.google.com/file/d/1giM4L6MBKP2709OaVT1umBK-oHKPUAaL/preview",
                "image_path": null,
                "price_sell": null,
                "price_promotion": null,
                "total_lesson": null,
                "created_by": "3ed1cd55-5dfc-442e-8f40-ea13ff5e309d",
                "created_at": 1697904612535,
                "update_by": null,
                "update_at": 1698297965766,
                "is_deleted": false
            }
        ]
    };
    useEffect(() => {
        console.log(slug)
        if (course  && course.data && course.data.length > 0) {
            console.log('Success')
            document.title = course.data[0].name;
        }
        else {
            console.log('error')
            navigate(`/error`);
        }
    }, []);
    const [openVideoReviewDialog, setOpenVideoReviewDialog] = React.useState(false);
    const handleOpenVideoReviewDialog = () => setOpenVideoReviewDialog(!openVideoReviewDialog);
    return (
        <div>
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
                <div className='my-0 mx-auto max-w-6xl'>
                    <div className='ml-[50rem] shadow-lg transition border-solid border stroke-white w-[22rem] absolute top-28'>
                        <div className='w-full'>
                            <div className=''>
                                <div className='relative border-solid border-b stroke-white'>
                                    <span onClick={handleOpenVideoReviewDialog} className='cursor-pointer absolute z-10 flex  justify-center items-center mx-auto my-0 w-full h-full'>
                                        <FontAwesomeIcon className='h-20 text-white border-solid border-b-2 stroke-white rounded-full bg-[#003a47]' icon={faCirclePlay} />
                                        <span className='absolute z-20 bottom-4 w-full flex justify-center items-center text-white font-bold'>
                                            Xem trước khóa học
                                        </span>
                                    </span>

                                    <span className='absolute h-full w-full bg-gradient-to-b from-transparent to-black  '>
                                    </span>

                                    <img className='h-full w-full bg-cover' src={getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(course.data[0].video_path))} />
                                    {console.log(getVideoThumbnailGoogleGDriveUrl(extractVideoGoogleGDriveUrlId(course.data[0].video_path)))}
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
                        {course.data.length > 0 && (
                            <>

                                {course.data[0].children.map((child) => (
                                    <CourseAccordion key={child.id} title={child.name} content={child.children} />
                                ))}
                            </>
                        )}
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


            </div>
            {
                openVideoReviewDialog && (
                    <VideoReviewDialog open={openVideoReviewDialog} setOpen={handleOpenVideoReviewDialog} />
                )
            }
        </div>
    );
};

export default CourseDeTail;