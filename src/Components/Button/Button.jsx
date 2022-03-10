import React from 'react'
import { Button as AntdButton } from "antd";
// import { HeartFilled } from '@ant-design/icons';
import './Button.scss'

export default function Button({ children, icon, style, type= 'primary', ...props }) {
    const [isHover, setIsHover] = React.useState(false);
    const onhoverobj = isHover? {...style,backgroundColor: type==='primary'? '#4cc899': '#fffff'} : style;
  return (
    <>
    <AntdButton {...props} style={onhoverobj} onMouseEnter={()=> setIsHover(true)} onMouseLeave={()=> setIsHover(false)} type={type} className='antd_button' shape="round" icon={icon} size='large'>
     {children}
    </AntdButton>
    </>
  )
}
