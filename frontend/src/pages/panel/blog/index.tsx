import {GetServerSideProps, NextPage} from 'next'
import React, {useState, FC, useEffect, useMemo} from 'react'
import BlogCard from '../../../components/blog-card/blogCard'
import BlogRow from '../../../components/blog-row/BlogRow'
import CustomSelect from '../../../components/select/CustomSelect'
import DocumentSvg from '../../../components/svg/document/DocumentSvg'
import HeadPhonesSvg from '../../../components/svg/headphones/HeadPhonesSvg'
import PlusSvg from '../../../components/svg/plus/PlusSvg'
import SearchIcon from '../../../components/svg/search/searchSvg'
import MainLayout from '../../../layouts/mainLayout'
import AddBlogModal from '../../../components/add-blog/modal/AddBlogModal'
import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/router";
import {useAuth} from "../../../hooks/useAuth";
import queryString from "querystring";
import ReactPaginate from "react-paginate";
import Head from "next/head";
import EmptyData from "../../../components/empty-data/EmptyData";
import DirectSvg from "../../../components/svg/direct/DirectSvg";
import {privateAxios} from "../../../services/axiosInstances/privateAxios";
import {BASE_URL} from "../../../configs/commons";

const sortOptions = [
    {
        name: 'جدیدترین',
        slug: 'desc'
    },
    {
        name: 'قدیمی ترین',
        slug: 'asc'
    }
]


const PanelBlogs: NextPage = ({articles, count}: any) => {

    const [delBlogModal,setDelBlogModal] = useState(false)
    const [updateBlogModal,setUpdateBlogModal] = useState(false)

    const [blogId , setBlogId] = useState<any>(null)
    const [blogEditId , setBlogEditId] = useState<any>(null)
    const [blogEditData , setBlogEditData] = useState<any>(null)
    const router = useRouter()

    const {user, loading} = useAuth()

    const [openModal, setOpenModal] = useState<any>(false)


    const handleDeleteBlog = (id : number) =>{

        privateAxios().delete(`/article/${id}/`)
            .then((res)=>{
                router.push(router)
                setDelBlogModal(false)
            })
    }

    useEffect(()=>{
       // get blog that is going to edit data
       blogEditId && privateAxios().get(`/article/${blogEditId}`)
            .then((res)=> {
                setBlogEditData(res?.data?.article)
            })
            .catch(err=>console.log(err))
    } , [blogEditId,updateBlogModal])

    if (user?.role.id !== 1 && !loading) {
        router.push('/')
        return <></>
    } else {
        return (
            <MainLayout hasBanner={false}>
                <Head>
                    <title>پنل-بلاگ</title>

                </Head>
                <div className='container md:px-10 relative'>

                    {
                        openModal &&
                        <div
                            className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                            style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                        >
                            <AddBlogModal   setOpenModal={setOpenModal}/>
                        </div>
                    }
                    {/* search & sort & tab */}
                    <div
                        className='md:bg-white py-4 md:px-7 px-4 md:shadow-xl shadow-none md:rounded-2xl md:my-5 mt-5 grid grid-cols-12 gap-y-14'>
                        <div
                            className='lg:col-span-6 col-span-12 flex flex-row justify-start items-center gap-x-10 relative'>
                            <Link href='/panel/ticket'
                                  className={`flex flex-row justify-start items-center gap-x-3  relative  ${router.pathname.includes('/panel/ticket') ? 'text-lg font-bold text-primary before:absolute before:-bottom-7 before:h-1  before:bg-primary before:w-full' : 'text-lg text-custom-gray-200/30 font-medium'}`}>
                                <HeadPhonesSvg width={26} height={26}
                                               color={`${router.pathname.includes('/panel/ticket') ? '#005adc' : '#E4E8EC'}  `}/>
                                <span className=''>تیکت ها</span>
                            </Link>
                            <Link href='/panel/blog'
                                  className={`flex flex-row justify-start items-center gap-x-3  relative  ${router.pathname.includes('/panel/blog') ? 'text-lg font-bold text-primary before:absolute before:-bottom-7 before:h-1  before:bg-primary before:w-full' : 'text-lg text-custom-gray-200/30 font-medium'}`}>
                                <DocumentSvg width={26} height={26}
                                             color={`${router.pathname.includes('/panel/blog') ? '#005adc' : '#E4E8EC'}  `}/>
                                <span className=''>بلاگ ها</span>
                            </Link>
                            <div
                                className='h-1 bg-custom-gray-200/10 absolute md:hidden block w-full -bottom-7 rounded-lg'></div>
                        </div>
                        <div className='lg:col-span-6 col-span-12 '>
                            <div
                                className="grid grid-cols-12 items-center gap-x-4 gap-y-4 lg:justify-start justify-center w-full ">

                                <div className=" sm:col-span-4 col-span-12">
                                    <CustomSelect name='sort' options={sortOptions}
                                                  handleChange={(value)=>{
                                                      router.push({
                                                          pathname : router.pathname,
                                                          query : `${delete router.query._sort && delete router.query._order && queryString.stringify(router.query)}&_sort=id&_order=${value?.slug}`
                                                      })
                                                  }}
                                                  placeholder='اولویت سازی بر اساس'/>
                                </div>
                                <div
                                    className="relative sm:col-span-4 col-span-12 bg-custom-gray-100 border-[0.8px] border-custom-gray-200/10 rounded-lg">
                                    <input
                                        type="text"
                                        onChange={(e)=>{
                                            router.push({
                                                pathname : router.pathname,
                                                query : `${delete router.query.q && queryString.stringify(router.query)}&q=${e.target.value}`
                                            })
                                        }}
                                        placeholder="جستجو"
                                        className="w-4/5 z-10 text-black  py-3 pr-10  placeholder:text-black placeholder:font-semibold focus:outline-none"
                                    />
                                    <span className="absolute top-3 left-2 bg-primary/20 p-2 rounded-md ">
                                <SearchIcon color="#005adc" width={12} height={12}/>
                            </span>
                                </div>
                                <div
                                    className='sm:col-span-4 col-span-12 bg-primary py-3  px-3 flex flex-row justify-center items-center gap-x-2 rounded-lg cursor-pointer '
                                    onClick={(e) => setOpenModal(true)}
                                >
                                    <span className='text-white text-sm '>افزودن بلاگ</span>
                                    <PlusSvg color='white' width={9} height={9}/>
                                </div>
                            </div>
                        </div>
                    </div>


                    {
                        articles.length > 0 ?
                           <>
                               {/* blogs titlebar */}
                               <div
                                   className='bg-primary py-4 md:px-7 px-4 md:flex flex-row justify-start items-center hidden rounded-xl'>
                                   <span className='basis-1/12 text-white text-lg'>عکس</span>
                                   <span className='basis-2/12 text-white text-lg'>عنوان</span>
                                   <span className='basis-2/12 text-white text-lg'>امتیاز</span>
                                   <span className='basis-2/12 text-white text-lg'>توضیحات</span>
                                   <span className='basis-2/12 text-white text-lg'>نویسنده</span>
                                   <span className='basis-2/12 text-white text-lg'>تاریخ</span>
                                   <span className='basis-1/12 text-white text-lg'>عملیات</span>
                               </div>

                               {/* desktop blogs  */}
                               <div className='md:flex hidden flex-col gap-y-3 pb-10'>
                                   {
                                       articles.map((item: any) => (
                                           <BlogRow  setBlogEditData={setBlogEditData} blogEditData={blogEditData} key={item?.id} editId={blogEditId} handleDeleteBlog={()=>handleDeleteBlog(blogId)} setBlogEditId={setBlogEditId} setBlogId={setBlogId} data={item} delBlogModal={delBlogModal} setDelBlogModal={setDelBlogModal} updateBlogModal={updateBlogModal} setUpdateBlogModal={setUpdateBlogModal}/>
                                       ))}


                               </div>

                               {/* mobile blogs */}
                               <div className='md:hidden flex flex-col gap-y-6 pb-10'>
                                   {articles.map((item: any) => (
                                           <BlogCard setBlogEditData={setBlogEditData} blogEditData={blogEditData} editable={true} setBlogId={setBlogId} editId={blogEditId} setBlogEditId={setBlogEditId} handleDeleteBlog={()=>handleDeleteBlog(blogId)} key={item?.id} data={item} setUpdateBlogModal={setUpdateBlogModal} updateBlogModal={updateBlogModal} delBlogModal={delBlogModal} setDelBlogModal={setDelBlogModal}/>
                                   ))}
                               </div>

                               <ReactPaginate pageCount={Math.ceil(count / 5)}
                                              nextLabel={'>'}
                                              nextLinkClassName='text-primary'
                                              previousLinkClassName='text-primary'
                                              previousLabel={'<'}
                                              onPageChange={selectedItem => router.push({
                                                      pathname: router.pathname,
                                                      query: `_page=${selectedItem.selected + 1}`,
                                                  }, undefined, {scroll: false}
                                              )}
                                              activeClassName=' text-white'
                                              activeLinkClassName='bg-primary text-white w-full h-full flex items-center justify-center'
                                              className='flex items-center gap-x-4 justify-center mb-8'
                                              pageLinkClassName=' rounded-lg flex items-center justify-center w-8 h-8'
                                              pageClassName='bg-primary/20 text-primary rounded-lg flex items-center justify-center w-8 h-8'
                               />
                           </>

                        :

                            <div
                                className='col-span-12 flex flex-row justify-center items-center my-5 bg-white py-10 rounded-md'>
                                <EmptyData
                                    title={<div className='text-lg font-semibold'>بلاگی یافت نشد </div>}
                                    Icon={() => <DirectSvg/>}

                                />
                            </div>
                    }

                </div>
            </MainLayout>
        )

    }
}

export default PanelBlogs


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {query} = context


    // const res =await privateAxios().get(`post/${id}`)
    const res = await axios.get(`${BASE_URL}/article?_limit=5&${queryString.stringify(query)}`, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            Cookie: context.req.headers.cookie,
        },
    })


    return {
        props: {
            articles: res.data.results,
            count: res.data.count
        }
    }
}

