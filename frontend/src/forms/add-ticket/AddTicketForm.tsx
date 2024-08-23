import {withFormik} from "formik";
import InnerAddTicketForm from "../../components/add-ticket/form/innerAddTicketForm";
import {AddTicketValues} from "../../interfaces/add-ticket";
import * as yup from 'yup'
import {create_ticket} from "../../redux/slices/ticketSlice";


const addTicketSchema = yup.object().shape({
    title: yup.string().nullable().required('عنوان تیکت الزامی است'),
    urgency: yup.string().nullable().required('ضرورت تیکت الزامی است'),
    department: yup.string().nullable().required('موضوع تیکت الزامی است'),
    description: yup.string().nullable().required('پیام تیکت الزامی است'),
})


interface AddTicketFormProps {
    setOpenAddTicketModal: any,
    dispatch: any,
}

const AddTicketForm = withFormik<AddTicketFormProps, AddTicketValues>({
    mapPropsToValues: props => ({
        title: null,
        urgency: null,
        department: null,
        description: null,
        file: '',
        replied_to: ''
    }),
    validationSchema: addTicketSchema,
    handleSubmit: (values, {props}) => {

        props.dispatch(create_ticket(values))
            .then(()=>{
                props.setOpenAddTicketModal(false)

            })
    }
})(InnerAddTicketForm)

export default AddTicketForm