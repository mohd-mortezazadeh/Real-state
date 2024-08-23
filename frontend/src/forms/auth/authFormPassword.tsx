import {withFormik} from "formik";
import * as yup from 'yup';
import {AuthFormPasswordValues} from "../../interfaces/auth";
import {InnerAuthFormPassword} from "../../components/auth/InnerAuthFormPassword";
import {ThunkDispatch} from "redux-thunk";
import {auth_password} from "../../redux/slices/authSlice";


const AuthFormPasswordValidationSchema = yup.object().shape({
    password: yup.string().required('پسوورد خود را وارد کنید!')

})

interface AuthFormPasswordPropsType {
    phone: string,
    dispatch: ThunkDispatch<any, any, any>
}

const AuthFormVerify = withFormik<AuthFormPasswordPropsType, AuthFormPasswordValues>({
    mapPropsToValues: props => (
        {
            password: '',
            phone: ''
        }
    ),
    validationSchema: AuthFormPasswordValidationSchema,
    handleSubmit: (values, {props}) => {
        values.phone = props.phone
        props.dispatch(auth_password(values))

    }
})(InnerAuthFormPassword)

export default AuthFormVerify;