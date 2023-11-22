import { Typography } from '@material-tailwind/react';
import React from 'react';

export const CircularProgressBar = ({ progress }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = ((100 - progress) / 100) * circumference;

    return (
        <div className='h-full relative flex justify-center items-center'>
            <div className='absolute'>
                <Typography className='text-[11px] font-normal'>
                    {progress}%
                </Typography>
            </div>
            <svg className="h-full w-[40px]" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#b2bfd7"
                    strokeWidth="8" />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#ffe66d"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 50 50)"
                />
            </svg>
        </div>
    );
};

