import DashboardLayout from "../../../layouts/dashboardLayout";
import CustomSelect from "../../../components/select/CustomSelect";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {privateAxios} from "../../../services/axiosInstances/privateAxios";
import toast from "react-hot-toast";
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux";
import {updateUser, userState} from "../../../redux/slices/userSlice";
import useCompanies from "../../../hooks/useCompanies";
import EmptyData from "../../../components/empty-data/EmptyData";
import DirectSvg from "../../../components/svg/direct/DirectSvg";
import Loading from "../../../components/loading/Loading.component";
import LoadingSvg from "../../../components/svg/loading/LoadingSvg";


const roles = [
    {
        id: 3,
        name: "advisor",
        display_name: "مشاور",
    },
    {
        id: 4,
        name: "real_estate",
        display_name: "دفتر املاک"
    },
    {
        id: 5,
        name: "owner",
        display_name: "مالک/خریدار",
    },
    {
        id: 6,
        name: "free_advisor",
        display_name: "مشاور آزاد",
    }
]

const ChangeRole = () => {

    const dispatch = useAppDispatch()

    const user = useAppSelector(userState)

    const [loading, setLoading] = useState(false)

    const {companies} = useCompanies(1)

    const [tabActive, setTabActive] = useState<any>( null)


    useEffect(()=>{
        setTabActive(roles.find(item=>item.id ===user?.role?.id))
    } , [user])

    //change role form submit and validation
    const formik = useFormik<any>({
        initialValues: {
            role: tabActive?.id,
            company: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            role: Yup.string().nullable()
                .required('نقش خود را انتخاب کنید'),
            company: Yup.mixed().nullable()
                .when("role", {
                    is: (r: number) => +r === 3 || +r === 4,
                    then: (c) => c.required('نام دفتر را انتخاب نمایید'),
                })
            ,

        }),
        onSubmit: function (values, formikHelpers) {

            values.company = values.company.name || values.company || ""
            setLoading(true)
            privateAxios().put(`/change-role/${user?.id}/`, values)
                .then((res) => {
                    privateAxios().get('/user')
                        .then((res) => dispatch(updateUser(res?.data?.data)))
                        .catch(err => {
                            throw err
                        })

                    setLoading(false)
                    toast.success(res?.data.detail)

                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                    if(err.response.status === 403){
                        toast.error(err.response.data.detail)
                    }else{
                        toast.error('خطایی رخ داده است')
                    }
                })
        }
    })


    //every time active tab change the recent form must reset
    useEffect(() => {
        // formik.setFieldValue("company", "")
        formik.resetForm()
    }, [tabActive])


    return (
        <DashboardLayout>
            {
                user ?
                    user?.status?.id !== 0 ?
                        <div>
                            <h2 className='mt-12 mb-4 font-bold text-lg'>نوع نقش مورد نظر خود را انتخاب نمایید :</h2>

                            <div className='grid grid-cols-12 justify-start gap-x-2 gap-y-4'>
                                {/*  right side  */}
                                <div className='col-span-12 lg:col-span-5 flex flex-col gap-y-3 items-start'>

                                    {
                                        roles.map(role => (
                                            <button
                                                key={role?.id}
                                                onClick={() => setTabActive(role)}
                                                className={`px-4 font-bold rounded-lg  box-shadow-3 transition-colors py-4  w-full  text-right ${tabActive?.id === role.id ? "bg-primary text-white hover:bg-primary/80" : 'bg-white text-primary hover:bg-custom-gray-200/20 '}`}>
                                                {role?.display_name}
                                            </button>
                                        ))
                                    }
                                </div>

                                {/*  left side  */}
                                {
                                    tabActive &&
                                    <form onSubmit={formik.handleSubmit}
                                          className='col-span-12 lg:col-span-7 w-full h-full bg-white rounded-lg box-shadow-3 p-4 flex flex-col justify-between'>
                                        <div>
                                            <h2 className='font-bold text-lg text-primary'>{tabActive?.display_name}</h2>
                                            {
                                                tabActive.id === 3 ?
                                                    <p className='flex flex-col my-3 gap-y-2'><span>برای داشتن این نقش نیاز به تایید از طرف دفتر املاک خود را دارید.</span> <span><span className='font-bold'>نکته:</span> در صورت رد شدن از دفتر املاک انتخاب شده نقش شما به مشاور آزاد تفییر می یابد.</span></p>
                                                    :
                                                    tabActive.id === 4 ?
                                                        <p className='my-3 flex flex-col gap-y-3'>
                                                        <span>
                                                          برای دفتر املاک شدن نام دفتر را انتخاب کرده و بعد از اعمال تغییر نقش منتظر تایید حساب خود از طرف ادمین باشید .
                                                        </span>
                                                            <span>
                                                            <span className='font-bold'>نکته :</span> در صورت داشتن زیر مجموعه فعال و در حال انتظار نمیتوانید این نقش را تغییر دهید.
                                                        </span>
                                                        </p>
                                                        :
                                                        tabActive.id === 5 ?
                                                            <p className='my-3 flex flex-col gap-y-3'>
                                                                <span>حساب شما با داشتن این نقش نیاز به تایید ادمین ندارد.</span>

                                                                <span><span className='font-bold'>نکته : </span> هر پست گذاشته شده از طرف شما نیاز به تایید ادمین دارد.</span>
                                                            </p>
                                                            :
                                                            tabActive.id === 6 &&

                                                            <p className='my-3 flex flex-col gap-y-3'>
                                                                <span>با داشتن این نقش زیر مجموعه هیچ دفتر املاکی نخواهید بود.</span>

                                                                <span><span className='font-bold'>نکته : </span> هر پست گذاشته شده از طرف شما نیاز به تایید ادمین دارد.</span>
                                                            </p>

                                            }

                                        </div>
                                        {
                                            tabActive.id === 3 ?
                                                <>
                                                    <CustomSelect options={companies} name='company'
                                                                  value={formik.values.company}
                                                                  handleChange={(value) => formik.setFieldValue("company", value)}
                                                                  placeholder='دفتر املاک مورد نظر را انتخاب نمایید'
                                                                  hasLabel={true} title='دفتر املاک'
                                                                  titleClassName='text-sm'/>
                                                    <span className='text-red-400 text-sm mt-1'>
                                        <>
                                            {formik.errors.company}
                                        </>
                                    </span>
                                                </>
                                                :
                                                tabActive.id === 4 ?

                                                    <>
                                                        <label className='text-sm' htmlFor="company">نام دفتر املاک</label>
                                                        <input type="text" placeholder='نام دفتر خود را وارد نمایید...'
                                                               value={formik.values.company}
                                                               onChange={formik.handleChange}
                                                               className='w-full border text-sm mt-2 p-2 rounded-lg outline-primary'
                                                               name="company" id="company"/>
                                                        <span className='text-red-400 text-sm mt-1'>
                                            <>
                                               {formik.errors.company}
                                            </>
                                        </span>
                                                    </>
                                                    : null

                                        }

                                        {/*<Input name={'company'} type={'text'} />*/}

                                        <div className='flex justify-end mt-8 '>
                                            <button
                                                disabled={user?.role?.id === tabActive.id}
                                                type='submit'
                                                className='bg-primary-lin px-3  py-2 text-white hover:bg-gradient-to-bl hover:from-primary hover:to-primary transition-all rounded-lg disabled:bg-custom-gray-200 disabled:bg-none'>

                                                    {
                                                         loading ?
                                                            <span className='animate-spin'> <LoadingSvg width={20} height={20} color1={'#fff'}
                                                                                                        color2={"#fff"}/></span>
                                                            :
                                                            <span>
                                                                  تغییر نقش
                                                            </span>

                                                    }

                                            </button>
                                        </div>
                                    </form>

                                }

                            </div>
                        </div>
                        :
                        <>
                            <div className='mt-24'>
                                <EmptyData
                                    title={<div className='text-lg font-semibold'>حساب کاربری شما غیرفعال میباشد</div>}
                                    hasButton={false}
                                    buttonTitle="ثبت اولین آگهی "
                                    Icon={() => <DirectSvg/>}
                                    href="/add-property"
                                />
                            </div>
                        </>
                    :
                    <div className="flex flex-row justify-center pt-8">
                        <Loading/>
                    </div>
            }

        </DashboardLayout>
    );
};

export default ChangeRole;