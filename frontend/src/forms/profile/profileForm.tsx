import {withFormik} from "formik";
import InnerProfileForm from "../../components/profile/InnerProfileForm";
import {createProfile} from "../../services/api/profile";
import toast from "react-hot-toast";

interface ProfileFormValues {

}

interface ProfileFormPropsType {
    avatar: number | undefined | null,
    user: any,
    profile: any,
    data: any,
    setLoadingProfile: any,
    loadingProfile: any
}

export const ProfileForm = withFormik<ProfileFormPropsType, ProfileFormValues>({
    mapPropsToValues: props => (
        {
            // avatar: props?.user?.avatar,
            data: props.data
        }
    ),
    enableReinitialize: true,
    handleSubmit: async (values, {props}) => {
        let newValues: any = {...values}
        // newValues.avatar = props?.avatar || ''

        if (newValues?.data?.education?.name !== undefined) {
            newValues.data.education = newValues?.data?.education?.name

        }

        if (newValues?.data?.marital_status?.name !== undefined) {
            newValues.data.marital_status = newValues?.data?.marital_status?.name
        }



        if (Object.values(newValues?.data).every(item => item === undefined)) {
            return toast('ابتدا اطلاعاتی را وارد نمایید!')
        }


        props.setLoadingProfile(true)
        await createProfile(newValues)
            .then(() => {
                props.setLoadingProfile(false)
                toast.success('پروفایل با موفقیت ویرایش شد')
            })
            .catch(() => {
                props.setLoadingProfile(false)
                toast.error('خطایی رخ داده است')

            })


    }
})(InnerProfileForm)