import { Input, Spinner, Typography } from '@material-tailwind/react';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from "primereact/editor";
import { MyCKEditor } from '../../../components/Editor/MyCKEditor';
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Path from '../../../utils/path';
import { apiCategory } from '../../../apis/category';
import { TreeSelect } from 'primereact/treeselect';
import { data } from 'autoprefixer';
import { MultiSelect } from 'primereact/multiselect';
// import './style.css';
import { apiGetCourse, apiSaveCourse } from '../../../apis/course';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../components/Button/Button';
import { apiDeleteFileByPathFile, apiUploadFile } from '../../../apis/fileRelationship';
// import {MyQuillEditor} from '../../../components/Editor/QuillEditor';

const IntroductionContent = ({ content, handleChange }) => {
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(true);
    const [categoryNodes, setCategoryNodes] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [payload, setPayload] = useState({
        id: '',
        name: '',
        description: "",
        requirement: "",
        category_ids: [
        ],
    });
    const [errors, setErrors] = useState({
        category_ids: '',
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = { category_ids: '' };

        if (!selectedCategory?.length) {
            newErrors.category_ids = 'Vui lòng chọn ít nhất 1 danh mục';
            valid = false;
        } else {
            newErrors.category_ids = '';
        }

        setErrors(newErrors);
        return valid;
    };

    const addDashesToTitles = (categories) => {
        return categories.map((category) => {
            const { id, title, children } = category;
            const modifiedTitle = `${category.level != 1 ? (category.level == 3 ? '----' : '--') : ''} ${title}`;

            return {
                id,
                title: modifiedTitle,
                children: children && children.length > 0 ? addDashesToTitles(children, level + 1) : [],
            };
        });
    };
    const fetchCategory = async () => {
        setProcessing(true);
        setLoading(true);
        try {
            const categoryData = await apiCategory({ build_type: 'LIST' });
            const data = addDashesToTitles(categoryData.data);
            setCategoryList(data);

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        setProcessing(false);
        setLoading(false);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const selectedCategoryIds = category.map(cate => cate?.id);
        setPayload((prevPayload) => ({
            ...prevPayload,
            category_ids: selectedCategoryIds,
        }));
        setErrors((errors) => ({
            ...errors,
            category_ids: ""
        }));
    };
    const handleEditorDescription = (editorData) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            description: editorData,
        }));
    };
    const handleEditorRequireMent = (editorData) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            requirement: editorData,
        }));
    };
    const handleSaveCourse = async () => {
        setProcessing(true);
        if (validateForm()) {
            const res = await apiSaveCourse(payload);
            if (res?.data) {

                handleChange && handleChange(res?.data);
                // handleEditorDescription(res?.data.description)
                // handleEditorRequireMent(res?.data.requirement)
            }
        } else {
            toast.error('Vui lòng nhập các trường bắt buộc');
        }
        setProcessing(false);
    };
    useEffect(() => {
        fetchCategory();
    }, []);
    useEffect(() => {
        setProcessing(true);
        setPayload((prevPayload) => ({
            ...prevPayload,
            id: content?.id,
            name: content?.name
        }));
        // console.log('---content', content);
        if (content && content.category_ids && content.category_ids.length > 0) {
            let selectedCategories = [];
            if (categoryList?.length > 0) {
                selectedCategories = categoryList.filter((category) => content.category_ids.includes(category.id));
            }
            handleCategorySelect(selectedCategories);
        }
        setProcessing(false);

        return () => {

        };
    }, [content, categoryList]);

    return (
        <>
            {(content) && (
                <div className={`${processing ? 'pointer-events-none' : ''} relative`}>
                    <div className={`flex min-w-full gap-x-3 justify-between w-full mb-2 ${processing ? 'pointer-events-none' : ''}`}>
                        <div className='w-full'>
                            <Typography className='font-normal text-base mb-2'>
                                Danh mục
                                <span className='text-red-500'>*</span>
                            </Typography>
                            <div className='multiselect-container '>
                                <MultiSelect
                                    value={selectedCategory}
                                    onChange={(e) => handleCategorySelect(e.value)}
                                    options={categoryList} optionLabel="title"
                                    display="chip"
                                    placeholder="Chọn danh mục"
                                    // maxSelectedLabels={3}
                                    className="max-w-full min-w-full md:w-20rem" />
                            </div>
                            <Typography className='text-red-500'>{errors.category_ids}</Typography>
                        </div>
                    </div>
                    <div className='mb-5 w-full'>
                        <Typography className='font-normal text-base mb-2'>Mô tả về khóa học</Typography>
                        <MyCKEditor
                            className={'min-w-full'}
                            type={'COURSE_DESCRIPTION'}
                            parent_id={content?.id}
                            data={content?.description}
                            handleData={handleEditorDescription}
                        />
                    </div>
                    <div className='mb-5 w-full'>
                        <Typography className='font-normal text-base mb-2'>Yêu cầu khóa học</Typography>
                        <MyCKEditor
                            className={'min-w-full'}
                            data={content?.requirement}
                            handleData={handleEditorRequireMent}
                        />
                    </div>
                    <span className='w-full bg-slate-300 h-[1px] my-4'></span>
                    <div
                        onClick={() => handleSaveCourse()}
                        className='h-[50px] relative border group/sort duration-200 hover:opacity-75 bg-[#3366cc] text-white cursor-pointer border-[#829093] flex justify-center items-center'>
                        <Typography className='font-semibold text-base text-white duration-200 '>
                            Lưu
                        </Typography>
                        {processing && (
                            <span className='bg-slate-400 absolute z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                                <Spinner className='h-auto text-[#fff]' color="cyan" />
                            </span>
                        )}
                    </div>
                    {processing && (
                        <span className='bg-[#eaeef6] opacity-70 absolute z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                            {/* <Spinner className='h-auto text-[#fff] w-20' color="cyan" /> */}
                        </span>
                    )}
                </div>
            )}
        </>
    );
};

const VideoContent = ({ content, handleChange }) => {
    const [fileInputRef, setFileInputRef] = useState(null);
    const [videoLoading, setVideoLoading] = useState(false);
    const [video, setVideo] = useState(null);
    const [processing, setProcessing] = useState(false);
    const handleRemoveVideo = () => {
        setVideo(null);
        if (fileInputRef && fileInputRef.value) {
            fileInputRef.value = ''; // Reset the file input
        }
    };
    const handleVideoChange = (e) => {
        setVideoLoading(true);
        setProcessing(true);
        const file = e.target.files[0];
        if (file) {
            if (file.type.includes("video")) {
                setVideo(file);
                // console.log(URL.createObjectURL(file));
            } else {
                toast.error("Video không hợp lệ!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                handleRemoveVideo();
            }
        }
        setVideoLoading(false);
        setProcessing(false);
    };
    const deleteVideo = async () => {
        const params = {
            path_file: content?.video_path,
            // parent_type: "USER_AVATAR"
        };
        console.log('params----', content);
        if (video) {
            try {
                setVideoLoading(true);
                setProcessing(true);
                const res = await apiDeleteFileByPathFile(params);
                if (res.status == 1) {
                    toast.success(`Xóa video cũ thành công!`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                // else {
                //     toast.error(`Xóa video cũ không thành công thành công! ${res.message}`, {
                //         position: toast.POSITION.TOP_RIGHT,
                //     });
                // }
                setVideoLoading(false);
                setProcessing(false);
            } catch (e) {
                // console.error('Upload failed:', e);
                // setVideoLoading(false);
                // toast.error(`Xóa video cũ không thành công!`, {
                //     position: toast.POSITION.TOP_RIGHT,
                // });
            }
        }
    };
    const uploadVideo = async () => {
        const params = {
            parent_id: content?.id,
            parent_type: "COURSE_VIDEO"
        };
        if (video) {
            try {
                setVideoLoading(true);
                setProcessing(true);
                const formData = new FormData();
                formData.append('file', video);
                console.log(formData);
                const videoUrl = await apiUploadFile(formData, params);

                if (videoUrl && videoUrl.data?.path_file) {
                    // dispatch(updateAvatarURL({
                    //     avatarURL: newAvatarUrl.data?.path_file
                    // }));
                    toast.success("Tải lên thành công!", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    handleRemoveVideo();
                }

            } catch (e) {
                console.error('Upload failed:', e);

                toast.error(`Tải lên không thành công!`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
        setVideoLoading(false);
        setProcessing(false);
    };
    const handleUploadVideo = async () => {
        // if (isLoggedIn && userData && userData.id) {
        if (video) {
            setVideoLoading(true);
            setProcessing(true);

            await deleteVideo();
            await uploadVideo();
            handleChange && handleChange(true);

            setVideoLoading(false);
            setProcessing(false);

        } else {
            console.warn('No video selected for upload.');
        }
        // }
    };
    useEffect(() => {
        console.log(content);
    }, []);
    return (
        <>
            <div className='my-6 min-w-[300px] w-[600px]'>
                <div className='w-full flex justify-between items-center mb-6 relative h-[40px] border rounded-sm border-[#003a47]'>
                    <div className='mx-3 w-full h-full flex items-center '>
                        <Typography className='cursor-default'>
                            {video?.name || "Chưa có file được chọn"}
                        </Typography>
                        {video && (
                            <span onClick={handleRemoveVideo} className='cursor-pointer h-full flex items-center justify-between px-3' title='Hủy' >
                                <FontAwesomeIcon className='' icon={faXmark} />
                            </span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="video/*"
                        style={{ display: 'none' }}
                        onChange={handleVideoChange}
                        ref={(fileInput) => (setFileInputRef(fileInput))}
                    />
                    <button onClick={() => fileInputRef && fileInputRef.click()} className="bg-[#3366cc] !rounded-none w-[100px] h-full ring-gray-300 hover:opacity-80 text-white" >Chọn</button>
                </div>
                <div className='w-full min-h-[230px] h-[300px] relative flex border rounded-sm border-[#003a47]'>
                    <div className='relative h-full flex justify-center items-center  w-full bg-[#f0f2f4]'>
                        {videoLoading ? (
                            <Spinner className='w-[60px] object-cover object-center h-auto' color="teal" />
                        ) : (
                            <>
                                {(content?.video_path && !video) ? (
                                    <>
                                        <iframe
                                            className='w-full h-full'
                                            src={content?.video_path}
                                            allowFullScreen
                                        // width="640"
                                        // height="480"
                                        // onLoad={handleLoadingVideo}
                                        // allow="autoplay"
                                        // autoPlay
                                        >
                                            <p>Trình duyệt của bạn không có phép iframe.</p>
                                        </iframe>
                                    </>
                                ) : (
                                    <>
                                        {video ? (
                                            <>
                                                <video width="" className='w-full h-full' controls>
                                                    <source src={video ? URL.createObjectURL(video) : ''} type="video/mp4" />
                                                    {/* <source src={video ? URL.createObjectURL(video) : ''} type="video/ogg" /> */}
                                                    Không hỗ trợ video.
                                                </video>
                                            </>
                                        ) : (
                                            <>
                                                <Typography>Chưa có video được chọn</Typography>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {video && (
                    <div
                        onClick={() => handleUploadVideo()}
                        className={`${processing ? 'pointer-events-none' : ''} h-[50px] mt-2 relative border group/sort duration-200 hover:opacity-75 bg-[#3366cc] text-white cursor-pointer border-[#829093] flex justify-center items-center`}>
                        <Typography className='font-semibold text-base text-white duration-200 '>
                            Lưu
                        </Typography>
                        {processing && (
                            <span className='bg-slate-400 absolute z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                                <Spinner className='h-auto text-[#fff]' color="cyan" />
                            </span>
                        )}
                    </div>
                )}
            </div>

        </>
    );
};

const CourseContent = ({ content }) => {
    return (
        <div>
            <p>This is the content for Nội dung khóa học with content: </p>
        </div>
    );
};

const PriceContent = ({ content }) => {
    return (
        <div>
            <p>This is the content for Giá tiền with content: </p>
        </div>
    );
};

const LecturerCourseSave = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    // const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(true);
    const [change, setChange] = useState({});
    const [myCourse, setMyCourse] = useState({});
    const [courseName, setCourseName] = useState('');
    const getMyCourse = async () => {
        setProcessing(true);
        try {
            const paramsAPI = {
                created_by: userData?.id,
                build_child: false,
                ids: courseId
            };
            const response = await apiGetCourse(paramsAPI);
            if (response?.data?.data?.length > 0) {
                setMyCourse(response.data?.data[0]);
                // console.log('---my course---', response.data?.data[0]);
                setCourseName(response.data?.data[0].name);
            }
            else {
                setMyCourse({});
                console.log('---my course empty---');

            }
        } catch (error) {
            console.error("Error fetching course data", error);
            setMyCourse({});

        } finally {
            setProcessing(false);
        }
    };
    const handleSaveCourse = async () => {
        setProcessing(true);
        const data = {
            // ...myCourse,
            id: myCourse.id,
            name: courseName
        };
        console.log(data);
        const res = await apiSaveCourse(data);
        if (res?.data) {
            getMyCourse();
        }
    };
    const [activeTab, setActiveTab] = useState('Thông tin giới thiệu');

    const tabContentMap = [
        'Thông tin giới thiệu',
        'Video giới thiệu',
        'Nội dung khóa học',
        'Giá tiền',
        'Cài đặt',
    ];

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleChangeIntroductionContent = (data) => {
        setChange(data);
    };
    // useEffect(() => {
    //     getMyCourse();
    //     setActiveTab('Thông tin giới thiệu');
    // }, []);
    useEffect(() => {
        getMyCourse();
    }, [change]);

    return (
        <>
            {/* {myCourse && ( */}
            <div className={`${processing ? 'pointer-events-none' : ''}`}>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-end gap-x-2'>
                        <label className='flex flex-col justify-between items-start'>
                            <Typography className='px-2 text-lg'>Tên khóa học</Typography>
                            <div className='flex items-center gap-2'>
                                <input onBlur={handleSaveCourse} value={courseName} type='text' onChange={(e) => setCourseName(e.target.value)} className='font-bold text-lg border-b-2 px-2 outline-none bg-[#f5f8ff]  focus:border-slate-500 rounded-sm' />
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                            {/* <Typography className='font-bold text-lg'>{myCourse.name}</Typography> */}
                        </label>
                        <div className="flex h-full gap-x-2 items-end">
                            <div className="flex gap-x-2">
                                {myCourse?.courseType == "DRAFT" && (
                                    <Typography className={`font-medium bg-slate-600 text-sm text-white p-1 px-2 rounded-lg`}> Nháp </Typography>
                                )}
                                {myCourse?.courseType == "OFFICIAL" && (
                                    <Typography className={`font-medium bg-[#3366cc] text-sm text-white p-1 px-2 rounded-lg`}> Live </Typography>
                                )}
                                {myCourse?.courseType == "WAITING" && (
                                    <Typography className={`font-medium bg-[#f97316] text-sm text-white p-1 px-2 rounded-lg`}> Chờ duyệt </Typography>
                                )}
                                {myCourse?.courseType == "CHANGE_PRICE" && (
                                    <Typography className={`font-medium bg-[#f93016] text-sm text-white p-1 px-2 rounded-lg`}> Chờ duyệt giá tiền </Typography>
                                )}
                            </div>
                            <div className="flex gap-x-2">
                                <Typography className="font-light "> Công khai </Typography>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => handleSaveCourse()} className='min-w-[3rem] h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none border-[#003a47] flex justify-center items-center'>
                        <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                            Lưu
                        </Typography>
                    </div>
                </div>
                <div className='w-full flex justify-between items-center mb-4'>
                    <div className='flex items-center flex-wrap'>
                        {(tabContentMap).map((tab) => (
                            <div
                                key={tab}
                                className={`flex h-[40px] justify-center hover:bg-[#e2e8f0] border-b-2 px-3 py-1 cursor-pointer min-w-[165px] items-center ${activeTab === tab ? 'bg-[#e9f0f8]  border-blue-400' : ''}`}
                                onClick={() => handleTabClick(tab)}>
                                <Typography className={` min-w-[165px] h-[40px] flex justify-center items-center font-normal ${activeTab === tab ? '' : ''}`}>{tab}</Typography>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-end min-w-[165px]'>Lưu và xuất bản</div>
                </div>
                <div className='p-3 shadow-md my-8 border  mb-4'>
                    <div className=''>
                        <div className='mb-4'>
                            <Typography className={`font-bold`}>{activeTab}</Typography>
                        </div>
                        {/* Render content based on the active tab */}
                        {myCourse && (
                            <>
                                {(activeTab === 'Thông tin giới thiệu') && (
                                    <IntroductionContent content={myCourse} handleChange={handleChangeIntroductionContent} />
                                )}
                                {activeTab === 'Video giới thiệu' && (
                                    <VideoContent content={myCourse} handleChange={handleChangeIntroductionContent} />
                                )}
                                {activeTab === 'Nội dung khóa học' && (
                                    <CourseContent content={myCourse} />
                                )}
                                {activeTab === 'Giá tiền' && (
                                    <PriceContent content={myCourse} />
                                )}
                                {activeTab === 'Cài đặt' && (
                                    <></>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>
            {/* )} */}
            {/* )} */}
            {processing && (
                <span className='bg-[#eaeef6] opacity-70 fixed z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                    <Spinner className='h-auto text-[#fff] w-20' color="cyan" />
                </span>
            )}
        </>
    );
};

export default LecturerCourseSave

