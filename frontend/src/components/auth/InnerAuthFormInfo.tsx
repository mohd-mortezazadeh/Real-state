import {ErrorMessage, Field, Form, FormikProps} from "formik";
import Input from "../form/input";
import {AuthFormInfoValues} from "../../interfaces/auth";
import CustomSelect from "../select/CustomSelect";
import useCities from "../../hooks/useCities";
import useCompanies from "../../hooks/useCompanies";
import ArrowLeftSvg from "../svg/arrows/arrow-left/ArrowLeftSvg";
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {loading, reset} from "../../redux/slices/authSlice";
import Button from "../button/button";
import {handlePage, selectFormPrevPage} from "../../redux/slices/formSlice";


export const InnerAuthFormInfo = (props: FormikProps<AuthFormInfoValues>) => {
    const dispatch = useAppDispatch()

    const {cities, isLoadingCities} = useCities()

    const {companies} = useCompanies(1)

    const loadingState = useAppSelector(loading)
    // const prevPage = useAppSelector(selectFormPrevPage)

    const handlePrevPage = () => {
        dispatch(handlePage(1))
        dispatch(reset())
    }

    return (
        <Form action="" className='mt-6 flex flex-col gap-y-6'>

            <div className='space-y-4'>
                <div className='font-semibold'>نقش</div>
                <div className='flex gap-x-4' role="group" aria-labelledby="my-radio-group">
                    <label className='flex gap-x-2 items-center'>
                        <Field type="radio" name="role" value={'5'}/>
                        <span>مالک یا خریدار</span>
                    </label>
                    <label className='flex gap-x-2 items-center'>
                        <Field type="radio" name="role" value={'3'}/>
                        <span>مشاور</span>
                    </label>
                    <label className='flex gap-x-2 items-center'>
                        <Field type="radio" name="role" value={'4'}/>
                        <span>دفتر املاک</span>
                    </label>

                </div>
            </div>
            <Input name='fullname' labelClassName='font-semibold' type='text'
                   placeHolder='نام و نام خانوادگی خود را وارد کنید'
                   label='نام و نام خانوادگی'/>
            <div className='space-y-2'>
                <label className='font-semibold ' htmlFor="">شهر</label>
                <CustomSelect
                    name={'city'}
                    options={cities}
                    // value={props.values.city}
                    handleChange={value => props.setFieldValue('city', value?.id)}
                />
                <ErrorMessage name='city' className={`text-red-500 text-sm`} component='div'/>
            </div>
            {
                props.values.role == 3 &&
                <div className='space-y-2'>
                    <label className='font-semibold' htmlFor="">نام دفتر املاک</label>
                    <CustomSelect
                        isRtl={false}
                        name={'company_name'}
                        options={companies}
                        // value={props.values.city}
                        handleChange={value => props.setFieldValue('company_name', value?.id)}
                    />
                    <ErrorMessage name='company_name' className={`text-red-500 text-sm`} component='div'/>
                </div>
            }

            {
                props.values.role == 4 &&
                <Input name='company_name' labelClassName='font-semibold' type='text'
                       placeHolder='نام دفتر خود را وارد کنید'
                       label='نام دفتر املاک'/>
            }


            <div className='mt-2 flex justify-between items-center'>
                <Button loading={loadingState}/>
                <button type='button' className='flex items-center' onClick={handlePrevPage}>
                    <span>
                        مرحله قبل
                    </span>
                    <span>
                        <ArrowLeftSvg color={'#005adc'} width={18} height={18}/>
                    </span>
                </button>

            </div>
        </Form>
    )
}