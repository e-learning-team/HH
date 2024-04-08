import { Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { MyCKEditor } from '../../../components/Editor/MyCKEditor';
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiCategory } from '../../../apis/category';
import { MultiSelect } from 'primereact/multiselect';
import { apiDeleteCourse, apiGetCourse, apiLecturePublishCourse, apiSaveCourse, apiUpdateIsPreview } from '../../../apis/course';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faFloppyDisk, faPen, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { apiDeleteFileByPathFile, apiUploadFile } from '../../../apis/fileRelationship';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox } from "primereact/checkbox";
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
                // children: children && children.length > 0 ? addDashesToTitles(children, level + 1) : [],
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
                                    disabled={content?.courseType !== "DRAFT"}
                                    // maxSelectedLabels={3}
                                    className="max-w-full min-w-full md:w-20rem" />
                            </div>
                            <Typography className='text-red-500'>{errors.category_ids}</Typography>
                        </div>
                    </div>
                    <div className='flex flex-wrap w-full justify-between items-center'>
                        <div className='mb-5'>
                            <Typography className='font-normal text-base mb-2'>Mô tả về khóa học</Typography>
                            {content?.courseType === "DRAFT" ? (
                                <MyCKEditor
                                    className={'min-w-full'}
                                    type={'COURSE_DESCRIPTION'}
                                    parent_id={content?.id}
                                    data={content?.description}
                                    handleData={handleEditorDescription}
                                />
                            ) : (
                                <div className='min-h-[350px] max-h-[350px] min-w-[650px] max-w-[650px] overflow-y-auto p-4 bg-white shadow-md' dangerouslySetInnerHTML={{
                                    __html: `${content.description || `Không có mô tả`}`
                                }} />
                            )}
                        </div>
                        <div className='mb-5'>
                            <Typography className='font-normal text-base mb-2'>Yêu cầu khóa học</Typography>
                            {content?.courseType === "DRAFT" ? (
                                <MyCKEditor
                                    className={'min-w-full'}
                                    data={content?.requirement}
                                    handleData={handleEditorRequireMent} />
                            ) : (
                                <div className='min-h-[350px] max-h-[350px] min-w-[650px] max-w-[650px] overflow-y-auto p-4 bg-white shadow-md' dangerouslySetInnerHTML={{
                                    __html: `${content.requirement || `Không có yêu cầu`}`
                                }} />
                            )}
                        </div>
                    </div>
                    <span className='w-full bg-slate-300 h-[1px] my-4'></span>
                    {(content?.courseType === "DRAFT" || content?.contentType === "OFFICIAL") && (
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
                    )}
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
                setVideoLoading(false);
                setProcessing(false);
            } catch (e) {
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
                    // handleRemoveVideo();
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
        // console.log(content);
    }, []);
    return (
        <>
            <div className='min-w-[300px] w-[715px]'>
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
                    {content?.courseType === "DRAFT" && (
                        <>
                            <input
                                type="file"
                                accept="video/*"
                                style={{ display: 'none' }}
                                onChange={handleVideoChange}
                                ref={(fileInput) => (setFileInputRef(fileInput))}
                            />
                            <button onClick={() => fileInputRef && fileInputRef.click()} className="bg-[#3366cc] !rounded-none w-[100px] h-full ring-gray-300 hover:opacity-80 text-white" >Chọn</button>
                        </>
                    )}
                </div>
                <div className='w-full min-h-[230px] h-[350px] relative flex border rounded-sm border-[#003a47]'>
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

const ImageContent = ({ content, handleChange }) => {
    const [fileInputRef, setFileInputRef] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(true);
    const [image, setImage] = useState(null);
    const [processing, setProcessing] = useState(false);
    const handleRemoveImage = () => {
        setImage(null);
        setLoadingImage(true);
        if (fileInputRef && fileInputRef.value) {
            fileInputRef.value = ''; // Reset the file input
        }
    };
    const handleImageChange = (e) => {
        setImageLoading(true);
        setProcessing(true);
        const file = e.target.files[0];
        if (file) {
            if (file.type.includes("image")) {
                setImage(file);
            } else {
                toast.error("Hình ảnh không hợp lệ!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                handleRemoveImage();
            }
        }
        setImageLoading(false);
        setProcessing(false);
    };
    const deleteImage = async () => {
        const params = {
            path_file: content?.image_path,
        };
        console.log('params----', content);
        if (image) {
            try {
                setImageLoading(true);
                setProcessing(true);
                const res = await apiDeleteFileByPathFile(params);
                if (res.status == 1) {
                    toast.success(`Xóa ảnh cũ thành công!`, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                setImageLoading(false);
                setProcessing(false);
            } catch (e) {
            }
        }
    };
    const uploadImage = async () => {
        const params = {
            parent_id: content?.id,
            parent_type: "COURSE_IMAGE"
        };
        if (image) {
            try {
                setImageLoading(true);
                setProcessing(true);
                const formData = new FormData();
                formData.append('file', image);
                console.log(formData);
                const imageUrl = await apiUploadFile(formData, params);

                if (imageUrl && imageUrl.data?.path_file) {
                    toast.success("Tải ảnh lên thành công!", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // handleRemoveVideo();
                }

            } catch (e) {
                console.error('Upload failed:', e);

                toast.error(`Tải ảnh lên không thành công!`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
        setImageLoading(false);
        setProcessing(false);
    };
    const handleUploadImage = async () => {
        if (image) {
            setImageLoading(true);
            setProcessing(true);

            await deleteImage();
            await uploadImage();
            handleChange && handleChange(true);

            setImageLoading(false);
            setProcessing(false);

        } else {
            console.warn('No image selected for upload.');
        }
    };
    useEffect(() => {
        // console.log(content);
    }, []);
    return (
        <>
            <div className='min-w-[300px] w-[715px]'>
                <div className='w-full flex justify-between items-center mb-6 relative h-[35px] border rounded-sm border-[#003a47]'>
                    <div className='mx-3 w-full h-full flex items-center line-clamp-1  '>
                        <Typography className='w-full !line-clamp-1 truncate cursor-default'>
                            {`${(content?.image_path && !image) ? content?.image_path : (image ? image?.name : "Chưa có file được chọn")}`}
                        </Typography>
                        {image && (
                            <Typography onClick={handleRemoveImage} className='cursor-pointer h-full flex items-center justify-between px-3' title='Hủy' >
                                <FontAwesomeIcon className='' icon={faXmark} />
                            </Typography>
                        )}
                    </div>
                    {/* {content?.courseType === "DRAFT" && ( */}
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                                ref={(fileInput) => (setFileInputRef(fileInput))}
                            />
                            <button onClick={() => fileInputRef && fileInputRef.click()} className="bg-[#3366cc] !rounded-none w-[100px] h-full ring-gray-300 hover:opacity-80 text-white" >Chọn</button>
                        </>
                    {/* )} */}
                </div>
                <div className='w-full min-h-[230px] h-[350px] relative flex border rounded-sm border-[#003a47]'>
                    <div className='relative h-full flex justify-center items-center  w-full bg-[#f0f2f4]'>
                        {imageLoading ? (
                            <Spinner className='w-[60px] object-cover object-center h-auto' color="teal" />
                        ) : (
                            <>
                                {(content?.image_path && !image) ? (
                                    <>
                                        {loadingImage ? (
                                            <div className='absolute flex justify-center items-center top-0 left-0 w-full h-full'>
                                                <Spinner className='w-20 h-auto' color="teal" />
                                            </div>
                                        ) : <></>}
                                        {/* <iframe
                                            className='w-full h-full'
                                            src={content?.video_path}
                                            allowFullScreen
                                            onLoad={() => setLoadingImage(false)}
                                            allow="autoplay"
                                            autoPlay>
                                            <p>Trình duyệt của bạn không có phép iframe.</p>
                                        </iframe> */}
                                        <img
                                            src={content?.image_path}
                                            alt={content?.name}
                                            onLoad={() => setLoadingImage(false)}
                                            className="h-full w-full object-cover"
                                        />

                                    </>
                                ) : (
                                    <>
                                        {image ? (
                                            <>
                                                {/* <video width="" className='w-full h-full' controls>
                                                    <source src={image ? URL.createObjectURL(image) : ''} type="video/mp4" />
                                                    Không hỗ trợ video.
                                                </video> */}
                                                <img
                                                    src={image ? URL.createObjectURL(image) : ''}
                                                    type="image/*"
                                                    alt={content?.name}
                                                    controls
                                                    className="h-full w-full object-cover"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Typography>Chưa có hình ảnh được chọn</Typography>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {image && (
                    <div
                        onClick={() => handleUploadImage()}
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
    const [processing, setProcessing] = useState(false);
    const [level3Add, setLevel3Add] = useState(false);
    const [checked, setChecked] = useState(false);
    const handleInputChange = (event, index, level3Index = null) => {
        const newCourses = [...courses];
        if (level3Index !== null) {
            newCourses[index].children[level3Index][event.target.name] = event.target.value;
        } else {
            newCourses[index][event.target.name] = event.target.value;
        }
        setCourses(newCourses);
    };
    const handleUnEditCourseAll = () => {
        const newCourses = [...courses];
        newCourses.forEach(course => {
            course.readOnly = true;
            course.children.forEach(child => {
                child.readOnly = true;
            });
        });
        setCourses(newCourses);
    };
    const handleAddLevel3Course = (index) => {
        handleUnEditCourseAll();
        const newCourses = [...courses];
        newCourses[index].children.push({ type: 'VIDEO', name: '', courseType: 'DRAFT' });
        setCourses(newCourses);
    };

    const handleDeleteLevel3Course = async (index, level3Index) => {
        const newCourses = [...courses];
        setProcessing(true);
        try {
            const params = {
                is_deleted: true,
            };
            await apiDeleteCourse(newCourses[index].children[level3Index].id, params);
            newCourses[index].children.splice(level3Index, 1);
            setCourses(newCourses);
            toast.success(`Xóa thành công!`);
        } catch (e) {
            toast.error(`Xóa không thành công!`);
        }
        setProcessing(false);
    };

    const handleAddLevel2Course = () => {
        handleUnEditCourseAll();
        setCourses([...courses, { name: '', children: [], readOnly: false }]);
    };

    const handleDeleteLevel2Course = async (index) => {
        const newCourses = [...courses];
        setProcessing(true);
        console.log(!newCourses[index].id);
        if (newCourses[index].id) {
            try {
                const params = {
                    is_deleted: true,
                };
                await apiDeleteCourse(newCourses[index].id, params);
                toast.success(`Xóa thành công!`);
                newCourses.splice(index, 1);
                setCourses(newCourses);

            } catch (e) {
                toast.error(`Xóa không thành công!`);
            }
        } else {
            setCourses(newCourses);
        }
        setProcessing(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
    };

    const handleSaveCourse = async (index) => {
        setProcessing(true);
        setLevel3Add(false);
        const newCourses = [...courses];
        const data = {
            id: courses[index].id || '',
            name: courses[index].name,
            parent_id: content?.id,
        };
        console.log(data);
        const res = await apiSaveCourse(data);
        if (res?.data) {
            newCourses[index].id = res?.data?.id;
            newCourses[index].name = res?.data?.name;
        }
        newCourses[index].readOnly = true;
        setCourses(newCourses);
        setProcessing(false);
    };

    const handleEditCourse = (index, isReadOnly) => {
        // setLevel3Add(true);
        handleUnEditCourseAll();
        const newCourses = [...courses];
        newCourses[index].readOnly = isReadOnly;

        if (!newCourses[index].id) {
            // const newCourses = [...courses];
            newCourses.splice(index, 1);
        }
        setCourses(newCourses);
    };

    const handleSaveLevel3Course = async (index, level3Index) => {
        setLevel3Add(false);
        setProcessing(true);
        const newCourses = [...courses];
        const data = {
            id: newCourses[index].children[level3Index].id || '',
            name: newCourses[index].children[level3Index].name,
            parent_id: newCourses[index].id,
            // level: 2
        };
        const res = await apiSaveCourse(data);
        console.log(res);
        if (res?.data) {
            newCourses[index].children[level3Index].id = res?.data?.id;
            newCourses[index].children[level3Index].name = res?.data?.name;
            newCourses[index].children[level3Index].readOnly = true;
            newCourses[index].children[level3Index].showVideoContent = true;
            setCourses(newCourses);
        }
        setProcessing(false);

    };

    const handleEditLevel3Course = (index, level3Index, edit) => {
        setLevel3Add(false);
        handleUnEditCourseAll();
        const newCourses = [...courses];
        newCourses[index].children[level3Index].readOnly = edit;

        if (!newCourses[index].children[level3Index].id) {
            console.log('---delete level 3 course---');
            newCourses[index].children.splice(level3Index, 1);
        }
        setCourses(newCourses);
    };
    const getCourseChild = async () => {
        setProcessing(true);
        try {
            const paramsAPI = {
                level: 2,
                parent_ids: content?.id,
                build_child: true,
                is_deleted: false,
            };
            // const response = await apiGetCourse(paramsAPI);
            // if (response?.data?.data?.length > 0) {
            if (content?.children?.length > 0) {
                const updatedCourses = content?.children?.map(course => ({
                    ...course,
                    readOnly: true,
                    children: course.children.map(child => ({
                        ...child,
                        readOnly: true
                    }))
                }));
                console.log(updatedCourses);
                setCourses(updatedCourses);
            } else {
                setCourses([]);
            }
        } catch (error) {
            setCourses([]);
        } finally {
            setProcessing(false);
        }
    };
    const handleShowContent = (index, level3Index) => {
        const newCourses = [...courses];
        newCourses[index].children[level3Index].showVideoContent = !newCourses[index].children[level3Index].showVideoContent;
        setCourses(newCourses);
    };
    const handleChangeLevel3Description = (value, index, level3Index) => {
        const newCourses = [...courses];
        newCourses[index].children[level3Index].description = value;
        setCourses(newCourses);
    };
    const handleSaveLevel3Description = async (index, level3Index) => {
        const newCourses = [...courses];
        setProcessing(true);
        const data = {
            id: newCourses[index].children[level3Index].id || '',
            parent_id: newCourses[index].id,
            name: newCourses[index].children[level3Index].name,
            description: newCourses[index].children[level3Index].description,
        };
        const res = await apiSaveCourse(data);
        if (res?.data) {
            // newCourses[index].children[level3Index].id = res?.data?.id;
            newCourses[index].children[level3Index].description = res?.data?.description;
            setCourses(newCourses);
        }
        setProcessing(false);
    };
    const handleChangePreview = async (index, level3Index) => {
        const newCourses = [...courses];
        setProcessing(true);
        let is_preview = false
        if (newCourses[index].children[level3Index].is_preview === null || newCourses[index].children[level3Index].is_preview === false) {
            is_preview = true;
        }
        const params = {
            course_id: newCourses[index].children[level3Index].id,
            is_preview: is_preview,
        };
        console.log(params);
        const res = await apiUpdateIsPreview(params);
        newCourses[index].children[level3Index].is_preview = is_preview;
        setCourses(newCourses);
        setProcessing(false);
    };
    useEffect(() => {
        getCourseChild();

        return () => {
            setCourses([]);
        };
    }, []);

    return (
        <div className='relative flex items-center min-h-[250px]'>
            <form onSubmit={handleSubmit} className={`w-full ${processing ? 'pointer-events-none' : ''}`}>
                {courses.map((course, index) => (
                    <div key={index} className={`p-3 bg-slate-100 shadow mb-10 border border-black`}>
                        <div className={`flex justify-between items-center gap-3 mb-3 group/level2`}>
                            <div className={`flex items-top gap-3`}>
                                <Tooltip placement='top' title={`${course?.name}`}>
                                    <label className='flex gap-3  mb-3 h-full items-center'>
                                        <Typography className='font-bold min-w-[80px]'>Chương {index + 1}: </Typography>
                                        <div className='relative h-[40px] flex'>
                                            <input
                                                type="text"
                                                name="name"
                                                value={course.name}
                                                onChange={(event) => handleInputChange(event, index)}
                                                placeholder='Tên chương'
                                                className={`max-w-[450px] min-w-[250px] px-4 outline-none h-full border  ${course.readOnly ? 'border-b-[#003a47]' : 'border-[#003a47]'}`}
                                                readOnly={course.readOnly}
                                                autoFocus
                                            />
                                        </div>
                                    </label>
                                </Tooltip>
                                {content?.courseType === "DRAFT" && (
                                    <>
                                        {course.readOnly ? (
                                            <div title='Thay đổi' onClick={() => handleEditCourse(index, false)} className='hidden group-hover/level2:flex h-[40px] min-w-[40px] px-1 border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none  justify-center items-center'>
                                                <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                                    <FontAwesomeIcon className='text-xs' icon={faPen} />
                                                </Typography>
                                            </div>
                                        ) : (
                                            <div className='flex gap-3'>
                                                <div title='Lưu' onClick={() => handleSaveCourse(index)} className={`h-[40px] min-w-[40px] border group/sort duration-200  bg-[#3366cc] text-white cursor-pointer hover:border-none  flex justify-center items-center`}>
                                                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-white'>
                                                        Lưu
                                                    </Typography>
                                                </div>
                                                <div title='Hủy' onClick={() => handleEditCourse(index, true)} className='h-[40px] min-w-[40px] px-1 border group/sort duration-200  hover:bg-[#c85858] hover:text-white cursor-pointer hover:border-none  flex justify-center items-center'>
                                                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                                        Hủy
                                                    </Typography>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {content?.courseType === "DRAFT" && (
                                <div title='Xóa ' onClick={() => handleDeleteLevel2Course(index)} className='hidden group-hover/level2:flex h-[40px] min-w-[40px] px-1 border group/sort duration-200  hover:bg-[#c85858] hover:text-white cursor-pointer border-[#003a47] justify-center items-center'>
                                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                        <FontAwesomeIcon icon={faTrash} className='text-xs' />
                                    </Typography>
                                </div>
                            )}
                        </div>
                        {course.children.map((level3Course, level3Index) => (
                            <div key={level3Index} className={`p-3 ${(level3Index % 2 === 0) ? 'bg-[#fff]' : 'bg-[#fff]'} my-4 border hover:bg-[#defafc22] border-black`}>
                                {course.readOnly ? (
                                    <div className='flex justify-between items-center gap-3'>
                                        <div className='w-full h-full'>
                                            <div className={`group/level3 flex justify-between w-full items-center gap-3`}>
                                                <div className={`flex items-center gap-3`}>
                                                    <Tooltip placement='top' title={`${level3Course?.name}`}>
                                                        <label className='flex gap-3 h-full  items-center'>
                                                            <Typography className='font-bold min-w-[60px]'>Bài giảng {(index + 1) + '.' + (level3Index + 1)}: </Typography>
                                                            <div className='relative h-[40px] flex'>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={level3Course.name}
                                                                    onChange={(event) => handleInputChange(event, index, level3Index)}
                                                                    placeholder='Tiêu đề'
                                                                    className={`max-w-[450px] min-w-[250px] px-4 outline-none h-full  border  ${level3Course.readOnly ? 'border-b-[#003a47]' : 'border-[#003a47]'}`}
                                                                    readOnly={level3Course.readOnly}
                                                                    autoFocus={!level3Course.readOnly}
                                                                />
                                                            </div>
                                                        </label>
                                                    </Tooltip>
                                                    {content?.courseType === "DRAFT" && (
                                                        <>
                                                            {level3Course.readOnly ? (
                                                                <div title='Thay đổi' onClick={() => handleEditLevel3Course(index, level3Index, false)} className='hidden group-hover/level3:flex min-w-[40px] px-1 h-[40px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none justify-center items-center'>
                                                                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                                                        <FontAwesomeIcon className='text-xs' icon={faPen} />
                                                                    </Typography>
                                                                </div>
                                                            ) : (
                                                                <div className='flex gap-3'>
                                                                    <div title='Lưu' onClick={() => handleSaveLevel3Course(index, level3Index)} className='h-[40px] min-w-[40px] border group/sort duration-200  bg-[#3366cc] text-white cursor-pointer hover:border-none flex justify-center items-center'>
                                                                        <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-white'>
                                                                            Lưu
                                                                        </Typography>
                                                                    </div>
                                                                    <div title='Hủy' onClick={() => handleEditLevel3Course(index, level3Index, true)} className='h-[40px] min-w-[40px] px-1 border group/sort duration-200  hover:bg-[#c85858] hover:text-white cursor-pointer hover:border-none flex justify-center items-center'>
                                                                        <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                                                            Hủy
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div title='Xóa' onClick={() => handleDeleteLevel3Course(index, level3Index)} className='hidden group-hover/level3:flex h-[40px] w-[40px] px-1 border group/sort duration-200  hover:bg-[#c85858] hover:text-white cursor-pointer border-[#003a47] justify-center items-center'>
                                                                <FontAwesomeIcon icon={faTrash} className='text-xs' />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex">
                                                    {level3Course?.id !== undefined && content.price_sell !== undefined && content.price_sell > 0 && (
                                                        <div className="flex align-items-center mr-4">
                                                            <Checkbox inputId="ingredient1" onChange={e => handleChangePreview(index, level3Index)} checked={level3Course?.is_preview}></Checkbox>
                                                            <Typography className='flex items-center gap-1 px-1'>
                                                                Xem trước
                                                            </Typography>
                                                        </div>
                                                    )}
                                                    <div onClick={() => handleShowContent(index, level3Index)} className='h-[40px] hover:bg-slate-100 flex items-center justify-center cursor-pointer' title={`${level3Course.showVideoContent ? 'Xem nội dung' : 'Ẩn nội dung'}`}>
                                                        {level3Course.showVideoContent ?
                                                            (
                                                                <Typography className='flex items-center gap-1 px-1 min-w-[110px]'>
                                                                    Ẩn nội dung
                                                                    <FontAwesomeIcon icon={faChevronUp} />
                                                                </Typography>
                                                            ) :
                                                            (
                                                                <Typography className='flex items-center gap-1 px-1 min-w-[110px]'>
                                                                    Hiện nội dung
                                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                                </Typography>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {(level3Course && level3Course.readOnly) && (
                                                <>
                                                    {level3Course.showVideoContent && (
                                                        <div className='mt-6'>
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
                                                            <div className='mt-3 flex flex-wrap justify-between'>
                                                                <div className=''>
                                                                    <Typography className='font-medium'>Video</Typography>
                                                                    <VideoContent content={level3Course} />
                                                                </div>
                                                                <div className=''>
                                                                    <Typography className='font-medium'>Mô tả</Typography>
                                                                    <div className=''>
                                                                        {content?.courseType === "DRAFT" ? (
                                                                            <>
                                                                                <div title='Lưu' disabled={course?.courseType !== 'DRAFT'} onClick={() => handleSaveLevel3Description(index, level3Index)} className='mb-6 h-[33px]  min-w-[40px] border border-[#003a47] group/sort duration-200  bg-[#3366cc] text-white cursor-pointer hover:opacity-70 flex justify-center items-center'>
                                                                                    <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-white'>
                                                                                        Lưu
                                                                                    </Typography>
                                                                                </div>
                                                                                <MyCKEditor className={`max-w-[600px] max-h-[350px]`} data={level3Course.description} handleData={(value) => handleChangeLevel3Description(value, index, level3Index)} />
                                                                            </>
                                                                        ) : (
                                                                            <div className='min-h-[407px] max-h-[407px] min-w-[650px] max-w-[650px] overflow-y-auto p-4 bg-white shadow-md' dangerouslySetInnerHTML={{
                                                                                __html: `${level3Course.description || `Không có mô tả`}`
                                                                            }} />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Typography className='font-medium'>Nội dung {(index + 1) + '.' + (level3Index + 1)}.......</Typography>
                                    </>
                                )}
                            </div>
                        ))}
                        {content?.courseType === "DRAFT" && (
                            <>
                                {(course && course.readOnly) && (
                                    <button type="button" onClick={() => handleAddLevel3Course(index)} className=' h-[40px] border group/sort duration-200  hover:bg-[#e5e6e9] px-1  cursor-pointer border-[#003a47] flex justify-center items-center'>
                                        Thêm mục trong chương
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ))}
                {content?.courseType === "DRAFT" && (
                    <div onClick={handleAddLevel2Course} className='justify-self-center h-[40px] w-[200px] border group/sort duration-200  hover:bg-[#2d2f31] hover:text-white cursor-pointer border-[#003a47] flex justify-center items-center'>
                        <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                            Thêm chương mới
                        </Typography>
                    </div>
                )}
            </form>
            {processing && (
                <div className='absolute top-0 bottom-0 right-0 left-0 bg-slate-200 opacity-70 flex justify-center items-center'>
                    <Spinner className='h-auto text-[#fff] w-20' color="cyan" />
                </div>
            )}
        </div>

    );
};

const PriceContent = ({ content, handleChange }) => {
    const [processing, setProcessing] = useState(false);
    const [priceType, setPriceType] = useState('FREE');
    const [priceValue, setPriceValue] = useState(0);
    const [errors, setErrors] = useState({
        price: "",
    });
    const handlePriceTypeChange = (event) => {
        if (event.target.value === 'FREE') {
            setPriceType('FREE');
            setPriceValue(0);
            setErrors((errors) => ({
                ...errors,
                price: "",
            }));
        } else {
            setPriceType('PAID');
            setPriceValue(10000);
        }
    };
    const validateForm = () => {
        let valid = true;
        if (priceType === 'PAID' && priceValue < 10000) {
            valid = false;
            setErrors((errors) => ({
                ...errors,
                price: "Giá bán không bé hơn 10.000 Vnđ",
            }));
        }
        return valid;
    };

    const handlePriceValueChange = (event) => {
        // console.log(event.target.value);
        setPriceValue(event.target.value);
        setErrors((errors) => ({
            ...errors,
            price: "",
        }));
    };
    const handlePriceSave = async () => {
        setProcessing(true);
        if (validateForm()) {
            const data = {
                id: content?.id,
                name: content?.name,
                price_sell: priceValue,
            };
            console.log(data);
            const res = await apiSaveCourse(data);
            if (res?.data) {
                handleChange && handleChange(res?.data);
            }
        } else {
        }
        setProcessing(false);
    };
    useEffect(() => {
        if (content?.price_sell > 0) {
            setPriceType('PAID');
            setPriceValue(content?.price_sell);
        }
    }, []);

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <div className=''>
                    <label className='flex mb-4 gap-2 items-center'>
                        <input
                            type="radio"
                            name="price"
                            value="FREE"
                            checked={priceType === 'FREE'}
                            disabled={content?.courseType !== 'DRAFT' && content?.courseType != 'OFFICIAL'}
                            onChange={handlePriceTypeChange}
                        />
                        <Typography className='font-bold'>Miễn phí</Typography>
                    </label>
                    <label className='flex mb-4 gap-2 items-center'>
                        <input
                            type="radio"
                            name="price"
                            value="PAID"
                            checked={priceType === 'PAID'}
                            disabled={content?.courseType !== 'DRAFT' && content?.courseType != 'OFFICIAL'}
                            onChange={handlePriceTypeChange}
                        />
                        <Typography className='font-bold'>Có phí</Typography>
                    </label>
                    {priceType === 'PAID' && (
                        <div className='flex items-center h-[40px] gap-3'>
                            <Tooltip title='Giá bán không bé hơn 10.000 Vnđ' placement='right'>
                                <label className='flex gap-3  h-full items-center'>
                                    <Typography className='font-bold min-w-[50px]'>Giá:<span className='text-red-500'>*</span> </Typography>
                                    <div className='relative h-[40px] flex'>
                                        <input
                                            type="text"
                                            name="name"
                                            value={priceValue}
                                            onChange={(event) => handlePriceValueChange(event)}
                                            placeholder='Tên chương'
                                            className={` px-4 outline-none h-full border  border-b-[#003a47] `}
                                            disabled={content?.courseType !== 'DRAFT' && content?.courseType != 'OFFICIAL'}
                                            autoFocus
                                        />
                                    </div>
                                    <div className='flex items-center h-[40px] gap-3 border border-[#003a47] px-2 '>
                                        <Typography className='font-bold'>Vnđ</Typography>
                                    </div>
                                </label>
                            </Tooltip>
                        </div>
                    )}
                    {errors.price && (
                        <div>
                            <Typography className='text-red-500'>{errors.price}</Typography>
                        </div>
                    )}
                    {(content?.courseType === "DRAFT" || content?.courseType === "OFFICIAL") && (
                        <div title='Lưu' onClick={handlePriceSave} className='h-[50px] mt-4 min-w-[40px] max-w-[278px] border border-[#003a47] group/sort duration-200  bg-[#3366cc] text-white cursor-pointer hover:opacity-70 flex justify-center items-center'>
                            <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-white'>
                                Lưu
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
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
    const [openPublishDialog, setOpenPublishDialog] = useState(false);
    const getMyCourse = async () => {
        setProcessing(true);
        try {
            const paramsAPI = {
                created_by: window.location.pathname.normalize().includes('admin') ? "" : userData?.id,
                build_child: true,
                ids: courseId
            };
            const response = await apiGetCourse(paramsAPI);
            if (response?.data?.data?.length > 0) {
                document.title = response.data?.data[0].name;
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
        setProcessing(false);
    };
    const [activeTab, setActiveTab] = useState('Thông tin giới thiệu');

    const tabContentMap = [
        'Thông tin giới thiệu',
        'Hình ảnh & Video giới thiệu',
        'Nội dung khóa học',
        'Giá tiền',
        // 'Cài đặt',
    ];

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleChangeIntroductionContent = (data) => {
        setChange(data);
    };
    const handlePublishCourse = async () => {
        setProcessing(true);
        const params = {
            course_id: myCourse.id,
        };
        const res = await apiLecturePublishCourse(params);
        if (res?.status === 1) {
            setChange(true);
        } else {
            toast.error(`Xuất bản không thành công!`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
        setOpenPublishDialog(false);
        setProcessing(false);
    };
    useEffect(() => {
        document.title = 'Khóa học của tôi';
    }, []);
    useEffect(() => {
        getMyCourse();
    }, [change]);

    return (
        <>
            <div className={`${processing ? 'pointer-events-none' : ''} mb-80`}>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-end gap-x-2'>
                        <label className='flex flex-col justify-between items-start'>
                            <Typography className='px-2 text-lg'>Tên khóa học</Typography>
                            <div className='flex items-center gap-2'>
                                <input
                                    onBlur={handleSaveCourse}
                                    value={courseName} type='text'
                                    onChange={(e) => setCourseName(e.target.value)}
                                    className='font-bold text-lg border-b-2 px-2 outline-none bg-[#f5f8ff]  focus:border-slate-500 rounded-sm'
                                    disabled={myCourse?.courseType !== 'DRAFT'}
                                />
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
                    {/* <div onClick={() => handleSaveCourse()} className='min-w-[3rem] h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-none border-[#003a47] flex justify-center items-center'>
                        <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                            Lưu
                        </Typography>
                    </div> */}
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
                    {myCourse?.courseType === 'DRAFT' && (
                        <div onClick={() => setOpenPublishDialog(true)} className='min-w-[12rem] px-2 h-[50px] border group/sort duration-200  hover:bg-[#3366cc] hover:text-white cursor-pointer hover:border-[#3366cc] border-[#003a47] flex justify-center items-center'>
                            <Typography className='font-semibold text-base group-hover/sort:text-white duration-200 text-black'>
                                Xuất bản
                            </Typography>
                        </div>
                    )}
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
                                {activeTab === 'Hình ảnh & Video giới thiệu' && (
                                    <div className="flex justify-between">
                                        <div>
                                        <label htmlFor="imageContent" className="font-bold block mb-2">Hình ảnh:</label>
                                            <ImageContent id="imageContent" content={myCourse} handleChange={handleChangeIntroductionContent} />
                                        </div>
                                        <div>
                                        <label htmlFor="imageContent" className="font-bold block mb-2">Video:</label>
                                            <VideoContent content={myCourse} handleChange={handleChangeIntroductionContent} />
                                        </div>

                                    </div>
                                )}
                                {activeTab === 'Nội dung khóa học' && (
                                    <CourseContent content={myCourse} />
                                )}
                                {activeTab === 'Giá tiền' && (
                                    <PriceContent content={myCourse} handleChange={handleChangeIntroductionContent} />
                                )}
                                {activeTab === 'Cài đặt' && (
                                    <></>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Dialog
                open={openPublishDialog}
                onClose={() => setOpenPublishDialog(false)}
                aria-labelledby="alert-dialog-title"
                width='lg'
                aria-describedby="alert-dialog-description" >
                <DialogTitle id="alert-dialog-title">
                    {
                        <>
                            <Typography className='font-bold text-lg text-[#9b9b9b]'>Xuất bản khóa học: <span className='underline text-black'>{myCourse?.name}</span></Typography>
                        </>
                    }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography className='font-semibold text-lg'>
                            Với giá:
                            {myCourse?.price_sell > 0 ? (
                                <>
                                    &nbsp;<span className='font-bold text-lg text-black underline mx-1'>{myCourse?.price_sell.toLocaleString()}</span>&nbsp;Vnđ
                                </>
                            ) : (
                                <span className='font-bold text-lg text-black'> Miễn phí</span>
                            )}
                        </Typography>
                        <Typography className='font-normal text-lg mt-4'>
                            Xuất bản khóa học sẽ không thể chỉnh sửa lại được.
                            <br />
                            Bạn có chắc chắn muốn xuất bản khóa học này?
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPublishDialog(false)} className='hover:opacity-70 text-white bg-red-500 mr-4 pt-2'>Hủy</Button>
                    <Button onClick={() => handlePublishCourse()} className='hover:opacity-70 text-white bg-[#3366cc] pt-2'>Xác nhận</Button>
                </DialogActions>
            </Dialog>
            {processing && (
                <span className='bg-[#eaeef6] opacity-70 fixed z-10 top-0 pointer-events-none right-0 bottom-0 left-0 flex justify-center items-center'>
                    <Spinner className='h-auto text-[#fff] w-20' color="cyan" />
                </span>
            )}
        </>
    );
};

export default LecturerCourseSave

