import { useState } from "react";
import logoText from "../../assets/text_w_white_trans_bg.svg";
import fullLogoText from "../../assets/text_w_full_white_trans_bg.svg";
import { faArrowTrendUp, faTv, faBars, faAngleRight, faUsers, faBook, faList, faHandHoldingDollar} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, Typography } from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import Path from "../../utils/path";
export const AdminSidebar = ({ handleHover }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const Menus = [
        { title: "Người dùng", src: faUsers, path: Path.ADMIN_P + Path.ADMIN_USER},
        { title: "Khoá học", src: faBook, path: Path.ADMIN_P + Path.ADMIN_COURSE},
        { title: "Danh mục", src: faList, path: Path.ADMIN_P + Path.ADMIN_CATEGORY},
        { title: "Doanh thu", src: faHandHoldingDollar, path: Path.ADMIN_P + Path.ADMIN_SALE},

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

                <div className="flex px-5 gap-x-4 py-3 items-center hover:bg-[#3e4143]" onClick={() => navigate(`${Path.ADMIN_P}${Path.ADMIN_COURSE}`)}>
                    <img src={open ? fullLogoText : logoText} className={`cursor-pointer h-[55px]  ${!open && " "}`} />
                </div>
                <ul className="truncate duration-500">
                    {Menus.map((Menu, index) => (
                        <Tooltip key={index} content={Menu.title} className={`bg-[#2d2f31] p-2`} placement="right">
                            <NavLink className={({ isActive }) => (isActive ? ' border-l-4 border-[#3366cc] ' : '') + `hover:bg-[#3e4143] relative flex items-center ${Menu.gap ? "mt-9" : "mb-2"} `} to={`${Menu.path}`}>
                                <li className={`flex text-lg py-4 truncate cursor-pointer px-6  text-white items-center gap-x-4 `}>
                                    <div className="flex justify-between items-center line-clamp-1 truncate py-1 gap-x-5 ">
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