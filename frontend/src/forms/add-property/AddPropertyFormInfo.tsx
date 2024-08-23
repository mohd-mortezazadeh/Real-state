import InnerAddPropertyFormInfo from "../../components/add-property/forms/InnerAddPropertyFormInfo"
import * as yup from 'yup'
import {withFormik} from "formik"
import {AddPropertyFormInfoValuesInterface} from "../../interfaces/add-property"
import {ThunkDispatch} from "redux-thunk";
import {handlePropertyInfo, nextPage} from "../../redux/slices/addPropertySlice";
import {scrollToTop} from "../../utils/scrollToTop";
import {store} from "../../redux/store";


interface AddPropertyFormProps {
    // categorySelected:string
    dispatch: ThunkDispatch<any, any, any>,
    isEdit?: boolean
}

const addPropertyFormValidationSchema = yup.object().shape({
    city: yup.object({
        id: yup.number().nullable().required('شهر خود را انتخاب کنید'),
        name: yup.string().nullable().required('شهر خود را انتخاب کنید'),
        slug: yup.string().nullable().required('شهر خود را انتخاب کنید'),
    }).nullable().required('شهر خود را انتخاب کنید'),
    section: yup.object({
        id: yup.number().nullable().required('محله خود را انتخاب کنید'),
        name: yup.string().nullable().required('محله خود را انتخاب کنید'),
        slug: yup.string().nullable().required('محله خود را انتخاب کنید'),
    }).nullable().required('محله خود را انتخاب کنید'),
    category: yup.string().nullable(),
    meta: yup.object({
        category: yup.string().nullable(),
        area: yup.number().nullable().when("category",
            {
                is: (category: any) => category == 1 || category == 5,
                then: (s) => s.required('زیر بنا را وارد کنید'),

            }),


        zamin_area: yup.number().nullable().when("category", {
            is: (category: any) => category == 6 || category == 3 || category == 2 || category == 4,
            then: (s) => s.required('متراژ زمین را وارد کنید')
        }),


        tejari_area: yup.number().nullable(),
        bedrooms: yup.number().nullable().min(1, 'تعداد خواب نباید کمتر از 1 باشد'),
        age: yup.number().nullable(),
        numberOfFloors: yup.number().nullable().min(1, 'نباید کمتر از یک  باشد').when("category", {
            is: (value: any) => value == 1,
            then: (s) => s.required('تعداد طبقات را وارد کنید')
        }),
        floor: yup.number().nullable().min(1, 'نباید کمتر از یک  باشد')
            .max(yup.ref('numberOfFloors'), ' طبقه باید کمتر از تعداد طبقه باشد')
            .when("category", {
                is: (value: any) => value == 1,
                then: (s) => s.required('طبقه مورد نظر را وارد کنید')
            }),
        // mojavez_sakht: yup.string().nullable(),
        // mojavez_tejari: yup.string().nullable(),
        height: yup.number().nullable(),
        asle: yup.number().nullable(),
        lat_path : yup.number().nullable(),
        lng_path : yup.number().nullable(),
    }),
    title: yup.string().trim().nullable().required('عنوان آگهی الزامی است').matches(/^[a-zA-Z0-9آ-ی]/, 'عنوان باید با حروف یا اعداد شروع شود').min(5, 'حداقل تعداد کاراکتر 5').max(35, "حداکثر تعداد کاراکتر 35"),
    home_phone: yup.string().nullable().matches(/^[0-9]+$/, "شماره تماس باید فقط حاوی اعداد باشد").min(11, 'شماره باید 11 رقمی باشد').max(11, 'حداکثر تعداد ارقام 11 رقم'),
    description: yup.string().trim().nullable().required("توضیحات آگهی الزامی است").min(10, 'حداقل تعداد کاراکتر 10'),
    price: yup.string().nullable().when('tavafoghi', {
        is: true,
        otherwise: (s) => s.required('قیمت را وارد کنید'),
    }),
    tavafoghi: yup.boolean()
})

const AddPropertyFormInfo = withFormik<AddPropertyFormProps, AddPropertyFormInfoValuesInterface>({
    mapPropsToValues: props => {
        return store.getState().add_property.propertyInfo
    },

    validationSchema: addPropertyFormValidationSchema,
    // enableReinitialize: true,
    handleSubmit: (values, {props}) => {
        console.log(values)
        // values.options = store.getState().add_property.propertyInfo.options
        let newVal: any = JSON.parse(JSON.stringify(values))
        newVal.options = store.getState().add_property.propertyInfo.options
        newVal.options = newVal.options.map(Number)


        for (let item in newVal.meta) {

            if (newVal.meta[item] === null) {
                delete newVal.meta[item];
            }
        }

        if(newVal.tavafoghi){
            newVal.price = 0
        }
        // newVal.category = newVal.meta.category
        if (newVal.price === null) {
            newVal.price = 0
        }

        Object.keys(newVal.meta).forEach((key: any) => {
            if (!newVal.meta[key]) {
                delete newVal.meta[key]
            }
        })


        props.dispatch(handlePropertyInfo(newVal))
        setTimeout(() => {
            scrollToTop()
        }, 300)
        props.dispatch(nextPage())
    }

})(InnerAddPropertyFormInfo)

export default AddPropertyFormInfo