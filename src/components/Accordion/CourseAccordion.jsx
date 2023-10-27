import React from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
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
export default function CustomAccordion({title, content}) {
    const [open, setOpen] = React.useState(1);
    const [alwaysOpen, setAlwaysOpen] = React.useState(false);

    const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    return (
        <>
            <Accordion open={alwaysOpen} className="mb-2 rounded-lg border border-blue-gray-100 px-4" icon={<Icon open={alwaysOpen} />}>
                <AccordionHeader
                    onClick={() => handleAlwaysOpen()}
                    className={`border-b-0 transition-colors ${alwaysOpen ? "text-blue-500 hover:!text-blue-700" : ""}`}>
                    {title}
                </AccordionHeader>
                <AccordionBody className=" text-base font-normal">
                    {content}
                </AccordionBody>
            </Accordion>
        </>
    );
}