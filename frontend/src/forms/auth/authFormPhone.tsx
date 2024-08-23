import {withFormik} from "formik";
import * as yup from 'yup';
import {InnerAuthFormPhone} from "../../components/auth/InnerAuthFormPhone";
import {AuthFormPhoneValues} from "../../interfaces/auth";
import {ThunkDispatch} from "redux-thunk";
import {auth_phone} from "../../redux/slices/authSlice";
import {fixNumbers} from "../../utils/toEnglishDigitForPhone";


const AuthFormPhoneValidationSchema = yup.object().shape({
    phone: yup.string().required('شماره تماس را وارد کنید!').min(11, 'شماره تماس باید 11 رقمی باشد!')
        .max(11, 'شماره تماس باید 11 رقمی باشد!')

})

interface AuthFormPhonePropsType {
    dispatch: ThunkDispatch<any, any, any>
}

const AuthFormPhone = withFormik<AuthFormPhonePropsType, AuthFormPhoneValues>({
    mapPropsToValues: props => (
        {
            phone: '',
        }
    ),
    validationSchema: AuthFormPhoneValidationSchema,
    handleSubmit: async (values, {props, setSubmitting}) => {

        let newValue = {...values}
        newValue.phone = fixNumbers(values.phone)


        props.dispatch(auth_phone(newValue))
    }
})(InnerAuthFormPhone)

export default AuthFormPhone;