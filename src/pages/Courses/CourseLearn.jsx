import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams, NavLink } from "react-router-dom";
import CourseAccordion from '../../components/Accordion/AccordionCourseDetail';
import { Breadcrumbs } from "@material-tailwind/react";
import { RatingBar } from '../../components/RatingBar/RatingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from "@material-tailwind/react";
import {
    faCirclePlay,
    faPenToSquare,
    faPersonChalkboard,
    faInfinity
} from '@fortawesome/free-solid-svg-icons';
import {
    faBookmark,
    faFileAudio,

} from '@fortawesome/free-regular-svg-icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '../../components/Button/Button';
import { VideoReviewDialog } from '../../components/Dialog/VideoReviewDialog';
import { getVideoGoogleGDriveUrl, getVideoThumbnailGoogleGDriveUrl } from '../../utils/Constants';
import { extractVideoGoogleGDriveUrlId, formatTimeStampTo_DDMMYYY } from '../../utils/helper';
import { apiGetCourse } from '../../apis/course';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { apiCheckEnrollment } from '../../apis/enrollment';

const CourseLearn = () => {
    const { isLoggedIn, userData, token, isLoading, message } = useSelector((state) => state.user);
    const { slug } = useParams();
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            Learning...
        </>
    );
};

export default CourseLearn;