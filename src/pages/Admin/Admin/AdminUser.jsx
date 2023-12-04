import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
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
const AdminUser = () => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [keyWord, setKeyWord] = useState("");
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
    const getUsers = async (params) => {
        try {
            // const paramsAPI = getParams(pageIndex);
            const selectedRoles = params?.roles?.map(r => r?.code);

            const paramsAPI = new URLSearchParams();
            paramsAPI.set('status', params.status ? params.status.code : 'ALL');
            paramsAPI.set('max_result', params.rows != null ? params.rows : '10');
            paramsAPI.set('current_page', params.page != null ? params.page + 1 : '1');

            paramsAPI.set('key_word', keyWord || '');
            if (selectedRoles) {
                paramsAPI.set('roles', selectedRoles);
            }
            const response = await apiUserList(paramsAPI);
            if (response?.data?.data?.length > 0) {
                setUserList(response.data);
            }
            else {
                if (response?.data?.total > 0) {
                    setLazyParams((lazyParams) => ({ ...lazyParams, page: 0, }));
                } else {
                    setUserList([]);
                }
            }
            setLoading(false);
        } catch (error) {
            setUserList([]);
        } finally {
            setLoading(false);
        }
    };



    let loadLazyTimeout = null;

    useEffect(() => {
        loadLazyData();
    }, [lazyParams])

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
    const nameBody = (rowData) => {
        return (
            <React.Fragment>
                <Avatar
                    className="w-[32px] h-[32px] rounded-full align-middle mr-2"
                    src={rowData.avatar != null ? rowData.avatar : defaultAvatar}
                />
                <span className="image-text">{rowData.full_name}</span>
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
            <h5 className="mx-0 my-1 text-[24px] font-bold">Quản lý người dùng</h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 items-end">
                <div className="p-4 w-100">
                    <div className="p-inputgroup flex-1">
                        <InputText
                            id="search"
                            onChange={(e) => setKeyWord(e.target.value)}
                            placeholder="Tìm kiếm người dùng"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    loadLazyData();
                                }
                            }}
                        />
                        <Button icon="pi pi-search" className="p-button-info" onClick={loadLazyData} />
                    </div>
                </div>
                <div className="p-4 w-100">
                    <label htmlFor="roles" className="font-bold text-sm">Vai trò:</label>
                    <MultiSelect id="roles" className="w-full" value={lazyParams.roles} options={roles} onChange={(e) => setLazyParams((lazyParams) => ({ ...lazyParams, roles: e.value, }))} optionLabel="name" placeholder="Chọn vai trò" display="chip" />
                </div>
                <div className="p-4 w-100">
                    <label htmlFor="status" className="font-bold text-sm">Tình trạng:</label>
                    <Dropdown id="status" className="w-full" value={lazyParams.status} options={status} onChange={(e) => setLazyParams((lazyParams) => ({ ...lazyParams, status: e.value, }))} optionLabel="name" placeholder="Chọn tình trạng" />
                </div>
            </div>
        </div>
    );
    const onRowEditComplete = async(e) => {
        let _data = [...userList.data];
        let { newData, index } = e;
        _data[index] = newData;
        if(e.data.is_deleted !== e.newData.is_deleted) {
            const response = await apiUpdateStatus(e.newData.id, {lock:e.newData.is_deleted})
            if(response.status !== 1) {
                toast.error(response.message);
                loadLazyData();
            } else {
                toast.success("Cập nhật trạng thái thành công");
            }
        }
        if(e.data.roles !== e.newData.roles) {
            const params = new URLSearchParams();
            e.newData.roles.forEach((r) => {
                params.append('roles', r);
            })
            const response = await apiUpdateRoles(e.newData.id, params);
            if(response.status !== 1) {
                toast.error(response.message);
                loadLazyData();
            } else {
                toast.success("Cập nhật vai trò thành công");
                
            }
        }
        setUserList((userList) =>({...userList, data: _data}))
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
        if (options.value!=null) {
            return options.value ? { name: 'Bị khoá', code: true } : { name: 'Đang hoạt động', code: false }
        } else {
            return options.rowData.is_deleted ? { name: 'Bị khoá', code: true } : { name: 'Đang hoạt động', code: false }
        }
    }

    const rolesEditor = (options) => {
        return (
            <MultiSelect 
            className="w-full"
            value={options?.value?.map(role => ({name: getNameRoleOfRole(role), code: role}))}
            options={roles}
            onChange={(e) => {options.editorCallback(e.value.map(role => role.code))}}
            optionLabel="name" 
            placeholder="Chọn vai trò"
            />
        );
    }
    return (
        <>
            <div className="rounded-lg bg-white p-6 pt-2 border-1 border-[#dfe7ef]">
                {header}
                <DataTable
                    value={userList.data}
                    lazy
                    dataKey="id"
                    scrollable
                    style={{ width: '100%' }}
                    paginator
                    first={lazyParams.first}
                    rows={lazyParams.rows}
                    totalRecords={userList.total}
                    onPage={onPage}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords}"
                    rowsPerPageOptions={[10, 20, 50]}
                    onSort={onSort}
                    emptyMessage="Danh sách người dùng rỗng"
                    sortField={lazyParams.sortField}
                    sortOrder={lazyParams.sortOrder}
                    onFilter={onFilter}
                    filters={lazyParams.filters}
                    tableStyle={{ minWidth: '75rem' }}
                    editMode="row"
                    onRowEditComplete={onRowEditComplete}
                >
                    <Column field="#" header="STT" body={loading ? <Skeleton /> : (data, options) => options.rowIndex + 1} headerStyle={{ width: '5%' }} ></Column>
                    <Column field="#" header="Tên" body={loading ? <Skeleton /> : nameBody} headerStyle={{ width: '25%' }} />
                    <Column field="email" header="Email" body={loading ? <Skeleton /> : null} headerStyle={{ width: '25%' }} />
                    <Column field="roles" header="Vai trò" body={loading ? <Skeleton /> : roleBody} headerStyle={{ width: '20%' }} editor={(options) => rolesEditor(options)}/>
                    <Column field="is_deleted" header="Trạng thái" body={loading ? <Skeleton /> : statusBody} headerStyle={{ width: '15%' }} editor={(options) => statusEditor(options)} />
                    <Column field="#" header="Thao tác" rowEditor style={{ minWidth: '10%' }} />
                </DataTable>
            </div>
        </>

    );
}

export default AdminUser