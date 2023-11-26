import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor,  } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';
import './MyCKEditor.css';
export const MyCKEditor = () => {
    
    return (
        <div className='ckeditor-wrapper max-w-[635px]'>
            <CKEditor
                editor={ClassicEditor}
                data=""
                onReady={editor => {
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                }}
                onBlur={(event, editor) => {
                }}
                onFocus={(event, editor) => {
                }}
            />
        </div>
    );
};