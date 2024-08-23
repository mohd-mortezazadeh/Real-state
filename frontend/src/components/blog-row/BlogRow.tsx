import React, {FC, useEffect} from 'react'
import StarSvg from '../svg/star/StarSvg'
import CircleProfileSvg from '../svg/circle-profile/CircleProfileSvg'
import {textEllipsis} from "../../utils/textEllipsis";
import DeleteBlogModal from "../delete-blog-modal/DeleteBlogModal";
import AddBlogModal from "../add-blog/modal/AddBlogModal";
import {useRouter} from "next/router";
import Link from "next/link";

interface BlogRowProps{
    data:any,
    delBlogModal?:any,
    setDelBlogModal?:any,
    updateBlogModal?:any,
    setUpdateBlogModal?:any,
    setBlogId ?:any,
    handleDeleteBlog?:any,
    setBlogEditId?:any,
    editId ?:any,
    blogEditData?:any,
    setBlogEditData ?:any
}

const BlogRow:FC<BlogRowProps> = ({data,delBlogModal , setBlogEditData , editId , blogEditData , setBlogEditId,setDelBlogModal,updateBlogModal,setUpdateBlogModal , setBlogId , handleDeleteBlog}) => {

    const router = useRouter()

    useEffect(() => {
        delBlogModal? document?.querySelector('body')!.classList.add('overflow-hidden') : document?.querySelector('body')!.classList.remove('overflow-hidden')
    }, [delBlogModal])
  return (
      <>
          {
              delBlogModal &&
              <div
                  className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                  style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
              >
                  <DeleteBlogModal setDelBlogModal={setDelBlogModal} delBlogModal={delBlogModal} handleDeleteBlog={handleDeleteBlog}/>
              </div>
          }
          {
              updateBlogModal &&
              <div
                  className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                  style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
              >
                  <AddBlogModal setBlogEditData={setBlogEditData} blogEditData={blogEditData} isEdit={true} editId={editId} setOpenModal={setUpdateBlogModal}  />
              </div>
          }
          <Link href={`/single-blog/${data?.id}`}>
              <div className='bg-white py-4 md:px-7 px-4 first:mt-5 md:flex flex-row box-shadow-1 rounded-xl justify-start items-center hidden  gap-y-5 cursor-pointer'>
                  <div className='basis-1/12 text-text  text-lg font-bold truncate'>
                      <img src={data.media[0]?.file} className="rounded-xl h-16 w-16 object-cover border-[0.8px]" alt='تصویر بلاگ' />
                  </div>

                  <div className='basis-2/12 text-text text-lg font-bold  truncate pl-20'>{data?.title}</div>
                  <div className='basis-2/12 text-text  text-lg font-bold truncate'>

                      {/* {#0AC63F} add to tailwind config */}

                      <div className={`flex flex-row justify-center gap-x-1 items-center ${data?.rating_article?.rating_avg === 5 ? 'bg-[#0AC63F]/10' : data?.rating_article?.rating_avg === 4 ? 'bg-primary/10' : data?.rating_article?.rating_avg === 3 ? ' bg-custom-gold/20' : data?.rating_article?.rating_avg === 2 ? ' bg-[#FF800A]/20' : 'bg-custom-red/20' } w-11 h-10 rounded-xl`}>
                          <StarSvg color={`${data?.rating_article?.rating_avg === 5 ? '#0AC63F' : data?.rating_article?.rating_avg === 4 ? '#005adc' : data?.rating_article?.rating_avg === 3 ? '#FFD61D' : data?.rating_article?.rating_avg === 2 ? '#FF800A ' : '#FA3737' }`}  />
                          <span className={`text-lg font-bold ${data?.rating_article?.rating_avg === 5 ? 'text-[#0AC63F]' : data?.rating_article?.rating_avg ===4 ? 'text-primary' : data?.rating_article?.rating_avg === 3 ? 'text-custom-gold' : data?.rating_article?.rating_avg === 2 ? '  text-[#FF800A]' : 'text-custom-red' }`}>{data?.rating_article?.rating_avg ?? 0}</span>
                      </div>
                  </div>
                  <div className='basis-2/12 text-text   truncate pl-24'>{textEllipsis(data?.content , 10)}</div>
                  <div className='basis-2/12 text-text   truncate pl-24'>
                      <div className='flex flex-row  justify-start items-center gap-x-1'>
                          <CircleProfileSvg />
                          <span className='text-primary font-semibold'>نویسنده {data?.writer}</span>
                      </div>
                  </div>
                  <div className='basis-2/12 text-text   truncate'>{new Date(+data?.created_at).toLocaleDateString('fa')}</div>
                  <div className='basis-1/12 flex items-center gap-x-2'>
                      <button onClick={(e)=>{
                          e.preventDefault()
                          setBlogId(data?.id)
                          setDelBlogModal(true)
                      }}>حذف</button>
                      <button onClick={(e)=>{
                          e.preventDefault()
                          setUpdateBlogModal(true)
                          setBlogEditId(data?.id)
                      }}>ویرایش</button>
                  </div>
              </div>

          </Link>
      </>
  )
}

export default BlogRow
