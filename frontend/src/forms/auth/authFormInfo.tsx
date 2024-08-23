import {withFormik} from "formik";
import * as yup from 'yup';
import {AuthFormInfoValues} from "../../interfaces/auth";
import {InnerAuthFormInfo} from "../../components/auth/InnerAuthFormInfo";
import {auth_info, userPhone} from "../../redux/slices/authSlice";
import {ThunkDispatch} from "redux-thunk";


const AuthFormInfoValidationSchema = yup.object().shape({
    // phone: yup.string().required('شماره تماس را وارد کنید!').min(11, 'شماره تماس باید 11 رقمی باشد!')
    //     .max(11, 'شماره تماس باید 11 رقمی باشد!')
    role: yup.string().required('نقش خود را انتخاب کنید'),
    fullname: yup.string().required('نام و نام خانوادگی خود را وارد کنید').min(2, 'نام شما باید حداقل شامل دو حرف باشد'),
    city: yup.number().nullable().required('شهر خود را انتخاب کنید'),
    company_name: yup.string().when("role", {
        is: (value: number) => value == 4,
        then: yup.string().required("نام دفتر املاک را وارد کنید")
    })


})

interface AuthFormInfoPropsType {
    phone: string,
    dispatch: ThunkDispatch<any, any, any>
}

const AuthFormInfo = withFormik<AuthFormInfoPropsType, AuthFormInfoValues>({
    mapPropsToValues: props => (
        {
            phone: props.phone,
            role: '5',
            fullname: '',
            city: null,
            company_name: ''
        }
    ),
    validationSchema: AuthFormInfoValidationSchema,
    handleSubmit: (values, {props}) => {

        let newValues = {...values}

        if (newValues.role == 3 && !newValues.company_name) {
            newValues.role = 6
        }
        newValues.role = +newValues.role!

        props.dispatch(auth_info(newValues))
    }
})(InnerAuthFormInfo)

export default AuthFormInfo;