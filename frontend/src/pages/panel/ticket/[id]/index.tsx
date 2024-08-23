import React from 'react';
import TicketChatBox from "../../../../components/ticket-chat-box/ticketChatBox";
import {useRouter} from "next/router";
import {NextPageWithLayout} from "../../../_app";
import MainLayout from "../../../../layouts/mainLayout";
import {useAuth} from "../../../../hooks/useAuth";
import Head from "next/head";

const Ticket: NextPageWithLayout = () => {
    const router = useRouter()
    const {user, loading} = useAuth()

    const {id: ticketId} = router.query

    if (user?.role.id !== 1 && !loading) {
        router.push('/')
        return <></>
    } else {
        return (
            <>
                <Head>
                    <title>داشبورد-تیکت</title>
                </Head>
                <div className='container mx-auto lg:max-w-screen-xl my-8'>
                    <button onClick={()=>router.push("/panel/ticket")} className='bg-amber-500 hover:bg-amber-600 transition-colors text-white px-3 py-2 rounded-lg'>
                        بازگشت
                    </button>
                    <TicketChatBox adminBox={true} ticketId={ticketId}/>
                </div>
            </>
        );
    }
};

export default Ticket;

Ticket.getLayout = (page) => <MainLayout hasBanner={false}>{page}</MainLayout>
