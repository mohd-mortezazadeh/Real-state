import {withFormik} from "formik";
import * as yup from 'yup';
import {InnerAuthFormVerify} from "../../components/auth/InnerAuthFormVerify";
import {AuthFormVerifyValues} from "../../interfaces/auth";
import {ThunkDispatch} from "redux-thunk";
import {auth_verify} from "../../redux/slices/authSlice";


const AuthFormVerifyValidationSchema = yup.object().shape({
    // phone: yup.string().required('شماره تماس را وارد کنید!').min(11, 'شماره تماس باید 11 رقمی باشد!')
    //     .max(11, 'شماره تماس باید 11 رقمی باشد!')

})

interface AuthFormVerifyPropsType {
    dispatch: ThunkDispatch<any, any, any>
    user_info: {
        phone: string,
        role: number | null,
        fullname: string,
        city: number | null,
        company_name: string | number,
    },
    token : string

}

const AuthFormVerify = withFormik<AuthFormVerifyPropsType, AuthFormVerifyValues>({
    mapPropsToValues: props => (
        {
            code : null,
            token : props.token,
            role : Number(props.user_info.role),
            city : props.user_info.city,
            company_name : props.user_info.company_name,
            fullname : props.user_info.fullname,
            phone : props.user_info.phone,
        }
    ),
    validationSchema: AuthFormVerifyValidationSchema,
    handleSubmit: (values , { props}) => {

        if(props.token){
            values.token = props.token
        }
        values.code = Number(values.code)
        props.dispatch(auth_verify(values))


    }
})(InnerAuthFormVerify)

export default AuthFormVerify;