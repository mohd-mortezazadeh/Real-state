import React, {FC} from 'react'
import Checkbox from '../../form/checkbox'
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux";
import {handleRemoveOption, selectPropertyInfo} from "../../../redux/slices/addPropertySlice";


interface OptionsProps {
    options: any,
    selectOptions: number[]
}

const Options: FC<OptionsProps> = ({options, selectOptions}) => {

    const dispatch = useAppDispatch()
    const propertyInfo = useAppSelector(selectPropertyInfo)
    const handleDeleteOption = (id : number) => {

        dispatch(handleRemoveOption(id))
    }

    return (
        <>
            {
                options.map((item: any) => (
                    selectOptions?.map(Number).includes(item.id) ?
                        <Checkbox onClick={()=>handleDeleteOption(item.id)} checked={true} key={item.id} name='options' label={item.display_name}
                                  value={item.id}/>
                        :
                        <Checkbox onClick={()=>handleDeleteOption(item.id)} checked={false} key={item.id} name='options' label={item.display_name} value={item.id}/>

                ))
            }


        </>
    )
}

export {Options}
