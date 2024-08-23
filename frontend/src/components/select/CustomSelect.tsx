import Select, {components} from 'react-select';
import {ErrorMessage} from "formik";
import {formatPhoneWithStar} from "../../utils/formatPhone";

interface CustomSelectPropsType {
    handleChange?: (value: any, action: any) => void,
    options: any[],
    value?: any,
    name: string,
    hasLabel?: boolean,
    title?: string,
    placeholder?: string,
    loading?: boolean,
    defaultValue?: any,
    clear?: boolean,
    isDisable?: boolean,
    required?: boolean,
    isRtl?: boolean,
    titleClassName?: string
}

interface colorStylesPropsType {
    control: (arg: any) => {},
    option: (arg: any, {isDisabled, isFocused, isSelected}: any) => {},
    placeholder: (arg: any) => {},
    menuPortal: (base: any) => any,
}

const CustomSelect = ({
                          handleChange,
                          options,
                          value,
                          name,
                          hasLabel = false,
                          title,
                          placeholder,
                          loading,
                          defaultValue,
                          clear = true,
                          isDisable = false,
                          isRtl = true,
                          required,
                          titleClassName
                      }: CustomSelectPropsType) => {

    const colourStyles: colorStylesPropsType = {

        control: styles => ({
            ...styles, padding: '2px 0',
            borderRadius: '12px',
            border: '1px solid rgb(115 115 115 / 0.2)',
            color: ''

        }),
        option: (styles, {isDisabled, isFocused, isSelected}) => {
            return {
                ...styles,
                overFlow: 'scroll',
                fontSize: '13px'
            }
        },
        placeholder: (defaultStyles) => {
            return {
                ...defaultStyles,
                color: '#a9a9a9',
                fontSize: '13px'
            }
        },
        menuPortal: base => ({...base, zIndex: 9999})
    };

    const NoOptionsMessage = (props: any) => {
        return (
            <components.NoOptionsMessage {...props}>
                <span className="text-sm">اطلاعاتی یافت نشد</span>
            </components.NoOptionsMessage>
        );
    };
    return (
        <div className='flex flex-col gap-y-3 flex-1'>
            {
                hasLabel &&
                <label className={`text-text font-semibold ${titleClassName}`}>{title}</label>
            }

            <Select
                className="basic-single flex-1 "
                classNamePrefix="select"
                maxMenuHeight={250}
                components={{NoOptionsMessage}}
                isDisabled={isDisable}
                onChange={handleChange}
                isClearable={clear}
                isRtl={true}
                required={required}
                isSearchable={true}
                name={name}
                defaultValue={defaultValue}
                menuPosition={'fixed'}
                // value={
                //     name === 'section' && options.length > 0 ?
                //         {name: options[0].name, slug: options[0].slug}
                //         :
                //         value
                // }
                value={value}
                options={options}
                styles={colourStyles}
                placeholder={placeholder}
                getOptionLabel={(option: any) => {
                    if (name === 'company_name' || name === 'company') {
                        return <span>{option.name}<br/>{formatPhoneWithStar(option.phone)}</span>
                    }
                    if (name === 'category') {
                        return option.display_name
                    } else {
                        return option.name
                    }
                }}
                getOptionValue={(option: any) => {
                    if (name === 'category') {
                        return option.name
                    }else if(name === 'company'){
                        return option.name
                    }
                    else {
                        return option.slug
                    }
                }}
                isLoading={loading}

            />

        </div>

    );
};

export default CustomSelect;