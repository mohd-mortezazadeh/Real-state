import {NextPageWithLayout} from "../../_app";
import DashboardLayout from "../../../layouts/dashboardLayout";
import {PasswordForm} from "../../../forms/password/passwordForm";
import {useState} from "react";
import Head from "next/head";

const Password: NextPageWithLayout = () => {

    const [loadingPassword , setLoadingPassword] = useState(false)

    return (
        <>
            <Head>
                <title>داشبورد-رمز عبور</title>

            </Head>
            <div className=' bg-white rounded-lg p-4 py-6 mt-4'>
                <PasswordForm loadingPassword={loadingPassword} setLoadingPassword={setLoadingPassword}/>
            </div>
        </>
    );
};

Password.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>


export default Password;