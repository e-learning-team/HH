import React, { useRef, useEffect, useState, useCallback } from 'react';
import Input from "../../components/Input/Input";
import Button from '../../components/Button/Button';
import { NavLink } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo_side from '../../assets/logo-side.svg';
import { apiSendEmailVerification, apiResgister } from "../../apis/user";
import Path from '../../utils/path';
import { toast } from 'react-toastify';
import { login } from '../../store/User/userSlice';
const LectureRegister = () => {
    
    return (
        <></>
    );
};

export default LectureRegister

