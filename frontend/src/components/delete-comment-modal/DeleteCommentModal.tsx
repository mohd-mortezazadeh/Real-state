import React, {FC} from "react";

interface DeleteCommentModalProps {
    setDelCommentModal?: any,
    delCommentModal?: any,
    handleDeleteComment?:any
    // advisorId: number | null,
    // setRefresh: any
}

const DeleteCommentModal:FC<DeleteCommentModalProps> = ({delCommentModal,setDelCommentModal,handleDeleteComment}) => {

    return (
        <div
            className='bg-white p-5 h-[200px] z-50 xl:w-1/5 lg:w-2/5 md:w-3/5 w-full box-shadow-1 sm:rounded-lg overflow-y-auto transition-all duration-300'>
            <div className={`flex flex-col items-center justify-between gap-y-10 h-full`}>
                <div className={`text-lg font-semibold mt-5`}>
                    آیا از حذف کامنت اطمینان دارید ؟
                </div>
                <div className={`flex flex-row justify-center items-center gap-x-5 w-full`}>

                    <button className={`flex px-8 py-2  rounded-md bg-custom-red text-white`}
                            onClick={handleDeleteComment}
                    >تایید
                    </button>
                    <button className={`flex px-8 py-2  rounded-md bg-custom-gray-200/10 text-custom-gray-200`}
                            onClick={() => setDelCommentModal(false)}
                    >بازگشت
                    </button>

                </div>
            </div>
        </div>
    )
}

export default DeleteCommentModal