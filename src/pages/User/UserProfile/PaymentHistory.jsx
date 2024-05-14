import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { apiUpdateStatus, apiUpdateRoles } from '../../../apis/user';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { apiGetInvoice } from '../../../apis/invoice';
import { formatTimeStampTo_DDMMYYY } from '../../../utils/helper';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Calendar } from 'primereact/calendar';
const UserHistory = () => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    const navigate = useNavigate();
    const [invoiceList, setInvoiceList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0,
        roles: null,
        status: null,
        sortField: null,
        sortOrder: null
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const getUsers = async (params) => {
        setLoading(true);
        try {
            setInvoiceList([]);
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('max_result', params.rows != null ? params.rows : '10');
            paramsAPI.set('current_page', params.page != null ? params.page + 1 : '1');
            paramsAPI.set('user_id', userData?.id);
            // paramsAPI.set('is_current_user', true);
            if (fromDate != null && fromDate > 0) {
                paramsAPI.set('from_date', fromDate.getTime());
            }
            if (toDate != null && toDate > 0) {
                paramsAPI.set('to_date', toDate.getTime());
            }
            const response = await apiGetInvoice(paramsAPI);
            if (response?.data?.data?.length > 0) {
                setInvoiceList(response.data);
                setTotalPrice(response.data.attribute?.attributeValue);
            } else {
                setTotalPrice(0);
                setUserList([]);
            }
        } catch (error) {
            setInvoiceList([]);
        } finally {
            setLoading(false);
        }
    };



    let loadLazyTimeout = null;

    useEffect(() => {
        loadLazyData();
    }, [lazyParams, fromDate, toDate])

    const loadLazyData = async () => {
        setLoading(true);
        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }

        //imitate delay of a backend call
        loadLazyTimeout = setTimeout(() => {
            getUsers(lazyParams);
            setLoading(false);
        }, Math.random() * 1000 + 250);

    }

    const onPage = (event) => {
        setLazyParams(event);
    }

    const onSort = (event) => {
        setLazyParams(event);
    }

    const onFilter = (event) => {
        event['first'] = 0;
        setLazyParams(event);
    }

    const statusBody = (rowData) => {
        return <Tag value={!rowData.is_deleted ? 'Đang hoạt động' : 'Bị khoá'} severity={!rowData.is_deleted ? 'success' : 'danger'} className='rounded' />;
    };
    const roleBody = (rowData) => {
        rowData.roles.sort((a, b) => {
            return getRoleOrder(a) - getRoleOrder(b);
        });
        return (
            rowData.roles.map((item, index) => {
                return (
                    <Tag key={index} value={getNameRoleOfRole(item)} severity={getSeverityOfRoles(item)} className="mr-1 rounded" />
                )
            })
        )

    }
    const registerBody = (rowData) => {
        return (
            <React.Fragment>
                <span className="image-text font-medium">{rowData.customerName}</span> <br />
                <span className="image-text">Email: {rowData.customerEmail}</span>
            </React.Fragment>
        );
    }
    const getRoleOrder = (role) => {
        switch (role) {
            case 'ROLE_USER':
                return 1;

            case 'ROLE_LECTURE':
                return 2;

            case 'ROLE_MANAGER':
                return 3;

            case 'ROLE_ADMIN':
                return 4;

            default:
                return 999;
        }
    };
    const getSeverityOfRoles = (role) => {
        switch (role) {
            case 'ROLE_USER':
                return 'success';

            case 'ROLE_LECTURE':
                return 'info';

            case 'ROLE_MANAGER':
                return 'warning';

            case 'ROLE_ADMIN':
                return 'danger';
        }
    };
    const getNameRoleOfRole = (role) => {
        switch (role) {
            case 'ROLE_USER':
                return 'User';

            case 'ROLE_LECTURE':
                return 'Lecture';

            case 'ROLE_MANAGER':
                return 'Manager';

            case 'ROLE_ADMIN':
                return 'Admin';
        }
    };

    const roles = [
        { name: 'User', code: 'ROLE_USER' },
        { name: 'Lecture', code: 'ROLE_LECTURE' },
        { name: 'Manager', code: 'ROLE_MANAGER' },
        { name: 'Admin', code: 'ROLE_ADMIN' }
    ];
    const status = [
        { name: 'Chọn tình trạng', code: 'ALL' },
        { name: 'Bị khoá', code: 'DISABLE' },
        { name: 'Đang hoạt động', code: 'ENABLE' }
    ];

    const statusNotAll = [
        { name: 'Bị khoá', code: true },
        { name: 'Đang hoạt động', code: false }
    ];

    const header = (
        <div>
            <h5 className="mx-0 my-1 text-[24px] font-bold">Lịch sử thanh toán</h5>
            <div className="field flex justify-end">
                <div>
                    <label htmlFor="from" className="font-bold">
                        Lọc từ ngày: &nbsp;
                    </label>
                    <Calendar id="from" value={fromDate} onChange={(e) => { setFromDate(e.value); }} showTime dateFormat="dd/mm/yy" hourFormat="24" />
                    <label htmlFor="from" className="font-bold">
                        &nbsp; đến ngày: &nbsp;
                    </label>
                    <Calendar id="from" value={toDate} onChange={(e) => { setToDate(e.value); }} showTime dateFormat="dd/mm/yy" hourFormat="24" />
                </div>
            </div>
        </div>
    );
    const onRowEditComplete = async (e) => {
        let _data = [...invoiceList.data];
        let { newData, index } = e;
        _data[index] = newData;
        if (e.data.is_deleted !== e.newData.is_deleted) {
            const response = await apiUpdateStatus(e.newData.id, { lock: e.newData.is_deleted })
            if (response.status !== 1) {
                toast.error(response.message);
                loadLazyData();
            } else {
                toast.success("Cập nhật trạng thái thành công");
            }
        }
        if (e.data.roles !== e.newData.roles) {
            const params = new URLSearchParams();
            e.newData.roles.forEach((r) => {
                params.append('roles', r);
            })
            const response = await apiUpdateRoles(e.newData.id, params);
            if (response.status !== 1) {
                toast.error(response.message);
                loadLazyData();
            } else {
                toast.success("Cập nhật vai trò thành công");

            }
        }
        setInvoiceList((userList) => ({ ...userList, data: _data }))
    };
    const statusEditor = (options) => {
        return (
            <Dropdown
                className="w-full"
                value={getStatusByOptions(options)}
                options={statusNotAll}
                onChange={(e) => options.editorCallback(e.value.code)}
                placeholder="Chọn tình trạng"
                optionLabel="name"
                itemTemplate={(option) => {
                    return <Tag value={option.name} severity={!option.code ? 'success' : 'danger'} className='rounded'></Tag>;
                }}
            />
        );
    }

    const getStatusByOptions = (options) => {
        if (options.value != null) {
            return options.value ? { name: 'Bị khoá', code: true } : { name: 'Đang hoạt động', code: false }
        } else {
            return options.rowData.is_deleted ? { name: 'Bị khoá', code: true } : { name: 'Đang hoạt động', code: false }
        }
    }

    const rolesEditor = (options) => {
        return (
            <MultiSelect
                className="w-full"
                value={options?.value?.map(role => ({ name: getNameRoleOfRole(role), code: role }))}
                options={roles}
                onChange={(e) => { options.editorCallback(e.value.map(role => role.code)) }}
                optionLabel="name"
                placeholder="Chọn vai trò"
            />
        );
    }

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Tổng cộng:" colSpan={5} footerStyle={{ textAlign: 'right' }} />
                <Column footer={totalPrice?.toLocaleString() + " ₫"} />
            </Row>
        </ColumnGroup>
    );
    return (
        <div className="bg-[url('../assets/insbg.png')] bg-no-repeat">
            <div className="rounded-lg  p-6 pt-2 border-1 border-[#dfe7ef] ">
                {header}
                <DataTable
                    value={invoiceList.data}
                    lazy
                    dataKey="id"
                    scrollable
                    style={{ width: '100%' }}
                    paginator
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={invoiceList.total}
                    onPage={onPage}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate={invoiceList?.data ? 'Hiển thị {first} đến {last} của {totalRecords}' : 'Không có dữ liệu'}
                    rowsPerPageOptions={[10, 20, 50]}
                    onSort={onSort}
                    emptyMessage="Danh sách thanh toán rỗng"
                    sortField={lazyParams.sortField}
                    sortOrder={lazyParams.sortOrder}
                    onFilter={onFilter}
                    filters={lazyParams.filters}
                    tableStyle={{ minWidth: '75rem' }}
                    editMode="row"
                    onRowEditComplete={onRowEditComplete}
                    footerColumnGroup={footerGroup}
                >
                    <Column field="#" header="STT" body={loading ? <Skeleton /> : (data, options) => options.rowIndex + 1} headerStyle={{ width: '5%' }} ></Column>
                    <Column field="id" header="Mã" body={loading ? <Skeleton /> : null} headerStyle={{ width: '5%' }} ></Column>
                    <Column field="#" header="Thời gian" body={loading ? <Skeleton /> : (data, options) => formatTimeStampTo_DDMMYYY(data.createdAt, true)} headerStyle={{ width: '10%' }} ></Column>
                    <Column field="courseName" header="Khoá học" body={loading ? <Skeleton /> : null} headerStyle={{ width: '15%' }} ></Column>
                    <Column field="#" header="Người đăng ký" body={loading ? <Skeleton /> : registerBody} headerStyle={{ width: '10%' }} ></Column>
                    <Column field="#" header="Phí đăng ký" className="font-bold" body={loading ? <Skeleton /> : (data, options) => data.pricePurchase.toLocaleString() + " ₫"} headerStyle={{ width: '10%' }} ></Column>
                </DataTable>
            </div>
        </div>

    );
};

export default UserHistory;