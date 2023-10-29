import Path from '../../utils/path';
import { NavLink } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";

const Card = () => {
    const navigate = useNavigate();


    return (
        <div className="grid justify-center">
            <div className="sm:w-[245px] sm:h-[290] m-5 shadow rounded border-gray-200 bg-white cursor-pointer hover:-translate-y-0.5 hover:shadow-lg group/item" onClick={actionOnclick}>
                <div id="image">
                    <img
                        alt="Home"
                        src="https://img-c.udemycdn.com/course/240x135/5246952_37c4.jpg"
                        className="rounded-t transition group-hover/item:opacity-90 h-[140px] w-full"/>
                </div>
                <div id="card-content">
                    <div className="mx-1 mt-1.5">
                        <h3 className="font-bold line-clamp-2 group-hover/item:underline">
                            Javascript cho người mới bắt đầu Javascript cho người mới bắt đầu Javascript cho người mới bắt đầu
                        </h3>
                    </div>
                    <div className="mx-1 mt-2 mb-1">
                        <div className="text-sm line-clamp-1">Linh Nguyen</div>
                    </div>
                    <div className="flex items-center mx-1">
                        <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">4.95</p>
                        <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                        <span className="text-sm font-medium text-gray-900 underline dark:text-white">73 người học</span>
                    </div>
                    <div className="flex items-center mx-3 my-2">
                        <span className="text-lg font-semibold">₫ 279.000</span>
                        <span className="text-sm font-light line-through ml-3">₫ 279.000</span>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Card