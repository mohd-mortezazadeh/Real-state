import { Form, FormikProps } from "formik";
import Input from "../form/input";
import { AuthFormPhoneValues } from "../../interfaces/auth";
import { useAppSelector } from "../../hooks/useRedux";
import { loading } from "../../redux/slices/authSlice";
import Button from "../button/button";

export const InnerAuthFormPhone = (props: FormikProps<AuthFormPhoneValues>) => {
    const loadingState = useAppSelector(loading)
    return (
        <Form action="" className='mt-4'>
            <Input name='phone' type='text' placeHolder='لطفا شماره تماس خود را وارد نمایید' label='شماره تماس' />

            <div className='mt-8 flex items-center'>
                {/*<button className='flex items-center'>*/}
                {/*    <span>*/}
                {/*        <ArrowRightSvg/>*/}
                {/*    </span>*/}
                {/*    <span>*/}
                {/*        مرحله قبل*/}
                {/*    </span>*/}
                {/*</button>*/}
                <Button loading={loadingState} />
            </div>
        </Form>
    )
}