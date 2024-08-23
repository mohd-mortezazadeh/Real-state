import {Form} from 'formik'
import React, {FC} from 'react'
import Input from '../../form/input'

const InnerAddBlogFormInfo = (props: any) => {

    return (
        <Form className='w-full flex flex-col gap-y-6'>
            {
                props.isEdit ?
                    <>
                        <div className='flex flex-col'>
                            <label htmlFor='title' className='text-base font-semibold'>عنوان</label>
                            <Input name="title" value={props.values.title} type="text"
                                   placeHolder="عنوان را وارد کنید .."
                                   inputClassName='bg-custom-gray-100 border-[0.8px] border-custom-gray-200/20 rounded-md'/>

                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='content' className='text-base font-semibold'>توضیحات بلاگ</label>
                            <Input name="content" value={props.values.content} as='textarea' rows={5} type="text"
                                   placeHolder="توضیحات بلاگ را وارد کنید .."
                                   inputClassName='bg-custom-gray-100 border-[0.8px] border-custom-gray-200/20 rounded-md'/>

                        </div>
                    </>
                    :
                    <>
                        <div className='flex flex-col'>
                            <label htmlFor='title' className='text-base font-semibold'>عنوان</label>
                            <Input name="title" type="text" placeHolder="عنوان را وارد کنید .."
                                   inputClassName='bg-custom-gray-100 border-[0.8px] border-custom-gray-200/20 rounded-md'/>

                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='content' className='text-base font-semibold'>توضیحات بلاگ</label>
                            <Input name="content" as='textarea' rows={5} type="text"
                                   placeHolder="توضیحات بلاگ را وارد کنید .."
                                   inputClassName='bg-custom-gray-100 border-[0.8px] border-custom-gray-200/20 rounded-md'/>

                        </div>
                    </>
            }
            <div className='w-full flex flex-row justify-start gap-x-6 items-center'>
                <button type='submit' className='basis-3/4 bg-primary-lin py-4 rounded-md text-white font-semibold'>ثبت
                    بلاگ
                </button>
                <button type='button'
                        className='basis-1/4 bg-custom-gray-200/10 py-4 text-custom-gray-200 rounded-md font-semibold'
                        onClick={(e) => {
                            props.setOpenModal(false)
                            // props.setBlogEditData([])
                        }}
                >لغو
                </button>
            </div>
        </Form>
    )
}

export default InnerAddBlogFormInfo
