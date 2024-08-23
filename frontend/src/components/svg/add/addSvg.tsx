
interface AddIconPropsType {
    color : string
}

const AddIcon = ({color} : AddIconPropsType) => {
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.9995 2.5H7.99951C3.99951 2.5 1.99951 4.5 1.99951 8.5V21.5C1.99951 22.05 2.44951 22.5 2.99951 22.5H15.9995C19.9995 22.5 21.9995 20.5 21.9995 16.5V8.5C21.9995 4.5 19.9995 2.5 15.9995 2.5Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.49951 12.5H15.4995" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.9995 16V9" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};

export default AddIcon;