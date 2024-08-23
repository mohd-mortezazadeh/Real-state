import {Form, FormikProps} from "formik";

import {AddPropertyFormInfoValuesInterface} from "../../../interfaces/add-property";

import UploadPrimaryImage from "../components/UploadPrimaryImage";
import ArrowLeftSvg from "../../svg/arrows/arrow-left/ArrowLeftSvg";
import UploadGalleryImages from "../components/UploadGalleryImages";
import {useAppDispatch} from "../../../hooks/useRedux";
import {prevPage} from "../../../redux/slices/addPropertySlice";
import Button from "../../button/button";


const InnerAddPropertyFormGallery = (props: any) => {

    const dispatch = useAppDispatch()

    const handlePrevPage = () => {
        dispatch(prevPage())
    }

    return (
        <Form className='space-y-6 w-full'>

            {/* upload image section */}
            <section className="mx-auto">

                {/* upload image wrapper */}
                <div className=' bg-white box-shadow-1 p-10 rounded-lg'>

                    {/* primary image title */}
                    <div className="text-base font-medium text-text pb-4">آپلود عکس شاخص</div>

                    {/* primary image  */}
                    <UploadPrimaryImage  handleChange={props.setFieldValue}/>

                    {/* gallery title */}
                    <div className="text-base font-medium text-text pt-20 pb-4">آپلود عکس های تکمیلی</div>


                    {/* gallery */}
                    <UploadGalleryImages/>

                </div>


                {/* prev next */}
                <div className="w-full flex flex-row justify-between items-center pt-20">
                    <Button loading={props.loadingAddProperty} title='ثبت نهایی'/>
                    <div className="flex flex-row justify-center gap-x-3">
                        <button type="button" onClick={handlePrevPage}>مرحله قبلی</button>
                        <ArrowLeftSvg width={18} height={18} color="#ccc"/>

                    </div>
                </div>

            </section>
        </Form>
    )
}


export default InnerAddPropertyFormGallery;