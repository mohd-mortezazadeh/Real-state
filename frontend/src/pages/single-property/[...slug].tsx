import {NextPage} from "next";
import {GetServerSideProps} from 'next'

import SimilarPropertiesList from "../../components/similar-properties-list/SimilarPropertiesList.component";
import SinglePropertyDetail from "../../components/single-property-detail/SinglePropertyDetail";
import MainLayout from "../../layouts/mainLayout";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../../configs/commons";


const SingleProperty: NextPage = ({data, id, res, query}: any) => {
    const {ad, similar_ads} = data

    const [path, setPath] = useState<any>()


    useEffect(() => {

        setPath([
            {
                name: ad?.category?.city,
                url: ad?.category?.city_slug
            },
            {
                name: ad?.category?.display_name,
                url: `${ad?.category?.city_slug}/${ad?.category?.name}`
            },
            {
                name: ad?.section?.name,
                url: `${ad?.category?.city_slug}/${ad?.category?.name}/${ad?.section?.slug}`
            },
            {
                name: ad?.title,
                url: `${ad?.category?.city_slug}/${ad?.category?.name}/${ad?.section?.slug}/${ad?.id}/${ad?.title}`
            },

        ])
    }, [])

    return (
        <MainLayout hasBanner={false}>
            <Breadcrumb title="جزئیات ملک" subtitle={ad?.title} path={path}/>

            <div className='container mx-auto lg:max-w-screen-xl'>
                {/*
                   ** main container
                 */}
                <div className="sm:px-4 ">
                    {/*
                       ** ads  container
                     */}
                    <section className="w-full grid grid-cols-12 mb-4">
                        {
                            <SinglePropertyDetail data={ad}/>
                        }
                    </section>

                    {/*   similar ads*/}
                    {
                        similar_ads?.length > 0 &&
                        <SimilarPropertiesList data={similar_ads}/>
                    }
                </div>
            </div>
        </MainLayout>
    );
};


export default SingleProperty;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {query} = context
    const {slug} = query

    const [id]: any = slug

    // const res =await privateAxios().get(`post/${id}`)
    const res = await axios.get(`${BASE_URL}/post/${id}`, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            Cookie: context.req.headers.cookie,
        },
    })


    return {
        props: {
            data: JSON.parse(JSON.stringify(res.data)),
            id: id,
            query: query
        }
    }
}
