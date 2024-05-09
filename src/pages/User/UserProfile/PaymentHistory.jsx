import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserHistory = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        document.title = "Lịch sử thanh toán"
    }, []);
    return (
        <div>
            <h1 className="font-bold text-2xl uppercase">Lịch sử thanh toán</h1>
        </div>
    );
};

export default UserHistory;