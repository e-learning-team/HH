import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { faMagnifyingGlass, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { apiUserList, apiUpdateStatus, apiUpdateRoles } from '../../../apis/user';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { Avatar } from "@material-tailwind/react";
import defaultAvatar from '../../../assets/user_img.png';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { apiGetInvoice } from '../../../apis/invoice';
import { formatTimeStampTo_DDMMYYY } from '../../../utils/helper';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Calendar } from 'primereact/calendar';
import CountUp from 'react-countup';
import { apiCategory } from '../../../apis/category';
import { apiGetCourse } from '../../../apis/course';
const AdminDashboard = () => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    const [userList, setUserList] = useState([]);
    const [invoiceList, setInvoiceList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [totalCourse, setTotalCourse] = useState(0);
    const [totalCategory, setTotalCategory] = useState(0);
    const getUsers = async () => {
        try {
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('status', 'ALL');
            paramsAPI.set('max_result', '10');
            paramsAPI.set('current_page', '1');
            const response = await apiUserList(paramsAPI);
            if (response?.data?.data?.length > 0) {
                setUserList(response.data.data);
                setTotalUser(response.data.total);
            }
            else {
                if (response?.data?.total > 0) {
                } else {
                    setUserList([]);
                }
            }
        } catch (error) {
            setUserList([]);
        }
    };
    const getInvoice = async () => {
        try {
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('max_result', '10');
            paramsAPI.set('current_page', '1');
            paramsAPI.set('is_current_user', false);
            const response = await apiGetInvoice(paramsAPI);
            if (response?.data?.data?.length > 0) {
                setInvoiceList(response.data.data);
                setTotalPrice(response.data.attribute?.attributeValue);
            } else {
                setTotalPrice(0);
                setInvoiceList([]);
            }
        } catch (error) {
            setInvoiceList([]);
        } finally {
        }
    };

    const getCategories = async () => {
        try {
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('build_type', 'LIST');
            paramsAPI.set('is_deleted', false);
            const response = await apiCategory(paramsAPI);
            if (response?.data?.length > 0) {
                setTotalCategory(response.data.length);
            }
            else {
                setTotalCategory(0);
            }
        } catch (error) {
            toast.error("Xảy ra lỗi khi lấy thông tin danh mục")
            setTotalCategory(0);
        }
    }

    const searchCourse = async (pageIndex) => {
        try {
            setTotalCourse(0);
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('max_result', 1);
            paramsAPI.set('is_deleted', 'false');
            paramsAPI.set('current_page', pageIndex || 1);
            const response = await apiGetCourse(paramsAPI);
            console.log(response)
            if (response.data && response.data.data && response.data.data?.length > 0) {
                setTotalCourse(response.data.total);
            }
        } catch (error) {
            console.error("Error fetching course data", error);
        } finally {
            
        }
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Avatar
                    className="w-[32px] h-[32px] rounded-full align-middle mr-2"
                    src={rowData.avatar != null ? rowData.avatar : defaultAvatar}
                />
                <span className="image-text">{rowData.full_name}</span>
            </React.Fragment>
        );
    };

    const registerBody = (rowData) => {
        return (
            <React.Fragment>
                <Avatar
                    className="w-[32px] h-[32px] rounded-full align-middle mr-2"
                    src={rowData.avatar != null ? rowData.avatar : defaultAvatar}
                />
                <span className="image-text">{rowData.customerName}</span>
            </React.Fragment>
        );
    }

    useEffect(() => {
        getUsers();
        getInvoice();
        getCategories();
        searchCourse();
    }, [])

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <h4 className="relative uppercase font-semibold text-2xl">
                    Tổng quan
                </h4>
            </div>
            <div className="flex flex-wrap mt-5 -mx-3">
                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl border rounded-xl bg-clip-border">
                        <div className="flex-auto p-4">
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Tổng người dùng</p>
                                        <CountUp className='text-[24px] mb-2 font-sans font-bold dark:text-white' end={totalUser} duration={2}></CountUp>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500">
                                        <i className="pi pi-user ni leading-none ni-money-coins text-lg relative top-3.5 text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl border rounded-xl bg-clip-border">
                        <div className="flex-auto p-4">
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Tổng khoá học</p>
                                        <CountUp className='text-[24px] mb-2 font-sans font-bold dark:text-white' end={totalCourse} duration={2}></CountUp>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-red-600 to-orange-600">
                                        <i className="pi pi-book ni leading-none ni-world text-lg relative top-3.5 text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl border rounded-xl bg-clip-border">
                        <div className="flex-auto p-4">
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Tổng danh mục</p>
                                        <CountUp className='text-[24px] font-sans mb-2 font-bold dark:text-white' end={totalCategory} duration={2}></CountUp>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-emerald-500 to-teal-400">
                                        <i className="pi pi-list ni leading-none ni-paper-diploma text-lg relative top-3.5 text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl border rounded-xl bg-clip-border">
                        <div className="flex-auto p-4">
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Tổng doanh thu</p>
                                        <CountUp className='text-[24px] mb-2 font-sans font-bold dark:text-white' end={totalPrice} duration={2}></CountUp>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-orange-500 to-yellow-500">
                                        <i className="pi pi-wallet ni leading-none ni-cart text-lg relative top-3.5 text-white"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap mt-6 -mx-3 mb-10">
                <div className="w-full max-w-full px-3 flex-0 lg:flex-0 lg:w-5/12">
                    <div className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl border rounded-xl bg-clip-border p-4">
                        <h4 className="relative font-bold text-xl">
                            Người dùng mới
                        </h4>
                        <div className="mt-5">
                            <DataTable value={userList} dataKey="id" emptyMessage="Không có người dùng mới nào cả!">
                                <Column field="id" header="Mã" style={{ width: '15%' }} />
                                <Column header="Tên" style={{ width: '45%' }} body={nameBodyTemplate} />
                                <Column field="email" header="Email" headerStyle={{ width: '40%' }} />
                            </DataTable>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-full px-3 mt-6 flex-0 lg:mt-0 lg:flex-0 lg:w-7/12">
                    <div className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl border rounded-xl bg-clip-border p-4">
                        <h4 className="relative font-bold text-xl">
                            Doanh thu gần đây
                        </h4>
                        <div className="mt-5">
                            <DataTable
                                value={invoiceList}
                                dataKey="id"
                                style={{ width: '100%' }}
                                emptyMessage="Danh sách doanh thu rỗng"
                            >
                                <Column field="id" header="Mã" headerStyle={{ width: '10%' }} ></Column>
                                <Column field="#" header="Thời gian" body={(data, options) => formatTimeStampTo_DDMMYYY(data.createdAt, true)} headerStyle={{ width: '18%' }} ></Column>
                                <Column field="courseName" header="Khoá học" headerStyle={{ width: '32%' }} ></Column>
                                <Column field="#" header="Người đăng ký" body={registerBody} headerStyle={{ width: '25%' }} ></Column>
                                <Column field="#" header="Phí đăng ký" className="font-bold" body={(data, options) => data.pricePurchase.toLocaleString() + " ₫"} headerStyle={{ width: '15%' }} ></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );


}


export default AdminDashboard