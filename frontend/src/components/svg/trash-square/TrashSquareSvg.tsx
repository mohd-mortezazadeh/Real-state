import React,{FC} from 'react'

interface TrashSquareSvgProps{
  height?:number,
  width?:number
}

const TrashSquareSvg:FC<TrashSquareSvgProps> = ({
  height = 37,
  width =37
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.8737 33.9167H23.1237C30.832 33.9167 33.9154 30.8334 33.9154 23.125V13.875C33.9154 6.16671 30.832 3.08337 23.1237 3.08337H13.8737C6.16536 3.08337 3.08203 6.16671 3.08203 13.875V23.125C3.08203 30.8334 6.16536 33.9167 13.8737 33.9167Z" fill="#FA3737" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M27.594 13.9521C24.2332 13.6129 20.8415 13.4434 17.4653 13.4434C15.4611 13.4434 13.4569 13.5513 11.4682 13.7517L9.40234 13.9521" fill="#FA3737"/>
        <path d="M27.594 13.9521C24.2332 13.6129 20.8415 13.4434 17.4653 13.4434C15.4611 13.4434 13.4569 13.5513 11.4682 13.7517L9.40234 13.9521" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.9688 12.9346L15.1846 11.6088C15.3387 10.6529 15.4621 9.92834 17.1733 9.92834H19.825C21.5362 9.92834 21.6596 10.6838 21.8137 11.6088L22.0296 12.9192" fill="#FA3737"/>
        <path d="M14.9688 12.9346L15.1846 11.6088C15.3387 10.6529 15.4621 9.92834 17.1733 9.92834H19.825C21.5362 9.92834 21.6596 10.6838 21.8137 11.6088L22.0296 12.9192" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M25.4221 14.0754L24.7592 24.2504C24.6512 25.8383 24.5588 27.0717 21.7375 27.0717H15.2471C12.4258 27.0717 12.3333 25.8383 12.2254 24.2504L11.5625 14.0754" fill="#FA3737"/>
        <path d="M25.4221 14.0754L24.7592 24.2504C24.6512 25.8383 24.5588 27.0717 21.7375 27.0717H15.2471C12.4258 27.0717 12.3333 25.8383 12.2254 24.2504L11.5625 14.0754" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}

export default TrashSquareSvg
