import {FC, useRef, useState} from "react";
import {ErrorMessage, Field} from "formik";
import OpenEye from "../svg/eyes/openEye";
import CloseEye from "../svg/eyes/closeEye";
import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import {VscRefresh} from "react-icons/vsc"
import {useDispatch} from "react-redux";
import {auth_phone, userTypes, userPhone, userInfo} from "../../redux/slices/authSlice";
import {useAppSelector} from "../../hooks/useRedux";
import {useAppDispatch} from "../../hooks/useRedux";
import {auth_info} from "../../redux/slices/authSlice";

interface InputPropsType {
    name: string,
    type: string,
    inputClassName?: string,
    errorClassName?: string,
    labelClassName?: string,
    placeHolder?: string,
    label?: string,
    showPass?: boolean,
    handleChangeShowPass?: () => void,
    isPassword?: boolean,
    isTimer?: boolean,
    disabled?: boolean,
    as?: string,
    rows?: number,
    defaultValue?: any,
    value?: any,
    required?:boolean
}

const Input: FC<InputPropsType> = ({
                                       name,
                                       type,
                                       inputClassName,
                                       errorClassName,
                                       labelClassName,
                                       placeHolder,
                                       label,
                                       showPass,
                                       handleChangeShowPass,
                                       isPassword,
                                       isTimer,
                                       disabled = false,
                                       as,
                                       rows,
                                       defaultValue,
                                       value,
                                       required
                                   }) => {

    const [timeFinish, setTimeFinish] = useState(false)

    const dispatch = useAppDispatch()
    const phone = useAppSelector(userPhone)
    const user_info = useAppSelector(userInfo)
    const user_Types = useAppSelector(userTypes)


    const handleRefreshCode = () => {
        if (user_Types.is_loggin) {
            dispatch(auth_phone({
                phone
            }))
        } else {
            dispatch(auth_info({
                ...user_info
            }))
        }

        setTimeFinish(false)
    }

    return (
        <>
            <div className='space-y-3 relative'>
                {label && <label className={labelClassName} htmlFor={name}>
                    {label}
                </label>}
                <div className={`relative ${isTimer && 'flex pl-1 gap-x-4 items-center rounded-xl'} `}>
                    <Field name={name}
                           defaultValue={defaultValue}
                           as={as}
                           required={required}
                           value={value}
                           autoComplete={'off'}
                           rows={rows}
                           disabled={disabled}
                           min={0}
                           max={100000000000000}
                           onWheel={(e: any) => e.target.blur()}
                           className={`w-full flex-1 rounded-xl border border-custom-gray-200/20 ${isTimer ? 'focus:outline-0 ' : ' focus:outline-primary'} p-3  placeholder:text-xs ${inputClassName}`}
                           placeholder={placeHolder} type={`${showPass ? 'text' : type}`}/>
                    {
                        isPassword &&
                        <button type='button' onClick={handleChangeShowPass}
                                className='absolute top-1/2 -translate-y-1/2 left-4'>
                            {
                                showPass ? <OpenEye/> : <CloseEye/>
                            }
                        </button>
                    }

                    {
                        timeFinish ?
                            <div className='cursor-pointer' onClick={handleRefreshCode}>
                                <VscRefresh className='w-7 h-7 text-primary'/>
                            </div>
                            :
                            <>
                                {
                                    isTimer &&
                                    <CountdownCircleTimer
                                        isPlaying
                                        duration={120}
                                        strokeWidth={3}
                                        size={40}
                                        colors={["#1a77f3", "#76b1ff"]}
                                        colorsTime={[60, 0]}
                                        onComplete={() => setTimeFinish(true)}
                                    >
                                        {RenderTime}
                                    </CountdownCircleTimer>
                                }
                            </>
                    }
                </div>
                <ErrorMessage name={name} className={`text-red-500 text-sm ${errorClassName}`} component='div'/>


            </div>
        </>
    );
};

export default Input;


const RenderTime = ({remainingTime}: any) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef(null);
    const isNewTimeFirstTick = useRef(false);
    const [, setOneLastRerender] = useState(0);

    if (currentTime.current !== remainingTime) {
        isNewTimeFirstTick.current = true;
        prevTime.current = currentTime.current;
        currentTime.current = remainingTime;
    } else {
        isNewTimeFirstTick.current = false;
    }

    // force one last re-render when the time is over to tirgger the last animation
    if (remainingTime === 0) {
        setTimeout(() => {
            setOneLastRerender((val) => val + 1);
        }, 20);
    }

    const isTimeUp = isNewTimeFirstTick.current;

    return (
        <div className="time-wrapper">
            <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
                {remainingTime}
            </div>
            {prevTime.current !== null && (
                <div
                    key={prevTime.current}
                    className={`time ${!isTimeUp ? "down" : ""}`}
                >
                    {prevTime.current}
                </div>
            )}
        </div>
    );
};
