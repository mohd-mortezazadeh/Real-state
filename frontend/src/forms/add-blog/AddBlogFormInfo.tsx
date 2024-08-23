import { withFormik } from "formik"
import InnerAddBlogFormInfo from "../../components/add-blog/form/innerAddBlogFormInfo"
import { AddBlogFormInfoValues } from "../../interfaces/add-blog"
import * as yup from 'yup'
import {createArticle, editArticle} from "../../services/api/article";
import Router from "next/router";
import toast from "react-hot-toast";

export interface AddBlogFormInfoProps{
    setOpenModal: any,
    media : any,
    isEdit ?:any,
    blogEditId?:any,
    blogEditData?:any,
    setBlogEditData?:any
}

const addBlogFormInfoValidation = yup.object().shape({
    title:yup.string().required('عنوان بلاگ الزامی است').min(4,'حداقل 4 کاراکتر وارد شود'),
    content:yup.string().required('توضیحات الزامی است').min(10,'حداقل 10 کاراکتر وارد شود')
})

const AddBlogFormInfo = withFormik<AddBlogFormInfoProps, AddBlogFormInfoValues>({
    mapPropsToValues:props=>({
        title:props.isEdit ? props.blogEditData?.title  : '',
        content: props.isEdit ? props.blogEditData?.content  : '',
        media : props.isEdit ? props.blogEditData?.media?.map((item : any)=>item.id) : []
    }),
    validationSchema:addBlogFormInfoValidation,
    enableReinitialize : true,
    handleSubmit:(values,{props}) => {


        values.media = props.media

        if(props.isEdit){
            editArticle(values , props.blogEditId)
                .then((res)=>{
                    Router.push('/panel/blog')
                    props.setOpenModal(false)
                })

        }else{
            if(!values.media[0]){
                toast.error("آپلود عکس اجباری میباشد.")

            }else{
                createArticle(values)
                    .then((res)=>{
                        Router.push('/panel/blog')
                        props.setOpenModal(false)
                    })
            }

        }


    }
})(InnerAddBlogFormInfo)

export default AddBlogFormInfo