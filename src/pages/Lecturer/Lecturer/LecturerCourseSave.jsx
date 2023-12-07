import { Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { MyCKEditor } from '../../../components/Editor/MyCKEditor';
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiCategory } from '../../../apis/category';
import { MultiSelect } from 'primereact/multiselect';
import { apiGetCourse, apiSaveCourse } from '../../../apis/course';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPen, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { apiDeleteFileByPathFile, apiUploadFile } from '../../../apis/fileRelationship';

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
    const [loadingVideo, setLoadingVideo] = useState(true);
    const [video, setVideo] = useState(null);
    const [processing, setProcessing] = useState(false);
    const handleRemoveVideo = () => {
        setVideo(null);
        setLoadingVideo(true);
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
    };
    useEffect(() => {
        console.log(content);
    }, []);
    return (
        <>
            <div className='my-6 min-w-[300px] w-[600px]'>
                <div className='w-full flex justify-between items-center mb-6 relative h-[35px] border rounded-sm border-[#003a47]'>
                    <div className='mx-3 w-full h-full flex items-center line-clamp-1  '>
                        <Typography className='w-full !line-clamp-1 truncate cursor-default'>
                            {`${(content?.video_path && !video) ? content?.video_path : (video ? video?.name : "Chưa có file được chọn")}`}
                        </Typography>
                        {video && (
                            <Typography onClick={handleRemoveVideo} className='cursor-pointer h-full flex items-center justify-between px-3' title='Hủy' >
                                <FontAwesomeIcon className='' icon={faXmark} />
                            </Typography>
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
                                        {loadingVideo ? (
                                            <div className='absolute flex justify-center items-center top-0 left-0 w-full h-full'>
                                                <Spinner className='w-20 h-auto' color="teal" />
                                            </div>
                                        ) : <></>}
                                        <iframe
                                            className='w-full h-full'
                                            src={content?.video_path}
                                            allowFullScreen
                                            onLoad={() => setLoadingVideo(false)}
                                            allow="autoplay"
                                            autoPlay
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
    const [courses, setCourses] = useState([]);
    
    const handleInputChange = (event, index, level3Index = null) => {
        const newCourses = [...courses];
        if (level3Index !== null) {
            newCourses[index].level3Courses[level3Index][event.target.name] = event.target.value;
        } else {
            newCourses[index][event.target.name] = event.target.value;
        }
        setCourses(newCourses);
    };

    const handleAddLevel3Course = (index) => {
        const newCourses = [...courses];
        newCourses[index].level3Courses.push({ contentType: '', title: '' });
        setCourses(newCourses);
    };

    const handleDeleteLevel3Course = (index, level3Index) => {
        const newCourses = [...courses];
        newCourses[index].level3Courses.splice(level3Index, 1);
        setCourses(newCourses);
    };

    const handleAddLevel2Course = () => {
        setCourses([...courses, { title: '', level3Courses: [] }]);
    };

    const handleDeleteLevel2Course = (index) => {
        const newCourses = [...courses];
        newCourses.splice(index, 1);
        setCourses(newCourses);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
    };

    const handleSaveCourse = (index) => {
        const newCourses = [...courses];
        newCourses[index].readOnly = true;
        setCourses(newCourses);
    };

    const handleEditCourse = (index) => {
        const newCourses = [...courses];
        newCourses[index].readOnly = false;
        setCourses(newCourses);
    };

    const handleSaveLevel3Course = (index, level3Index) => {
        const newCourses = [...courses];
        newCourses[index].level3Courses[level3Index].readOnly = true;
        console.log(newCourses[index].level3Courses[level3Index].contentType)
        setCourses(newCourses);
        
    };

    const handleEditLevel3Course = (index, level3Index) => {
        const newCourses = [...courses];
        newCourses[index].level3Courses[level3Index].readOnly = false;
        setCourses(newCourses);
    };
    useEffect(() => {
        console.log(content)
        setCourses(content?.children);
    },[])
    return (
        <form onSubmit={handleSubmit}>
            {courses.map((course, index) => (
                <div key={index} className={`p-3 bg-[#f7f9fa] shadow my-8 border border-black`}>
                    <div className={`flex items-center gap-3 mb-3`}>
                        <label className='flex gap-3 h-full  items-center'>
                            <Typography className='font-bold min-w-[80px]'>Chương {index + 1}: </Typography>
                            <div className='relative h-[40px] flex'>
                                <input
                                    type="text"
                                    name="title"
                                    value={course.title}
                                    onChange={(event) => handleInputChange(event, index)}
                                    placeholder='Tên chương'
                                    className={` px-4 outline-none h-full  ${course.readOnly ? 'border-b border-[#003a47]' : 'border border-[#003a47]'}`}
                                    readOnly={course.readOnly}
                                />
                            </div>
                        </label>
                        {course.readOnly ? (
                            <div title='Thay đổi' onClick={() => handleEditCourse(index)} className='h-[40px] min-w-[40px] px-1 border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none border-[#003a47] flex justify-center items-center'>
                                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                    <FontAwesomeIcon icon={faPen} />
                                </Typography>
                            </div>
                        ) : (
                            <div title='Lưu' onClick={() => handleSaveCourse(index)} className='h-[40px] min-w-[40px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none border-[#003a47] flex justify-center items-center'>
                                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                </Typography>
                            </div>
                        )}
                        <div title='Xóa ' onClick={() => handleDeleteLevel2Course(index)} className=' h-[40px] min-w-[40px] px-1 border group/sort duration-200  hover:bg-[#c85858] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                            <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                <FontAwesomeIcon icon={faTrash} />
                            </Typography>
                        </div>
                    </div>
                    {course.level3Courses.map((level3Course, level3Index) => (
                        <div key={level3Index} className={`p-3 bg-white mb-2 border border-black`}>
                            <div className='flex justify-between items-center gap-3'>
                                <div>
                                    <div className={`flex items-center gap-3 mb-3`}>
                                        <label className='flex gap-3 h-full  items-center'>
                                            <Typography className='font-bold '>Bài {(index + 1) + '.' + (level3Index + 1)}: </Typography>
                                            <div className='relative h-[40px] flex'>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={level3Course.title}
                                                    onChange={(event) => handleInputChange(event, index, level3Index)}
                                                    placeholder='Tiêu đề'
                                                    className={` px-4 outline-none h-full  ${level3Course.readOnly ? 'border-b border-[#003a47]' : 'border border-[#003a47]'}`}
                                                    readOnly={level3Course.readOnly}
                                                />
                                            </div>
                                        </label>
                                        {level3Course.readOnly ? (
                                            <div onClick={() => handleEditLevel3Course(index, level3Index)} className='min-w-[40px] px-1 h-[40px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none border-[#003a47] flex justify-center items-center'>
                                                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                                    <FontAwesomeIcon icon={faPen} />
                                                </Typography>
                                            </div>
                                        ) : (
                                            <div onClick={() => handleSaveLevel3Course(index, level3Index)} className='min-w-[40px] h-[40px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none border-[#003a47] flex justify-center items-center'>
                                                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                                </Typography>
                                            </div>
                                        )}
                                        <div onClick={() => handleDeleteLevel3Course(index, level3Index)} className='h-[40px] w-[40px] px-1 border group/sort duration-200  hover:bg-[#c85858] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </div>
                                    </div>
                                    {(level3Course && level3Course.readOnly) && (
                                        <>
                                            <label>
                                                <Typography className='font-bold'>Nội dung bài học</Typography>
                                                <div className='flex items-center gap-3'>
                                                    <Typography>Chọn loại nội dung:</Typography>
                                                    <select disabled readOnly name="contentType" value={level3Course.contentType} onChange={(event) => handleInputChange(event, index, level3Index)}>
                                                        {/* <option value="">Chọn loại nội dung</option> */}
                                                        <option defaultValue={'VIDEO'} value="VIDEO">Video</option>
                                                        {/* <option value="ARTICLE">Article</option> */}
                                                        {/* <option value="QUIZ">Quiz</option> */}
                                                    </select>
                                                </div>
                                            </label>
                                            <VideoContent content={level3Course} />
                                        </>
                                    )}

                                </div>

                            </div>
                        </div>
                    ))}
                    {(course && course.readOnly) && (
                        <button type="button" onClick={() => handleAddLevel3Course(index)} className=' h-[40px] border group/sort duration-200  hover:bg-[#e5e6e9] px-1  cursor-pointer border-[#003a47] flex justify-center items-center'>
                            Thêm mục trong chương
                        </button>
                    )}
                </div>
            ))}
            <div onClick={handleAddLevel2Course} className=' h-[40px] border group/sort duration-200  hover:bg-[#2d2f31] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                    Thêm chương mới
                </Typography>
            </div>
        </form>
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
    useEffect(() => {
        getMyCourse();
    }, [change]);

    return (
        <>
            <div className={`${processing ? 'pointer-events-none' : ''}`}>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-end gap-x-2'>
                        <label className='flex flex-col justify-between items-start'>
                            <Typography className='px-2 text-lg'>Tên khóa học</Typography>
                            <div className='flex items-center gap-2'>
                                <input onBlur={handleSaveCourse} value={courseName} type='text' onChange={(e) => setCourseName(e.target.value)} className='font-bold text-lg border-b-2 px-2 outline-none bg-[#f5f8ff]  focus:border-slate-500 rounded-sm' />
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
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
                    <div className='flex justify-end min-w-[165px]'>Xuất bản</div>
                </div>
                <div className='p-3 shadow-md my-8 border  mb-4'>
                    <div className=''>
                        <div className='mb-4'>
                            <Typography className={`font-bold`}>{activeTab}</Typography>
                        </div>
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
            {processing && (
                <span className='bg-[#eaeef6] opacity-70 fixed z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                    <Spinner className='h-auto text-[#fff] w-20' color="cyan" />
                </span>
            )}
        </>
    );
};

export default LecturerCourseSave

