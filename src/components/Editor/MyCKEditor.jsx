import React, { Component } from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import './MyCKEditor.css';
export const MyCKEditor = () => {

    return (
        <div className='ckeditor-wrapper max-w-[735px]'>
            <CKEditor
                editor={Editor}
                data=""
                onReady={editor => {
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log(data)
                }}
                onBlur={(event, editor) => {
                }}
                onFocus={(event, editor) => {
                }}
            />
        </div>
    );
};