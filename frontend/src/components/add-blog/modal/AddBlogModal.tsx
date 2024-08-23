import React, {FC, useState} from 'react'
import AddBlogFormInfo from '../../../forms/add-blog/AddBlogFormInfo'
import AddBlogUploadImage from '../components/upload-image/AddBlogUploadImage'
import CloseIcon from '../../svg/close/closeSvg'
import AddBlogUploadPodcast from '../components/upload-podcast/AddBlogUploadPodcast'
import {useAppSelector} from "../../../hooks/useRedux";
import {get_media} from "../../../redux/slices/blogSlice";


const AddBlogModal: FC<any> = ({setOpenModal , isEdit = false , editId , blogEditData , setBlogEditData}) => {
    const [pages, setPages] = useState(1)

    const mediaState = useAppSelector(get_media)


    return (
        <div
            className='bg-white p-5 h-[680px] z-50 lg:w-2/5 md:w-3/5 w-full box-shadow-1 sm:rounded-lg overflow-y-auto transition-all duration-300'>
            <div className='flex flex-row justify-between items-center  w-full'>
                <div className='text-xl font-semibold'>ثبت بلاگ</div>
                <div className='p-2 border-[2px] border-custom-gray-200 rounded-lg cursor-pointer'
                     onClick={(e) => {
                         setOpenModal(false)
                         // setBlogEditData([])
                     }}
                >
                    <CloseIcon color={"#737373"} width={12} height={12}/>
                </div>
            </div>
            <div className='flex flex-row justify-start items-center gap-x-10 relative w-full mt-6 mb-8'>
                <div
                    className={`cursor-pointer flex flex-row justify-start items-center gap-x-3 text-primary relative ${pages === 1 && 'before:absolute before:-bottom-3 before:h-1  before:bg-primary before:w-full'} `}
                    onClick={(e) => setPages(1)}
                >
                    <span
                        className={`text-lg ${pages === 1 ? 'text-primary font-bold' : 'text-custom-gray-200/30'} `}>بلاگ</span>
                </div>
                <div
                    className={`cursor-pointer flex flex-row justify-start items-center gap-x-3  relative ${pages === 2 && 'before:absolute before:-bottom-3 before:h-1  before:bg-primary before:w-full'}`}
                    onClick={(e) => setPages(2)}
                >
                    <span
                        className={`text-lg ${pages === 2 ? 'text-primary font-bold' : 'text-custom-gray-200/30'}`}>پادکست</span>
                </div>
                <div className='h-1 bg-custom-gray-200/10 absolute  w-full -bottom-3 rounded-lg'></div>
            </div>
            <div className='flex flex-col items-center justify-center w-full my-6'>
                {pages === 2 && <AddBlogUploadPodcast  isEdit={isEdit} blogEditData={blogEditData}/>}
                <AddBlogUploadImage setOpenModal={setOpenModal} setBlogEditData={setBlogEditData} isEdit={isEdit} blogEditData={blogEditData}/>
                <AddBlogFormInfo setBlogEditData={setBlogEditData} blogEditData={blogEditData} blogEditId={editId} isEdit={isEdit}  media={mediaState} setOpenModal={setOpenModal}/>
            </div>
        </div>
    )
}

export default AddBlogModal
