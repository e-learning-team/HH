import * as React from 'react';
//css
import '../../styles/spinner.css';
import image from '../../assets/logo-2.svg';
export default function SpinnerCustom() {
    React.useEffect(() => {
        // Thay đổi overflow của body khi component được mount
        document.body.style.overflow = 'hidden';
        // Thiết lập lại overflow của body khi component được unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    return (
        <div wire:loading className="fixed bottom-0 left-0 right-0 top-[80px] z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-300 opacity-75">
            <div className="relative top-[-80px] flex items-center justify-center">
                <div className="absolute h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-[#4cbdff]"></div>
                <img src={image} className="h-28 w-28 rounded-full" />
            </div>
        </div>
    );
}