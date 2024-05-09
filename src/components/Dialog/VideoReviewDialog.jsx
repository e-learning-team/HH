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
                        <span className='flex items-center justify-between '>
                            <span>
                                Giới thiệu về khóa học:
                                <span className='font-bold block text-2xl'>{videoTitle}</span>
                            </span>
                            <span onClick={handleClose} className='cursor-pointer'>
                                <FontAwesomeIcon className='p-1' icon={faXmark} />
                            </span>
                        </span>
                    }
                </DialogTitle>
                <DialogContent className=' border-b border-gray-400' dividers={scroll === 'paper'} >
                    <DialogContentText className='' tabIndex={-1} id="scroll-dialog-description">
                        <span className='relative h-0 pb-[56.25%] flex justify-center mb-6'>
                            {loadingVideo ? (
                                <span className='absolute flex justify-center items-center top-0 left-0 w-full h-full'>
                                    <Spinner className='w-20 h-auto' color="teal" />
                                </span>
                            ) : (<></>)}
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
                        </span>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}