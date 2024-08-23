import React, {FC} from 'react'
import AddTicketForm from '../../../forms/add-ticket/AddTicketForm'
import CloseIcon from '../../svg/close/closeSvg'
import {useAppDispatch} from "../../../hooks/useRedux";

interface AddTicketModalProps {
    setOpenAddTicketModal?: any
}

const AddTicketModal: FC<AddTicketModalProps> = ({setOpenAddTicketModal}) => {
    const dispatch = useAppDispatch();


    return (
        <div
            className='bg-white p-5 h-[680px] z-50 lg:w-2/5 md:w-3/5 w-full box-shadow-1 sm:rounded-lg overflow-y-auto transition-all duration-300'>
            <div className='flex flex-row justify-between items-center  w-full'>
                <div className='text-xl font-semibold'>ثبت تیکت</div>
                <div className='p-2 border-[2px] border-custom-gray-200 rounded-lg cursor-pointer'
                     onClick={(e) => setOpenAddTicketModal(false)}
                >
                    <CloseIcon color={"#737373"} width={12} height={12}/>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center w-full my-6'>
                <AddTicketForm dispatch={dispatch} setOpenAddTicketModal={setOpenAddTicketModal}/>

            </div>
        </div>
    )
}

export default AddTicketModal
