import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Spinner } from '@material-tailwind/react';

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

export function VideoReviewDialog({ videoTitle, videoPath, open, setOpen }) {
    const [loadingVideo, setLoadingVideo] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };
    const handleLoadingVideo = () => {
        setLoadingVideo(false);
    };
    const scroll = 'paper';
    return (
        <div>
            <Dialog
                className=''
                open={open}
                scroll={scroll}
                maxWidth={'sm'}
                fullWidth={true}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                // TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}>
                <DialogTitle className='min-w-[15rem] ' id='scroll-dialog-title ' >
                    {
                        <div className='flex items-center justify-between '>
                            <div>
                                Giới thiệu về khóa học:
                                <div className='font-bold text-2xl'>{videoTitle}</div>
                            </div>
                            <div onClick={handleClose} className='cursor-pointer'>
                                <FontAwesomeIcon className='p-1' icon={faXmark} />
                            </div>
                        </div>
                    }
                </DialogTitle>
                <DialogContent className=' border-b border-gray-400' dividers={scroll === 'paper'} >
                    <DialogContentText className='' tabIndex={-1} id="scroll-dialog-description">
                        <div className='relative h-0 pb-[56.25%] flex justify-center mb-6'>
                            {loadingVideo && (
                                <div className='absolute flex justify-center items-center top-0 left-0 w-full h-full'>
                                    <Spinner className='w-20 h-auto' color="teal" />
                                </div>
                            )}
                            <iframe
                                className='absolute top-0 left-0 w-full h-full'
                                src={videoPath}
                                width="640"
                                height="480"
                                allowFullScreen
                                onLoad={handleLoadingVideo}
                                allow="autoplay"
                                autoPlay>
                            </iframe>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}