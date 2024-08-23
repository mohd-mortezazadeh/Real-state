import {withFormik} from "formik";
import toast from "react-hot-toast";
    import * as yup from 'yup';

import InnerPasswordForm from "../../components/password/InnerPasswordForm";
import {handlePassword} from "../../services/api/password";

interface PasswordFormValues {

}

interface PasswordFormPropsType {
    loadingPassword: any,
    setLoadingPassword: any
}

const passwordFormValidationSchema = yup.object({
    password: yup.string().trim().required('رمز عبور را وارد کنید'),
    password2: yup.string().trim().required('تکرار رمز عبور الزامی است')
        .oneOf([yup.ref('password')], 'تکرار رمز عبور صحیح نمیباشد!')
});

export const PasswordForm = withFormik<PasswordFormPropsType, PasswordFormValues>({
    mapPropsToValues: props => (
        {
            password: '',
            password2: ''
        }
    ),
    validationSchema: passwordFormValidationSchema,
    handleSubmit: async (values, {props}) => {
        props.setLoadingPassword(true)
        handlePassword(values)
            .then(() => {
                props.setLoadingPassword(false)

                toast.success('پسوورد با موفقیت ایجاد شد')
            })

    }
})(InnerPasswordForm)