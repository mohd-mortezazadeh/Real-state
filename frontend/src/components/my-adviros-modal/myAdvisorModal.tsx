import React, {FC} from 'react';
import CloseIcon from "../svg/close/closeSvg";
import AddBlogUploadPodcast from "../add-blog/components/upload-podcast/AddBlogUploadPodcast";
import AddBlogUploadImage from "../add-blog/components/upload-image/AddBlogUploadImage";
import AddBlogFormInfo from "../../forms/add-blog/AddBlogFormInfo";
import {checkAdvisor} from "../../services/api/advisor";

interface MyAdvisorModalProps {
    setOpenModal?: any,
    openModal: {
        value: number | boolean,
        type: number | boolean
    },
    advisorId: number | null,
    setRefresh: any
}

const MyAdvisorModal: FC<MyAdvisorModalProps> = ({
                                                     setOpenModal = {value: false, type: ''},
                                                     openModal,
                                                     advisorId,
                                                     setRefresh
                                                 }) => {


    const handleActiveAdvisor = () => {
        checkAdvisor(advisorId, {
            is_advisor: true
        }).then(() => {
                setRefresh((prev: any) => !prev)
            })

        setOpenModal({
            value: false,
            type: ''
        })

    }

    const handleRejectAdvisor = async () => {
        await checkAdvisor(advisorId, {
            is_advisor: false
        }).then(() => {
            setRefresh((prev: any) => !prev)
        })
        setOpenModal({
            value: false,
            type: ''
        })
    }

    return (
        <div
            className='bg-white p-5 h-[200px] z-50 xl:w-1/5 lg:w-2/5 md:w-3/5 w-full box-shadow-1 sm:rounded-lg overflow-y-auto transition-all duration-300'>
            <div className={`flex flex-col items-center justify-between gap-y-10 h-full`}>
                <div className={`text-lg font-semibold mt-5`}>
                    {
                        openModal.type ?
                            'آیا از تایید مشاور اطمینان دارید ؟'
                            :
                            'آیا از حذف مشاور اطمینان دارید ؟'
                    }
                </div>
                <div className={`flex flex-row justify-center items-center gap-x-5 w-full`}>
                    <button className={`flex px-8 py-2  rounded-md bg-custom-gray-200/10 text-custom-gray-200`}
                            onClick={() => setOpenModal({value: false, type: ''})}
                    >بازگشت
                    </button>
                    {
                        openModal.type ?
                            <button
                                onClick={handleActiveAdvisor}
                                className={`flex px-4 py-2  rounded-md bg-custom-green text-white`}>تایید
                                مشاور</button> :
                            <button
                                onClick={handleRejectAdvisor}
                                className={`flex px-4 py-2  rounded-md bg-custom-red text-white`}>رد مشاور</button>
                    }


                </div>
            </div>
        </div>
    );
};

export default MyAdvisorModal;