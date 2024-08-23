import LeftFullArrow from "../svg/arrows/left-full-arrow/LeftFullArrow";
import CircleProfileSvg from "../svg/circle-profile/CircleProfileSvg";
import StarSvg from "../svg/star/StarSvg";
import DateSvg from "../svg/date/DateSvg";
import { textEllipsis } from "../../utils/textEllipsis";
import Link from "next/link";
import React,{ FC } from "react";
import DeleteBlogModal from "../delete-blog-modal/DeleteBlogModal";
import AddBlogModal from "../add-blog/modal/AddBlogModal";
import TrashSquareSvg from "../svg/trash-square/TrashSquareSvg";
import EditSvg from "../svg/edit/editSvg";


interface BlogCardProps {
    data?: any,
    ref?: any,
    delBlogModal?: any,
    setDelBlogModal?: any,
    updateBlogModal?: any,
    setUpdateBlogModal?: any,
    handleDeleteBlog?: any,
    editable?: boolean,
    setBlogId?: any,
    setBlogEditId?: any,
    setBlogEditData?: any,
    blogEditData?: any,
    editId?: any
}

// eslint-disable-next-line react/display-name
const BlogCard: FC<BlogCardProps> = React.forwardRef(({
    data,
    delBlogModal,
    editable = false,
    setDelBlogModal,
    updateBlogModal,
    setUpdateBlogModal,
    handleDeleteBlog,
    setBlogId,
    editId,
    setBlogEditId,
    setBlogEditData,
    blogEditData
},ref: any) => {


    const blogBody = (
        <>
            {
                delBlogModal &&
                <div
                    className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                    <DeleteBlogModal setDelBlogModal={setDelBlogModal} delBlogModal={delBlogModal}
                        handleDeleteBlog={handleDeleteBlog} />
                </div>
            }
            {
                updateBlogModal &&
                <div
                    className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                    <AddBlogModal setBlogEditData={setBlogEditData} blogEditData={blogEditData} isEdit={true}
                        editId={editId} setOpenModal={setUpdateBlogModal} />
                </div>
            }
            {data &&
                <Link href={`/single-blog/${data?.id}`}
                    className='box-shadow-1 flex flex-col gap-y-0 rounded-xl overflow-hidden'>
                    {/*  card image  */}
                    <div className='p-2'>
                        <div className='relative overflow-hidden rounded-xl h-[140px]'>
                            <img className='h-full w-full object-cover' src={data?.media[0]?.file} alt={data?.title && data.title} />
                            {
                                editable &&
                                <div
                                    className={`flex flex-row justify-center items-center gap-x-3 absolute bottom-2 left-2`}>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        setBlogId(data?.id)
                                        setDelBlogModal(true)
                                    }
                                    }>
                                        <TrashSquareSvg />
                                    </button>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        setUpdateBlogModal(true)
                                        setBlogEditId(data?.id)
                                    }}>
                                        <EditSvg color={"#005adc"} width={22} height={22} />
                                    </button>
                                </div>
                            }
                            <div className='absolute top-2 left-2 flex items-center gap-x-2'>
                                {/*star*/}
                                {data?.rating_article?.rating_avg && <div
                                    className='flex  items-center gap-x-2 bg-custom-gold rounded-lg p-2 text-white'>

                                    <StarSvg />
                                    <span className='text-sm'>{data?.rating_article?.rating_avg}</span>

                                </div>}
                                {/*date*/}
                                <div className='flex items-center gap-x-2 bg-primary rounded-lg p-2 text-white'>
                                    <DateSvg color='#fff' />
                                    <span className='text-sm'>
                                        {new Date(+data?.created_at).toLocaleDateString('fa')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*card info*/}
                    <div className='px-5 flex flex-col gap-y-4'>
                        <h3 className='text-xl font-semibold'>
                            {data?.title}
                        </h3>
                        <p className='leading-8'>
                            {textEllipsis(data?.content,30)}
                        </p>
                    </div>

                    {/*  card footer  */}

                    <div className='bg-primary-100/30 flex justify-between text-primary p-4 mt-6'>
                        <div className='flex items-center gap-x-2'>
                            <span>
                                <CircleProfileSvg />
                            </span>
                            <span className='text-sm'>نویسنده {data?.writer}</span>
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <span>بیشتر</span>
                            <span>
                                <LeftFullArrow />
                            </span>
                        </div>
                    </div>

                </Link>}
        </>
    )


    const content = ref
        ? <article ref={ref}>{blogBody}</article>
        :
        <article>{blogBody}</article>

    return content
}
)

export default BlogCard;