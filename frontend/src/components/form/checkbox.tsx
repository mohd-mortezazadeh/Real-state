import {Field} from 'formik'
import React, {FC} from 'react'

interface CheckboxProps {
    labelClassName?: string,
    name: string,
    value?: string,
    label: string,
    togglerClassName?: string
    spanClassName?: string,
    checked?: boolean,
    onClick?: any
}

const Checkbox: FC<CheckboxProps> = ({
                                         label,
                                         labelClassName,
                                         name,
                                         value,
                                         togglerClassName,
                                         spanClassName,
                                         checked,
                                         onClick
                                     }) => {
    return (
        <>
            <label className={labelClassName ?? 'checkbox-container basis-32'}>
                <Field onClick={onClick} id={label} checked={checked} type="checkbox" name={name} value={value}/>
                <span className={togglerClassName ?? 'checkmark ml-1'}></span>
                <span className={spanClassName ?? 'text-xs font-bold'}> {label}</span>
            </label>
        </>
    )
}

export default Checkbox
