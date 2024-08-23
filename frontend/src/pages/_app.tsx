import React from "react";
import type {ReactElement, ReactNode} from 'react'
import NextNProgress from 'nextjs-progressbar';


import type {NextPage} from 'next'
import type {AppProps} from 'next/app'

import {Provider} from "react-redux";
import {store} from "../redux/store";

import '../../styles/globals.css'

import {Toaster} from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";

import 'react-loading-skeleton/dist/skeleton.css'

import 'leaflet/dist/leaflet.css'



export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({Component, pageProps}: AppPropsWithLayout) {
    const router = useRouter()
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <>

            <Head>

                <meta name="google-site-verification" content="u5X0MaNah-A-oawuQAMYz9khcar7NBsogW0ct1TWoUQ" />
                <link rel="icon" href="/faveicon.ico"/>


                <meta property="og:url" content={`https:villaarzan.com${router.asPath}`}/>




                <link href={`https://villaarzan.com${router.asPath}`} rel='alternate' hrefLang='fa'/>
            </Head>
            <Provider store={store}>
                <NextNProgress />
                {getLayout(<Component {...pageProps} />)}
                <Toaster/>
            </Provider>
        </>
    )

}
