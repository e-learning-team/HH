import clsx from 'clsx'
const ContentAlert = ({ content, style}) => {
    return (
        <div role="alert" className={clsx('rounded border-s-4 border-red-500 bg-red-50 p-4', style)}>
            <strong className="block font-medium text-red-800"> {content} </strong>
            {/* <p className="mt-2 text-sm text-red-700">
                {content}
            </p> */}
        </div>
    )
}

export default ContentAlert