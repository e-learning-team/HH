import { useState } from "react";
import logoText from "../../assets/text_w_white_trans_bg.svg";
import fullLogoText from "../../assets/text_w_full_white_trans_bg.svg";
import { faArrowTrendUp, faTv, faBars, faAngleRight, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, Typography } from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import Path from "../../utils/path";
export const LectureSidebar = ({ handleHover }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const Menus = [
        { title: "Khóa học", src: faTv, path: Path.LECTURE_P + Path.LECTURE_COURSE },
        { title: "Số liệu", src: faArrowTrendUp, path: Path.LECTURE_P + "1" },
        { title: "Học viên", src: faUsers, path: Path.LECTURE_P + "2" },
        // { title: "Accounts", src: "User", gap: true },
        // { title: "Schedule ", src: "Calendar" },
        // { title: "Search", src: "Search" },
        // { title: "Analytics", src: "Chart" },
        // { title: "Files ", src: "Folder", gap: true },
        // { title: "Setting", src: "Setting" },
    ];
    const [active, setActive] = useState(false);
    const handleActiveLink = (active) => {
        setActive(active);
    };
    const handleHovers = (hover) => {
        setOpen(hover);
        handleHover && handleHover(hover);
    };
    return (
        <div className="fixed z-[999]" onMouseEnter={() => handleHovers(true)} onMouseLeave={() => handleHovers(false)}>
            <div className={`bg-[#2d2f31] ${open ? "w-52" : "w-20 "} bg-dark-purple h-screen relative duration-500`}>
                <FontAwesomeIcon icon={faAngleRight}
                    className={` absolute cursor-pointer text-white font-bold text-lg -right-5 top-[18px] p-3 w-3 h-3 bg-slate-500 border-dark-purple border-2 rounded-full duration-300 ${open && "rotate-180"}`}
                />

                <div className="flex px-5 gap-x-4 py-3 items-center hover:bg-[#3e4143]" onClick={() => navigate(`${Path.LECTURE_P}`)}>
                    <img src={open ? fullLogoText : logoText} className={`cursor-pointer h-[55px]  ${!open && " "}`} />
                </div>
                <ul className="">
                    {Menus.map((Menu, index) => (
                        <Tooltip key={index} content={Menu.title} className={`bg-[#2d2f31] p-2`} placement="right">
                            <NavLink className={({ isActive }) => (isActive ? ' border-l-4 border-[#3366cc] ' : '') + `hover:bg-[#3e4143] relative flex items-center ${Menu.gap ? "mt-9" : "mb-2"} `} to={`${Menu.path}`}>
                                <li className={`flex text-lg py-4 overflow-clip cursor-pointer px-6  text-white items-center gap-x-4 `}>
                                    <div className="flex justify-between items-center line-clamp-1 py-1 gap-x-5 ">
                                        <FontAwesomeIcon icon={Menu.src} className="" />
                                        <span className={`${!open && "invisible"} line-clamp-1 truncate font-sans text-base font-normal origin-left duration-500`}>
                                            {Menu.title}
                                        </span>
                                    </div>
                                </li>
                            </NavLink>
                        </Tooltip>
                    ))}
                </ul>
            </div>
        </div>
    );
};
// export default LectureSidebar;