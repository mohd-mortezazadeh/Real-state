import {Form, FormikProps} from "formik";
import Input from "../form/input";
import {AuthFormVerifyValues} from "../../interfaces/auth";
import ArrowLeftSvg from "../svg/arrows/arrow-left/ArrowLeftSvg";
import Button from "../button/button";
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {loading, reset, userTypes} from "../../redux/slices/authSlice";
import {handlePage, selectFormPrevPage} from "../../redux/slices/formSlice";


export const InnerAuthFormVerify = (props: FormikProps<AuthFormVerifyValues>) => {
    const dispatch = useAppDispatch()
    const prevPage = useAppSelector(selectFormPrevPage)
    const loadingState = useAppSelector(loading)
    const user_types = useAppSelector(userTypes)

    const handlePrevPage = () => {
        dispatch(handlePage(prevPage))
        if (user_types.is_loggin) {
            dispatch(reset())
        }
    }
    return (
        <Form action="" className='mt-6'>
            <Input name='code' type='number' placeHolder='  کد احراز هویت خود را وارد نمایید' isTimer={true}
                   label='کد احراز'/>

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

