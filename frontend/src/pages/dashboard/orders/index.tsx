import EmptyData from "../../../components/empty-data/EmptyData";
import DirectSvg from "../../../components/svg/direct/DirectSvg";
import React from "react";
import DashboardLayout from "../../../layouts/dashboardLayout";
import useOrders from "../../../hooks/useOrders";
import Loading from "../../../components/loading/Loading.component";
import OrderRow from "../../../components/order-row/orderRow";
import SearchIcon from "../../../components/svg/search/searchSvg";
import CustomSelect from "../../../components/select/CustomSelect";

const MyOrders = () => {

    const {orders,isLoadingOrders,isError,error} = useOrders()

    return (
       <DashboardLayout>

           <div className="grid grid-cols-12 gap-y-6 px-4 py-3 bg-white box-shadow-1 rounded-xl mb-6 mt-4">
               <div className="lg:col-span-5 col-span-12 flex flex-row items-center lg:justify-start justify-center ">
                   <div className="relative w-full ">
                       <input
                           type="text"
                           placeholder="جستجو"
                           // value={search}
                           // onChange={debounceFn}
                           className="w-full text-black bg-custom-gray-100 border-[0.8px] border-custom-gray-200/10 py-2 pr-10 rounded-lg placeholder:text-black placeholder:font-semibold focus:outline-none"
                       />
                       <span className="absolute top-3 right-4">
                <SearchIcon color="#292D32" width={18} height={18}/>
              </span>
                   </div>
               </div>
               <div className="lg:col-span-7 col-span-12 flex flex-row items-center lg:justify-end justify-center">
                   <div className="lg:w-[320px] w-full">
                       <CustomSelect
                           // value={sortVal} handleChange={handleSortProperties}
                           options={[]} name='sort'
                           placeholder='مرتب سازی بر اساس'/>
                   </div>
               </div>
           </div>

           {
               isLoadingOrders ?
                   <>
                       <div className="col-span-12 flex flex-row justify-center items-center my-20">
                           <Loading/>
                       </div>
                   </>
                   :
                   orders.length > 0 ?
                       <div className='space-y-2'>
                           {
                               orders.length > 0 && orders.map((item: any) => (
                                   <OrderRow data={item} key={item.id}/>
                               ))
                           }
                       </div>
                       :
                       <div
                           className='col-span-12 flex flex-row justify-center items-center my-5 bg-white py-10 rounded-md'>
                           <EmptyData
                               title={<div className='text-lg font-semibold'>سفارشی یافت نشد.</div>}
                               hasButton={false}
                               Icon={() => <DirectSvg/>
                               }
                           />
                       </div>
           }
       </DashboardLayout>
    );
};

export default MyOrders;