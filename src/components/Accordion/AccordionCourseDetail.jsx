import React, { useEffect, useRef, useState } from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
    Typography,
} from "@material-tailwind/react";
import Checkbox from '@mui/material/Checkbox';
import { faFileVideo } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { apiMarkCompleteCourseEnrollment, apiUnMarkCompleteCourseEnrollment } from "../../apis/enrollment";
function Icon({ open }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}
const CourseAccordion = React.memo(
    ({ isEnrolled, title, content, onContentClick, onContentCheck, currentCourse, completeCourse, enrollmentId }) => {
        const [alwaysOpen, setAlwaysOpen] = React.useState(false);
        const [activeIndex, setActiveIndex] = useState(null);
        const contentRefs = useRef([]);

        const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);


        const handleContentClick = async (clickedContent, index) => {
            onContentClick && onContentClick(clickedContent);
            setActiveIndex(index);

            await new Promise((resolve) => {setTimeout(()=>{resolve()},500)})
            if(index !== -1){
                contentRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
        const handleCheckComplete = async (e, content) => {
            e.stopPropagation();
            const check = e.target.checked;
            try {
                if (check) {
                    onContentCheck && onContentCheck(content.id, check);
                    console.log(content.id)
                    await apiMarkCompleteCourseEnrollment(enrollmentId, content.id);
                    // toast.success("Đã đánh dấu hoàn thành", {
                    //     position: toast.POSITION.TOP_RIGHT,
                    // });
                } else {
                    onContentCheck && onContentCheck(content.id, check);
                    await apiUnMarkCompleteCourseEnrollment(enrollmentId, content.id);
                }
            } catch (er) {
                toast.error("Đã có lỗi xảy ra: " + er.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        };
        useEffect(() => {
            if (isEnrolled && currentCourse) {
                const currentIndex = content.findIndex((ct) => ct.id == currentCourse);

                if (currentIndex !== -1) {
                    setAlwaysOpen(true);
                    setActiveIndex(currentIndex);
                    handleContentClick(content[currentIndex], currentIndex);
                }
            }
        }, []);
        return (

            <div className="shadow-md">
                {content.length > 0 && (
                    <div>
                        <Accordion open={alwaysOpen} className={`w-full text-ellipsis border border-gray-400 ${isEnrolled && 'border-none'}`}
                            icon={
                                <Typography>
                                    <span className="min-w-[4rem] text-xs line-clamp-1 flex justify-between items-center gap-1 font-normal">
                                        {content.length} bài học
                                    </span>
                                </Typography>
                            }>
                            <AccordionHeader
                                onClick={() => handleAlwaysOpen()}
                                className={`bg-zinc-100 border-b border-gray-300 px-4 transition-colors ${alwaysOpen ? "text-[#003a47]" : ""}`}>
                                {
                                    <span className="max-w-[34rem] max-h-[5rem] line-clamp-2 flex items-center gap-4">
                                        <Icon open={alwaysOpen} />
                                        <span className="line-clamp-2 hover:text-clip uppercase text-[16px]" title={title}>
                                            {title}
                                        </span>

                                    </span>
                                }
                            </AccordionHeader>
                            <AccordionBody
                                className="text-base font-normal p-0 m-0">
                                {
                                    content.map((ct, index) => (
                                        <div key={ct.id}
                                            ref={(ref) => (contentRefs.current[index] = ref)}
                                            className={`${isEnrolled && "hover:bg-slate-200 cursor-pointer py-2"} 
                                                        ${(index % 2 == 0 && !isEnrolled) ? "bg-slate-200" : ""} 
                                                        ${index === activeIndex ? "bg-slate-200" : ""}
                                                        text-sm flex items-center justify-between p-4`}
                                            onClick={() => isEnrolled && handleContentClick(ct, index)}>
                                            <div className="flex w-full justify-between items-center py-2">
                                                <div className="flex gap-3">
                                                    <FontAwesomeIcon className="text-lg" icon={faFileVideo} />
                                                    <div
                                                        className="line-clamp-1 hover:text-clip text-[14px]"
                                                        title={ct.name}>
                                                        {ct.name}
                                                    </div>

                                                </div>
                                                {(isEnrolled && completeCourse) ? (
                                                    <div className="">
                                                        <Tooltip title="Đánh dấu đã hoàn thành" placement="left">
                                                            <Checkbox color="success" defaultChecked={completeCourse.includes(ct.id)} onClick={(e) => handleCheckComplete(e, ct)} />
                                                        </Tooltip>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))
                                }
                            </AccordionBody>
                        </Accordion>
                    </div>
                )}
            </div>
        );
    });

export default CourseAccordion;