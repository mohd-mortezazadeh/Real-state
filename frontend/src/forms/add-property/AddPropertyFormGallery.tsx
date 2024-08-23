import * as yup from 'yup'
import {withFormik} from "formik"
import {AddPropertyFormGalleryValuesInterface, AddPropertyFormInfoValuesInterface} from "../../interfaces/add-property"
import InnerAddPropertyFormGallery from "../../components/add-property/forms/innerAddPropertyFormGallery"
import {store} from "../../redux/store";
import {addProperty, editPropertyPreview} from "../../services/api/property";
import Router from "next/router";
import {reset} from "../../redux/slices/addPropertySlice";


interface AddPropertyFormGalleryProps {
    // categorySelected:string
    setLoadingAddProperty: any,
    loadingAddProperty: any,
    isEdit?: boolean,
    id?: any
}

const addPropertyFormValidationSchema = yup.object().shape({
    // gallery:yup.array().required('یک عکس شاخص انتخاب کنید')
})

const AddPropertyFormGallery = withFormik<AddPropertyFormGalleryProps, AddPropertyFormGalleryValuesInterface>({
    mapPropsToValues: props => {
        return {}
    },
    validationSchema: addPropertyFormValidationSchema,
    handleSubmit: (values, {props}) => {

        let submitCount = 0
        props.setLoadingAddProperty(true)

        if (submitCount > 0) {
            return false
        }

        let newVal: any = {};
        const value = store.getState().add_property.propertyInfo

        newVal = JSON.parse(JSON.stringify(value))

        newVal.city = newVal?.city.id
        newVal.section = newVal?.section.id
        newVal.meta.mojavez_sakht = newVal?.meta.mojavez_sakht?.name
        newVal.meta.mojavez_tejari = newVal?.meta.mojavez_tejari?.name
        newVal.villa_type = newVal?.villa_type?.id

        if (props.isEdit) {
            editPropertyPreview(newVal, props.id).then((res) => {

                Router.push(`/dashboard/my-properties/${res.id}`).then(() => {
                    props.setLoadingAddProperty(false)
                    store.dispatch(reset())
                })
            })
                .catch(() => {
                    props.setLoadingAddProperty(false)
                })
        } else {
            addProperty(newVal).then((res) => {
                Router.push(`/dashboard/my-properties/${res.id}`).then(() =>{
                    store.dispatch(reset())
                    props.setLoadingAddProperty(false)

                })
            })
                .catch(() => {
                    props.setLoadingAddProperty(false)
                })
        }
        ++submitCount

    }

})(InnerAddPropertyFormGallery)

export default AddPropertyFormGallery