import {NextPageWithLayout} from "../../_app";
import DashboardLayout from "../../../layouts/dashboardLayout";
import {ProfileForm} from "../../../forms/profile/profileForm";
import {useEffect, useState} from "react";
import {getProfile} from "../../../services/api/profile";
import {useAuth} from "../../../hooks/useAuth";
import Head from "next/head";


const educationOptions = [
    {name: 'زیر دیپلم', slug: 'zir_diplom'},
    {name: 'دیپلم', slug: 'diplom'},
    {name: 'لیسانس', slug: 'lisans'},
    {name: 'فوق لیسانس', slug: 'fogh_lisans'},
    {name: 'دکترا', slug: 'doctor'},
]

const maritalOptions = [{name: 'مجرد', slug: 'mojarad'}, {name: 'متاهل', slug: 'motahel'}]

const Profile: NextPageWithLayout = () => {

    const {user, loading} = useAuth()



    const [avatarId, setAvatarId] = useState<number>()



    const [userProfile, setUserProfile] = useState<any>()

    const [data, setData] = useState<any>()

    const [loadingProfile , setLoadingProfile] = useState(false)

    useEffect(() => {
        //get user profile data when page loaded and user api fetched
        user && getProfile().then(res => {
            setUserProfile(res)
        })

        user && setAvatarId(user?.avatar?.id)
    }, [user])






    const defaultMarital = userProfile && userProfile.find((item: any) => {
        return item.key === 'marital_status'
    })

    const defaultMaritalValue = defaultMarital && maritalOptions.find(item => {
        return item.name === defaultMarital?.value
    })


    const defaultEducation = userProfile && userProfile.find((item: any) => {
        return item.key === 'education'
    })

    const defaultEducationValue = defaultEducation && educationOptions.find(item => {
        return item.name === defaultEducation?.value
    })

    const defaultInstagramValue = userProfile && userProfile?.find((item: any) => item.key === 'instagram')?.value

    const defaultTelegramValue = userProfile && userProfile?.find((item: any) => item.key === 'telegram')?.value

    const defaultDescriptionValue = userProfile && userProfile?.find((item: any) => item.key === 'description')?.value

    useEffect(() => {

        setData({
            telegram: defaultTelegramValue,
            instagram: defaultInstagramValue,
            description: defaultDescriptionValue,
            education: defaultEducationValue?.name,
            marital_status: defaultMaritalValue?.name
        })
    }, [userProfile])

    return (
        <>
            <Head>
                <title>داشبورد-پروفایل من</title>

            </Head>
            <div className='grid grid-cols-12  bg-white rounded-lg p-4 py-6 mt-4'>

                <div className='col-span-12 xl:col-span-12'>
                    <ProfileForm loadingProfile={loadingProfile} setLoadingProfile={setLoadingProfile} data={data} user={user} avatar={avatarId} profile={userProfile}/>
                </div>
            </div>
        </>
    );
};


Profile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Profile;