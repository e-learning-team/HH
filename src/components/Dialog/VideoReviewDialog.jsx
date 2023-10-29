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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function VideoReviewDialog({ videoTitle, videoPath, open, setOpen }) {
    const handleClose = () => {
        setOpen(false);
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
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}>
                <DialogTitle className='min-w-[15rem] ' id='scroll-dialog-title ' >
                    {
                        <span className='flex items-center justify-between '>
                            
                            <div>
                                Giới thiệu về khóa học: 
                                <div className='font-bold text-2xl'>{videoTitle}</div>
                            </div>
                            <span onClick={handleClose} className='cursor-pointer'>
                                <FontAwesomeIcon className='p-1' icon={faXmark} />
                            </span>
                        </span>
                    }
                </DialogTitle>
                <DialogContent className=' border-b border-gray-400' dividers={scroll === 'paper'} >
                    <DialogContentText className='' tabIndex={-1} id="scroll-dialog-description">
                        <span className='relative h-0 pb-[56.25%] flex justify-center mb-6'>
                            <iframe
                                className='absolute top-0 left-0 w-full h-full'
                                src={videoPath}
                                width="640"
                                height="480"
                                allowFullScreen
                                allow="autoplay">
                            </iframe>
                            {/* <video width="560" height="560" controls>
                                <source src="https://drive.google.com/file/d/1giM4L6MBKP2709OaVT1umBK-oHKPUAaL/preview" type="video/mp4" />
                                oops
                            </video> */}
                        </span>
                        {/* {[...new Array(50)]
                            .map(
                                () => `Cras mattis consectetur purus sit amet fermentum.
                                Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                                Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                            )
                            .join('\n')} */}
                    </DialogContentText>
                </DialogContent>
                {/* <DialogActions>
                    
                </DialogActions> */}
            </Dialog>
        </div>
    );
}