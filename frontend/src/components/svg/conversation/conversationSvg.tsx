
interface ConversationSvgProps {
    color : string ,
    width : number,
    height : number
}

const ConversationSvg = ({color , height , width} : ConversationSvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1978 21.6868H9.6331C5.11533 21.6868 2.85645 20.5573 2.85645 14.9101V9.26291C2.85645 4.74514 5.11533 2.48625 9.6331 2.48625H18.6686C23.1864 2.48625 25.4453 4.74514 25.4453 9.26291V14.9101C25.4453 19.4279 23.1864 21.6868 18.6686 21.6868H18.1039C17.7538 21.6868 17.415 21.8562 17.2004 22.1386L15.5062 24.3974C14.7608 25.3914 13.541 25.3914 12.7955 24.3974L11.1014 22.1386C10.9207 21.8901 10.5028 21.6868 10.1978 21.6868Z" stroke={color} stroke-width="1.65284" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.665 12.6512H18.6751" stroke={color} stroke-width="1.65284" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14.1454 12.6512H14.1556" stroke={color} stroke-width="1.65284" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.62688 12.6512H9.63702" stroke={color} stroke-width="1.65284" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default ConversationSvg;