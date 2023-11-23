import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from "@material-tailwind/react";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Path from "../../utils/path";
import { Sidebar } from "../../components/Navbar/Sidebar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function User() {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("Bạn cần phải đăng nhập trước", {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate(`/${Path.HOME}`);
            return;
        }
    }, [isLoggedIn]);
    return (
        <div className="flex relative w-full">
            <div className="fixed w-60 z-10 ">
                <Sidebar />
            </div>
            <div className="relative m-6 pl-60 w-full">
                <Outlet />
            </div>
        </div>
    );
}