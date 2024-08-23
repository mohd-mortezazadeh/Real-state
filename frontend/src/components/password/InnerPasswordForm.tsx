import Input from "../form/input";
import {useState} from "react";
import Button from "../button/button";
import {Form} from "formik";
import {useAuth} from "../../hooks/useAuth";

const InnerPasswordForm = (props : any) => {

    const {user ,loading}  = useAuth()

    const [showPass, setShowPass] = useState(false)
    const [showPass2, setShowPass2] = useState(false)

    const handleChangeShowPass = () => {
        setShowPass(prevState => !prevState)
    }
    const handleChangeShowPass2 = () => {
        setShowPass2(prevState => !prevState)
    }


    return (
        <Form>
            <div className='grid grid-cols-12 gap-6'>
                <div className='col-span-12 md:col-span-6'>
                    <Input name='password' type='password' isPassword={true} showPass={showPass}
                           placeHolder='رمز عبور خود را وارد کنید'
                           handleChangeShowPass={handleChangeShowPass} label='رمز عبور'/>
                </div>

                <div className='col-span-12 md:col-span-6'>
                    <Input name='password2' type='password' isPassword={true} showPass={showPass2}
                           placeHolder='تکرار رمز عبور را وارد کنید'
                           handleChangeShowPass={handleChangeShowPass2} label='تکرار رمز عبور'/>
                </div>

                <div className='col-span-12'>
                    {
                        !loading &&

                        (user?.has_password ?
                        <Button buttonClassName='bg-primary-lin w-full' loading={props.loadingPassword} title='ویرایش'/>
                        :
                        <Button buttonClassName='bg-primary-lin w-full' loading={props.loadingPassword} title='افزودن'/>)
                    }
                </div>

            </div>
        </Form>
    );
};

export default InnerPasswordForm;