
interface PersonSvgProps {
    width ?: number,
    height ?: number,
    color ?: string
}

const PersonSvg = ({width= 30 , height=30 , color = '#737373'} : PersonSvgProps) => {
    return (
        <svg width={height} height={width} viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.1229 16.7576C13.9688 16.7422 13.7838 16.7422 13.6142 16.7576C9.945 16.6343 7.03125 13.628 7.03125 9.92801C7.03125 6.15092 10.0838 3.08301 13.8763 3.08301C17.6533 3.08301 20.7212 6.15092 20.7212 9.92801C20.7058 13.628 17.7921 16.6343 14.1229 16.7576Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25.2981 6.16699C28.2889 6.16699 30.6939 8.58741 30.6939 11.5628C30.6939 14.4766 28.3814 16.8507 25.4985 16.9587C25.3752 16.9432 25.2364 16.9432 25.0977 16.9587" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.41141 22.447C2.68057 24.9445 2.68057 29.0145 6.41141 31.4966C10.651 34.3332 17.6039 34.3332 21.8435 31.4966C25.5743 28.9991 25.5743 24.9291 21.8435 22.447C17.6193 19.6257 10.6664 19.6257 6.41141 22.447Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28.2734 30.833C29.3834 30.6018 30.4318 30.1547 31.2951 29.4918C33.7001 27.688 33.7001 24.7126 31.2951 22.9088C30.4472 22.2613 29.4143 21.8297 28.3197 21.583" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default PersonSvg;