
interface MenuIconPropsType {
    color : string
}

const MenuIcon = ({color} :MenuIconPropsType ) => {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 7.5H21.5" stroke={color} stroke-width="1.5" stroke-linecap="round"/>
            <path d="M3.5 12.5H21.5" stroke={color} stroke-width="1.5" stroke-linecap="round"/>
            <path d="M3.5 17.5H21.5" stroke={color} stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    );
};

export default MenuIcon;