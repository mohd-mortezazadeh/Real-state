import {Form, FormikProps} from "formik";
import Input from "../form/input";
import {AuthFormPasswordValues} from "../../interfaces/auth";
import {useState} from "react";
import ArrowLeftSvg from "../svg/arrows/arrow-left/ArrowLeftSvg";
import {auth_forget_password, loading, userPhone, userTypes} from "../../redux/slices/authSlice";
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {handlePage, selectFormPrevPage} from "../../redux/slices/formSlice";
import Button from "../button/button";

export const InnerAuthFormPassword = (props: FormikProps<AuthFormPasswordValues>) => {

    const [showPass, setShowPass] = useState(false)

    const dispatch  = useAppDispatch()

    const user_types = useAppSelector(userTypes)
    const phone = useAppSelector(userPhone)
    const loadingState = useAppSelector(loading)

    const handleChangeShowPass = () => {
        setShowPass(prevState => !prevState)
    }


    const handleForgotPass = () => {
        dispatch(auth_forget_password({
            phone
        }))
        dispatch(handlePage(5))
    }

    const handlePrevPage = () => {
        dispatch(handlePage(1))
    }

    return (
        <Form action="" className='mt-6'>
            <Input isPassword={true} showPass={showPass} handleChangeShowPass={handleChangeShowPass} name='password' type='password' placeHolder='لطفا پسوورد را وارد نمایید'
                   label='پسوورد'/>
            {
                !user_types.is_admin &&
                <p className='text-left text-sm mt-2 '>
                    <span className='cursor-pointer hover:text-primary' onClick={handleForgotPass}>فراموشی رمز !</span>
                </p>
            }

            <div className='mt-10 flex justify-between items-center'>

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