import React, {FC} from 'react'
import Link from "next/link";

interface TicketRowProps {
    data: any,
    urgencies: any,
    departments: any
}

const TicketRow: FC<TicketRowProps> = ({data, departments, urgencies}) => {
    return (
        <Link href={`/panel/ticket/${data.id}`}
            className='bg-white py-4 md:px-7 px-4 first:mt-5 md:flex flex-row box-shadow-1 rounded-xl justify-start items-center hidden  gap-y-5 cursor-pointer'>
            <div
                className='basis-2/12 text-text  text-lg font-bold truncate'>{departments.find((item: any) => item.slug === data.department)?.name}</div>
            <div className='basis-2/12 text-text   truncate'>{data?.title}</div>
            <div
                className='basis-2/12 text-custom-red   truncate'>{urgencies.find((item: any) => item.slug === data.urgency)?.name}</div>
            <div className='basis-5/12 text-text   truncate pl-24'>{data.description}</div>
            <div className='basis-1/12 text-text   truncate'>{new Date(+data?.created_at).toLocaleDateString('fa')}</div>
        </Link>

    )
}

export default TicketRow
