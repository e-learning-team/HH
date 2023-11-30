import React, { Component } from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Editor from '@ckeditor/ckeditor5-build-classic/build/ckeditor'
// import Editor from './CustomCKEditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useDispatch, useSelector } from 'react-redux';
import './MyCKEditor.css';
import { toast } from 'react-toastify';
import { apiUploadFile } from '../../apis/fileRelationship';
export const MyCKEditor = ({handleData, data}) => {
    const { isLoggedIn, avatarURL, userData, token, isLoading, message } = useSelector((state) => state.user);
    const uploadAdapter = (loader) => {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        body.append("file", file);
                        const params = {
                            parent_id: userData.id,
                            parent_type: "USER_PROFILE_DESCRIPTION"
                        };
                        apiUploadFile(body, params)
                            .then((res => res.data?.path_file))
                            .then((res) => {
                                resolve({ default: res });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    });
                });
            }
        };
    };
    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        }
    }
    return (
        <div className='ckeditor-wrapper min-w-[735px] max-w-[735px]'>
            <CKEditor
                editor={Editor}
                config={{
                    extraPlugins: [uploadPlugin],
                }}
                data={data || "Thêm mô tả"}
                onReady={editor => {
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    handleData && handleData(data)
                    // console.log(data.toString());
                }}
                onBlur={(event, editor) => {
                }}
                onFocus={(event, editor) => {
                }}
            />
        </div>
    );
};