import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { faMagnifyingGlass, faL } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataTable } from 'primereact/datatable';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { apiCategory, apiCreateCategory, apiDeleteCategory, apiUpdateCategoryName } from '../../../apis/category';
import { Skeleton } from 'primereact/skeleton';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import { TreeTable } from 'primereact/treetable';
import { Dropdown } from 'primereact/dropdown';
const AdminCategory = () => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useOutletContext();
    const navigate = useNavigate();
    const [categoryList, setCategoryList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [keyWord, setKeyWord] = useState("");
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({
        status: null,
    });
    const [category, setCategory] = useState(null);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const getCategories = async (params) => {
        try {
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('build_type', 'TREE');
            paramsAPI.set('is_deleted', params.status != null ? params.status : '');
            // paramsAPI.set('key_word', keyWord || '');
            const response = await apiCategory(paramsAPI);
            if (response?.data?.length > 0) {
                setCategoryList(response.data);
                buildData(response.data);
            }
            else {
                setCategoryList([]);
            }
            setLoading(false);
        } catch (error) {
            console.log(error)
            toast.error("Xảy ra lỗi khi lấy thông tin danh mục")
            setCategoryList([]);
        } finally {
            setLoading(false);
        }
    }

    const addDashesToTitles = (categories) => {

        return categories.filter((category) => category.level < 3)
            .map((category) => {
                const modifiedTitle = `${category.level != 1 ? '---' : ''} ${category.title}`;
                return {
                    ...category, title: modifiedTitle,
                };

            });
    };

    const buildCategories = async () => {
        try {
            const paramsAPI = new URLSearchParams();
            paramsAPI.set('build_type', 'LIST');
            paramsAPI.set('is_deleted', false);
            const response = await apiCategory(paramsAPI);
            if (response?.data?.length > 0) {
                const data = addDashesToTitles(response.data);
                setCategories(data);
            }
            else {
                setCategories([]);
            }
        } catch (error) {
            toast.error("Xảy ra lỗi khi lấy thông tin danh mục")
            setCategories([]);
        }
    }

    const deleteCategory = async (id) => {
        try {
            const response = await apiDeleteCategory(id);
            if (response?.status === 1) {
                loadData();
                buildCategories();
                toast.success("Xóa danh mục thành công");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Xóa danh mục không thành công");
        }
    }

    const createCategory = async (category) => {
        try {
            const response = await apiCreateCategory(category);
            if (response?.data) {
                loadData();
                buildCategories();
                toast.success("Thêm danh mục thành công");
            } else {
                toast.error("Thêm danh mục không thành công")
                setCategory(null);
            }

        } catch (error) {
            toast.error("Thêm danh mục không thành công")
            setCategory(null);
        }
    }

    useEffect(() => {
        loadData();
        buildCategories();
    }, [params])

    let loadTimeout = null;
    const loadData = async () => {
        setLoading(true);
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }

        //imitate delay of a backend call
        loadTimeout = setTimeout(() => {
            getCategories(params);
            buildData();
            setLoading(false);
        }, Math.random() * 1000 + 250);

    }

    const buildData = (data) => {
        const nodes = [];

        function convertNode(nodeData) {
            const node = {
                key: nodeData.id,
                data: nodeData,
                children: [],
            };

            if (nodeData.children && nodeData.children.length > 0) {
                nodeData.children.forEach(child => {
                    node.children.push(convertNode(child));
                });
            }

            return node;
        }
        if (data) {
            data.forEach(item => {
                nodes.push(convertNode(item));
            });
        }
        setNodes(nodes);
    }

    let emptyCategory = {
        title: '',
        parent: null
    };

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    }

    const saveCategory = () => {
        setSubmitted(true);
        const cate = {
            title: category.title,
            parent_id: category.parent?.id
        }
        createCategory(cate);
        hideDialog();
    }

    const actionBody = (rowData) => {
        return (<Button icon="pi pi-trash" className="h-12 w-12" rounded outlined severity="danger" onClick={() => deleteCategory(rowData.data.id)}/>);
    }

    const header = (
        <div>
            <h5 className="mx-0 my-1 text-[24px] font-bold">Quản lý danh mục</h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-6">
                <div className="lg:col-span-2 p-4 w-100">
                    <div className="grid-cols-1 p-inputgroup flex-1">
                        <InputText
                            id="search"
                            onChange={(e) => setKeyWord(e.target.value)}
                            placeholder="Tìm kiếm danh mục"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    loadData();
                                }
                            }}
                        />
                        <Button icon="pi pi-search" className="p-button-info" onClick={loadData} />
                    </div>
                </div>
                <div className="lg:col-span-4 p-4">
                    <Button className="lg:float-right w-fit" label="Thêm danh mục" icon="pi pi-plus" severity="success" onClick={openNew} />
                </div>
            </div>
        </div>
    );

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Huỷ" icon="pi pi-times" className="p-button-text" severity="danger" onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" className="p-button-text" severity="info" onClick={saveCategory} />
        </React.Fragment>
    );

    const textEditor = (options) => {
        return <InputText type="text" className="w-full" value={options.rowData[options.field]} onChange={(e) => onEditorValueChange(options, e.target.value)} onBlur={(e) => onEditorUpdate(options, e.target.value)}/>;
    };

    const onEditorValueChange = (options, value) => {
        let newNodes = JSON.parse(JSON.stringify(nodes));
        let editedNode = findNodeByKey(newNodes, options.node.key);
        editedNode.data[options.field] = value;
        setNodes(newNodes);
    };

    const onEditorUpdate = async(options, value) => {
        console.log(options, "---", value)
        //call api apiUpdateCategoryName
        const respone = await apiUpdateCategoryName(options.node.key, value);
        if (respone?.status === 1) {
            toast.success("Cập nhật tên danh mục thành công");
            loadData();
            buildCategories();
        } else {
            toast.error("Cập nhật tên danh mục không thành công");
        }

    };

    const findNodeByKey = (nodes, key) => {
        for (let node of nodes) {
            if (node.key === key) {
                return node;
            }
            else {
                let foundNode = findNodeByKey(node.children, key);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        console.log(rowData)
    };

    return (
        <div className="rounded-lg bg-white p-6 pt-2 border-1 border-[#dfe7ef]">
            {header}
            <TreeTable value={nodes}
                emptyMessage="Danh sách danh mục rỗng"
                className="mt-4"
                paginator rows={10} rowsPerPageOptions={[10, 20, 60]} 
                tableStyle={{ minWidth: '50rem' }}
                globalFilter={keyWord}
                editMode="cell"
            >
                <Column
                    field="id"
                    header="Mã"
                    body={loading ? <Skeleton /> : null}
                    expander={!loading && <i className="pi pi-fw pi-chevron-right" />}
                    headerStyle={{ width: '10%' }}
                ></Column>
                <Column
                    field="title"
                    header="Tên"
                    body={loading ? <Skeleton /> : null}
                    headerStyle={{ width: '25%' }}
                    editor={textEditor}
                    onCellEditComplete={onCellEditComplete}
                ></Column>
                <Column
                    field="#"
                    header="Thao tác"
                    body={loading ? <Skeleton /> : actionBody}
                    style={{ width: '5%' }}
                ></Column>
            </TreeTable>

            <Dialog visible={categoryDialog} style={{ width: '450px' }} header="Thêm danh mục" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Tên:
                    </label>
                    <InputText id="name" value={category?.title} onChange={(e) => setCategory((category) => ({ ...category, title: e.target.value, }))} required autoFocus className={classNames({ 'p-invalid': submitted && !category?.title })} />
                </div>
                <div className="field">
                    <label htmlFor="parent" className="font-bold">
                        Danh mục cha:
                    </label>
                    <Dropdown id="parent" className="w-full" value={category?.parent} options={categories} onChange={(e) => setCategory((category) => ({ ...category, parent: e.value, }))} optionLabel="title" placeholder="Danh mục cha" />
                </div>
                {submitted && !category?.title && <small className="p-error">Không được bỏ trống tên danh mục.</small>}
            </Dialog>
        </div>

    )

}

export default AdminCategory;