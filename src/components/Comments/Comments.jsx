import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatTimeStampTo_DDMMYYY } from "../../utils/helper"
import { faEdit, faFileVideo } from "@fortawesome/free-regular-svg-icons"
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { apiDeleteComment, apiPostComment } from "../../apis/comment"
import { Spinner } from "@material-tailwind/react"
import { toast } from 'react-toastify';

const CommentItem = ({ comment, currentUser, reload, isReply }) => {
    const [edit, setEdit] = useState(false);
    const [newComment, setNewComment] = useState(comment.content);
    const [reply, setReply] = useState(false);
    const [replyComment, setReplyComment] = useState("");
    const [error, setError] = useState(null);
    const handleSaveComment = async () => {
        if (newComment === "") return setError("Vui lòng nhập nội dung bình luận");
        if (newComment.length < 10) return setError("Nội dung bình luận quá ngắn");
        if (newComment.length > 500) return setError("Nội dung bình luận không được quá 500 ký tự");
        console.log(newComment);
        const data = {
            id: comment.id,
            content: newComment,
            // reference_id: comment.reference_id,
            // type: "COURSE",
            userId: comment.create_by,
            // parent_id: comment?.parent_id || ''
        }
        try {
            const res = await apiPostComment(data);
            console.log(res);
            reload && reload(true);
        } catch (error) {
            console.log(error);
        }
        setEdit(false);
        setNewComment("");
    }
    const handleSaveReplyComment = async () => {
        if (replyComment === "") return setError("Vui lòng nhập nội dung bình luận");
        if (replyComment.length < 10) return setError("Nội dung bình luận quá ngắn");
        if (replyComment.length > 500) return setError("Nội dung bình luận không được quá 500 ký tự");
        const data = {
            content: replyComment,
            reference_id: comment.reference_id,
            type: "COURSE",
            userId: currentUser,
            parent_id: isReply || comment.id 
        }
        try {
            const res = await apiPostComment(data);
            console.log(res);
            reload && reload(true);
        } catch (error) {
            console.log(error);
        }
        setReply(false);
        setReplyComment("");
    }
    const handleDeleteComment = async () => {
        try {
            const res = await apiDeleteComment(comment.id);
            if(res.status === 1){
                toast.success(`Xóa bình luận thành công`, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            // console.log(res);
            reload && reload(true);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <article className={`p-6 text-base bg-white rounded-lg ${isReply && 'mb-3 ml-10 lg:ml-16 '}`}>
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <img
                        className="mr-2 w-10 h-10 rounded-full"
                        src={`${comment.user_detail?.avatar}` || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                        alt={comment.user_detail?.full_name + " - " + comment.user_detail?.email} />
                    <div className="flex flex-col">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900  font-semibold" title={comment.user_detail?.full_name + " - " + comment.user_detail?.email}>
                            {comment.user_detail?.full_name}
                        </p>
                        <p className="inline-flex items-center mr-3 text-sm text-gray-500  font-normal" title={comment.user_detail?.full_name + " - " + comment.user_detail?.email}>
                            {comment.user_detail?.email}
                        </p>
                    </div>
                    <p className="text-sm ml-6 text-gray-600 dark:text-gray-700">
                        <time title={formatTimeStampTo_DDMMYYY(comment.created_at)}>{formatTimeStampTo_DDMMYYY(comment.created_at)}</time>
                    </p>
                </div>
            </footer>
            {!edit ? (
                <p className="text-gray-500 dark:text-gray-700">
                    {comment.content}
                </p>
            ) : (
                <>
                    <div className={`py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 focus-within:border-gray-600 dark:border-gray-400 ${error && 'border-red-600'}`}>
                        <textarea id="comment" rows="6"
                            onChange={(e) => {
                                setNewComment(e.target.value)
                                setError(null);
                            }}
                            // autoFocus
                            onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                            value={newComment}
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none  dark:placeholder-gray-400 "
                            placeholder="Bình luận của bạn..." required></textarea>
                    </div>
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                </>
            )}
            <div className="flex justify-between items-center mt-4 space-x-4">
                {/* {!isReply ? ( */}
                    <button type="button"
                        onClick={() => setReply(!reply)}
                        className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-700 font-medium">
                        <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                        </svg>
                        Phản hồi
                    </button>
                {/* ) : (
                    <div></div>
                )} */}

                {comment.user_detail?.id === currentUser && (
                    <div className="flex items-center space-x-4">
                        {edit ? (
                            <>
                                <button type="button"
                                    onClick={handleSaveComment}
                                    className="flex items-center space-x-1 text-sm text-blue-500 hover:underline dark:text-gray-700 font-medium">
                                    <p>Lưu</p>
                                </button>
                                <button type="button"
                                    onClick={() => {
                                        setEdit(false);
                                        setNewComment(comment.content);
                                        setError(null);
                                    }}
                                    className="flex items-center space-x-1 text-sm text-gray-500 hover:underline dark:text-gray-700 font-medium">
                                    <p>Hủy</p>
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button"
                                    onClick={() => {
                                        setEdit(true)
                                    }}
                                    className="flex items-center space-x-1 text-sm text-blue-500 hover:underline dark:text-gray-700 font-medium">
                                    <p>Chỉnh sửa</p>
                                </button>
                                <button button type="button"
                                    onClick={handleDeleteComment}
                                    className="flex items-center space-x-1 text-sm text-red-500 hover:underline dark:text-gray-700 font-medium">
                                    <p>Xóa</p>
                                </button>
                            </>
                        )}

                    </div>
                )}
            </div >
            {reply && (
                <>
                    <div className={`py-2 mt-4 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 focus-within:border-gray-600 dark:border-gray-400 ${error && 'border-red-600'}`}>
                        <textarea id="comment" rows="6"
                            onChange={(e) => {
                                setReplyComment(e.target.value)
                                setError(null);
                            }}
                            autoFocus
                            onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                            value={replyComment}
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none  dark:placeholder-gray-400 "
                            placeholder="Bình luận của bạn..." required></textarea>
                    </div>
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    <div className="flex">
                        <span className="flex space-x-4">
                            <button type="button"
                                onClick={handleSaveReplyComment}
                                className="flex items-center space-x-1 text-sm text-blue-500 hover:underline dark:text-gray-700 font-medium">
                                <p>Phản hồi</p>
                            </button>
                            <button type="button"
                                onClick={() => {
                                    setEdit(false);
                                    setNewComment(comment.content);
                                    setReplyComment("");
                                    setError(null);
                                    setReply(false);
                                }}
                                className="flex items-center space-x-1 text-sm text-gray-500 hover:underline dark:text-gray-700 font-medium">
                                <p>Hủy</p>
                            </button>
                        </span>
                    </div>
                </>
            )}
        </article >
    )
}
export const Comments = ({ comments, currentUser, courseId, reload }) => {
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    const handleSubmit = async () => {
        if(!currentUser) return setError("Vui lòng đăng nhập để bình luận");
        if (newComment === "") return setError("Vui lòng nhập nội dung bình luận");
        if (newComment.length < 10) return setError("Nội dung bình luận quá ngắn");
        if (newComment.length > 500) return setError("Nội dung bình luận không được quá 500 ký tự");
        const data = {
            content: newComment,
            reference_id: courseId,
            type: "COURSE",
            userId: currentUser
        }
        try {
            const res = await apiPostComment(data);
            console.log(res);
            reload && reload(true);
        } catch (error) {
            console.log(error);
        }
        setNewComment("");
    }
    // useEffect(() => {
    //     if(!currentUser){
    //         setError("Vui lòng đăng nhập để bình luận");
    //     }
    // }, [currentUser])
    return (
        <section className="bg-white py-10 lg:py-10 antialiased">
            <div className="max-w-2xl mx-auto px-4">
                <form className="mb-6">
                    <div className={`py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 focus-within:border-gray-600 dark:border-gray-400 ${error && 'border-red-600'}`}>
                        <textarea id="comment" rows="6"
                            onChange={(e) => {
                                setError(null);
                                setNewComment(e.target.value)
                            }}
                            value={newComment}
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none  dark:placeholder-gray-400 "
                            placeholder="Bình luận của bạn..." required></textarea>
                    </div>
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    <button onClick={handleSubmit}
                        type="button"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        Đăng bình luận
                    </button>
                </form>
                {comments?.map((comment, index) => (
                    <span key={index}>
                        <CommentItem comment={comment} currentUser={currentUser} reload={() => reload && reload(true)} />

                        {comment.reply?.map((reply, indexx) => (
                            <span key={indexx}>
                                {indexx < comment.reply.length && <hr className="" />}
                                <CommentItem comment={reply} currentUser={currentUser} isReply={comment.id} reload={() => reload && reload(true)} />
                            </span>
                        ))}

                        {index < comments.length - 1 && <hr className="my-4 border-gray-200 dark:border-gray-400" />}
                    </span>
                ))}



            </div>
        </section>
    )
}