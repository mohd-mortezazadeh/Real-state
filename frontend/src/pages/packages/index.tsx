import React, {useEffect, useState} from 'react'
import Breadcrumb from '../../components/breadcrumb/breadcrumb'
import PackageRow from '../../components/package-row/PackageRow'
import ArrowDownSvg from '../../components/svg/arrows/arrow-down/arrowDownSvg'
import MainLayout from '../../layouts/mainLayout'
import {getPackages} from "../../services/api/packages";

const path = [
    {
        name: 'پکیج ها',
        url: "/packages"
    },
]

//TODO
//this page link is not in header menu
const Packages = () => {
    const [rowOpen, setRowOpen] = useState<boolean>(true)
    const [packages, setPackages] = useState<any>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        //get packages from backend
        const res = getPackages()
            .then((res) => {
                setPackages(res)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [])


    return (
        <MainLayout hasBanner={false}>
            <Breadcrumb title="ارتباط با ما" subtitle=" با ما در ارتباط باشید" path={path}/>
            <div className='container'>
                <div>
                    <div
                        className='hidden md:flex flex-row justify-between items-center bg-primary py-4 px-8 rounded-lg cursor-pointer'
                        onClick={() => setRowOpen(!rowOpen)}
                    >
                        <span className='text-xl font-bold text-white'>آگهی و نردبان</span>
                        <span className={`${rowOpen ? 'rotate-180' : 'rotate-0'} transition`}>
                            <ArrowDownSvg color='white' rectFill='' width={22} height={22}/>
                        </span>
                    </div>

                    <div className={`${rowOpen ? 'h-auto  ' : 'h-0 overflow-hidden'} space-y-4 pb-5`}>
                        {
                            packages.length > 0 && packages.map((item: any) => (
                                <PackageRow data={item} rowOpen={rowOpen} key={item.toString()}/>
                            ))
                        }
                    </div>
                </div>
            </div>

        </MainLayout>
    )
}

export default Packages


