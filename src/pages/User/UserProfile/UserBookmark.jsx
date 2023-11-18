import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserBookmark = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        document.title = "Khóa học đã lưu"
    }, []);
    return (
        <div>
            <h1 className="font-bold text-2xl uppercase">Khóa học đã lưu</h1>
        </div>
    );
};

export default UserBookmark;