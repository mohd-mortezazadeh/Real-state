import {Form, FormikProps} from "formik";
import Input from "../form/input";
import CustomSelect from "../select/CustomSelect";
import PencilSvg from "../svg/pencil/PencilSvg";
import {useEffect, useState} from "react";

const educationOptions = [
    {name: 'زیر دیپلم', slug: 'zir_diplom'},
    {name: 'دیپلم', slug: 'diplom'},
    {name: 'لیسانس', slug: 'lisans'},
    {name: 'فوق لیسانس', slug: 'fogh_lisans'},
    {name: 'دکترا', slug: 'doctor'},
]

const maritalOptions = [{name: 'مجرد', slug: 'mojarad'}, {name: 'متاهل', slug: 'motahel'}]

const InnerProfileForm = (props: any) => {


    const defaultMarital = props?.profile && props?.profile.find((item: any) => {
        return item.key === 'marital_status'
    })

    const defaultMaritalValue = defaultMarital && maritalOptions.find(item => {
        return item.name === defaultMarital.value
    })


    const defaultEducation = props?.profile && props?.profile.find((item: any) => {
        return item.key === 'education'
    })

    const defaultEducationValue = defaultEducation && educationOptions.find(item => {
        return item.name === defaultEducation.value
    })


    return (
        props?.user && props?.profile && <Form>
            <div className='grid grid-cols-12 gap-x-6 gap-y-4'>
                <div className='col-span-12 sm:col-span-6'>
                    <Input name={'fullname'} defaultValue={props?.user.fullname} type='text' label='نام و نام خانوادگی'
                           disabled={true}
                           inputClassName='bg-black/10'/>
                </div>
                {
                    props.user?.role.id === 4 &&
                    <div className='col-span-12 sm:col-span-6'>
                        <Input name={'realestate-name'} defaultValue={props?.user.company_name.name} type='text'
                               label='نام دفتر مشاور املاک' disabled={true}
                               inputClassName='bg-black/10'/>
                    </div>
                }

                <div className='col-span-12 sm:col-span-6'>
                    <Input name={'phone'} type='text' defaultValue={props?.user.phone} label='شماره تماس'
                           disabled={true}
                           inputClassName='bg-black/10'/>
                </div>

                <div className='col-span-12 sm:col-span-6'>
                    <CustomSelect defaultValue={defaultEducationValue} options={educationOptions}
                                  handleChange={(value: any) => {
                                      props.setFieldValue('data.education', value)
                                  }} name={'education'} title='تحصیلات' hasLabel={true}/>
                </div>

                <div className='col-span-12 sm:col-span-6'>
                    <CustomSelect defaultValue={defaultMaritalValue} options={maritalOptions}
                                  handleChange={(value: any) => {
                                      props.setFieldValue('data.marital_status', value)
                                  }} name={'marital_status'} title='وضعیت تاهل' hasLabel={true}/>
                </div>

                {
                    // props?.user?.role?.id !== 5 &&
                    <>
                        <div className='col-span-12 sm:col-span-6'>
                            <Input name={'data.telegram'}
                                   defaultValue={props?.profile?.find((item: any) => item.key === 'telegram')?.value}
                                   type='text'
                                   label='آیدی کانال تلگرام'/>
                        </div>

                        <div className='col-span-12 sm:col-span-6'>
                            <Input name={'data.instagram'}
                                   defaultValue={props?.profile?.find((item: any) => item.key === 'instagram')?.value}
                                   type='text' label='آیدی اینستا'/>
                        </div>

                        <div className='col-span-12 sm:col-span-12'>
                            <Input type='text' name={'data.description'}
                                   defaultValue={props?.profile?.find((item: any) => item.key === 'description')?.value}
                                   as='textarea' rows={6} label='درباره من'/>
                        </div>
                    </>
                }

            </div>
            <div className='flex justify-end mt-4'>
                <button
                    disabled={!props.dirty}
                    type='submit'
                    className={` items-center flex text-white gap-x-2 px-4 py-2 rounded-md w-full justify-center sm:w-auto ${!props.dirty ? "bg-primary/20" : "bg-primary-lin"}`}>

                    <span>ویرایش</span>


                    {
                        props.loadingProfile ?
                            <svg aria-hidden="true" role="status"
                                 className="inline mr-2 w-4 h-4 stroke-white/10 animate-spin"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="rgb(13 158 45 / 0.8)"/>
                            </svg>
                            :
                            <PencilSvg/>
                    }
                </button>
            </div>
        </Form>
    );
};

export default InnerProfileForm;