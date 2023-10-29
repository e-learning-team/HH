import React from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { faFileVideo } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
export default function CustomAccordion({ title, content }) {
    const [alwaysOpen, setAlwaysOpen] = React.useState(false);

    const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);

    return (

        <div className="shadow-md">
            {content.length > 0 && (
                <div>
                    <Accordion open={alwaysOpen} className="w-full text-ellipsis border border-gray-400 "
                        icon={
                            <span className="text-sm min-w-[5rem] font-normal flex items-center gap-3">
                                <span>{content.length} bài học</span>
                                <span>•</span>
                                {/* <span>15 phút</span> */}
                            </span>
                        }>
                        <AccordionHeader
                            onClick={() => handleAlwaysOpen()}
                            className={`bg-zinc-100 border-b border-gray-300 px-4 transition-colors ${alwaysOpen ? "text-[#003a47]" : ""}`}>
                            {
                                <span className="max-w-[34rem] max-h-[5rem] truncate flex items-center gap-4">
                                    <Icon open={alwaysOpen} />
                                    <span className="truncate hover:text-clip">
                                        {title}
                                    </span>

                                </span>
                            }
                        </AccordionHeader>
                        <AccordionBody className="px-4 text-base font-normal">
                            {
                                content.map((ct) => (
                                    <div key={ct.id} className="text-sm my-2 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon className="text-lg" icon={faFileVideo} />
                                            <div className="max-w-[34rem] truncate hover:text-clip">{ct.name}</div>
                                        </div>
                                        <div>
                                            <span>15 phút</span>
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
}