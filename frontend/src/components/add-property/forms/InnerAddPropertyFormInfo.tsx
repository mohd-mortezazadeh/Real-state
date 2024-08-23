import {useState, useEffect, useMemo} from 'react'

import {ErrorMessage, Field, Form, FormikProps, useFormikContext} from "formik";

import useCategories from "../../../hooks/useCategories";
import useSections from "../../../hooks/useSections";

import Input from "../../form/input";
import CustomSelect from "../../select/CustomSelect";
import {Options} from "../property-options/Options";
import ArrowDownSvg from "../../svg/arrows/arrow-down/arrowDownSvg";
import ArrowLeftSvg from "../../svg/arrows/arrow-left/ArrowLeftSvg";
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux";
import {
    handleName,
    nextPage,
    prevPage, reset, resetDataCategoryChange, selectDisplayNameProperty, selectIdProperty,
    selectNameProperty, selectPropertyInfo,
} from "../../../redux/slices/addPropertySlice";
import {useOptionss} from "../../../hooks/useOptionss";
import useCitiesByCategory from "../../../hooks/useCitiesByCategory";
import {addCommas, numberToWords} from "@persian-tools/persian-tools";
import {wordifyfa, wordifyRialsInTomans} from "../../../utils/wordifyfa";
import {NumericFormat} from 'react-number-format';
import MapComponent from "../../map/Map.component";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../map/Map.component"), {ssr: false});


const mojavez = [
    {
        id: 1,
        name: 'دارد',
        slug: 'دارد'
    },
    {
        id: 2,
        name: 'ندارد',
        slug: 'ندارد'
    },
]

const vilaList = [
    {
        id: 1,
        name: 'جنگلی',
        slug: 'جنگلی'
    },
    {
        id: 2,
        name: 'مسکونی',
        slug: 'مسکونی'
    },
    {
        id: 3,
        name: 'ساحلی',
        slug: 'ساحلی'
    }
]


const InnerAddPropertyFormInfo = (props: any) => {
    const [position, setPosition] = useState<any>([36.47920691190865, 52.11802482604981])
    const dispatch = useAppDispatch()
    const name = useAppSelector(selectNameProperty)
    const display_name = useAppSelector(selectDisplayNameProperty)
    const id = useAppSelector(selectIdProperty)
    const propertyState = useAppSelector(selectPropertyInfo)

    const {cities} = useCitiesByCategory(id)
    const [cityId, setCityId] = useState<any>(props?.values?.city?.id)
    const {categories, isLoadingCategories} = useCategories()

    const {options, isLoadingOptions} = useOptionss(id!)


    const {sections, isLoadingSections} = useSections(cityId)


    const [tavafoghi, setTavafoghi] = useState<boolean>(false)

    const [openAccordion, setOpenAccordion] = useState<any>({
        location: true,
        generalInfo: true,
        options: true,
        completedInfo: true
    })


    const numberFormatter = Intl.NumberFormat('en-US')

    useEffect(() => {
        setPosition([+props?.values?.city?.lat_path, +props?.values?.city?.lng_path])
    }, [props.values.city])

    const handleNextPage = () => {
        dispatch(nextPage())
    }
    const handlePrevPage = () => {
        dispatch(prevPage())
        dispatch(reset())
    }

    useEffect(() => {
        props.setFieldValue('meta.category', id)
    }, [id])


    useEffect(() => {
        if (+props.values.price! > 1000000000000) {
            props.setFieldValue("price", '')
        }
    }, [+props.values.price!])

    useEffect(() => {
        if (+props.values.price === 0 && props.isEdit) {
            setTavafoghi(true)
            props.setFieldValue(props.setFieldValue("tavafoghi", true))
        }
    }, [tavafoghi])


    //set lang lat from map
    const handleSetLangLat = (latlang: any) => {
        // console.log(latlang)
        setPosition([latlang[0], latlang[1]])
        props.setFieldValue('lat_path', latlang[0])
        props.setFieldValue('lng_path', latlang[1])

    }

    useEffect(() => {
        props.setFieldValue('lat_path', position[0])
        props.setFieldValue('lng_path', position[1])

    }, [position])

    //get lat lng from formik in edit mode
    useEffect(() => {
        if (props.isEdit) {
            setPosition([props.values.lat_path, props.values.lng_path])
        }
    }, [])
    // console.log(props)
    return (
        <Form className='space-y-6 w-full'>
            <ScrollToFieldError/>
            {/* city location */}
            <div className='flex flex-col w-full bg-white rounded-2xl overflow-y-hidden box-shadow-1'>
                <div className='bg-primary/10 flex flex-row justify-between items-center px-7 py-4 hover:cursor-pointer'
                     onClick={(e) => setOpenAccordion({...openAccordion, location: !openAccordion.location})}
                >
                    <span className='text-xl text-primary font-semibold'>موقعیت مکانی</span>
                    <span className={`${openAccordion.location ? 'rotate-0' : 'rotate-180'} transition`}>
                        <ArrowDownSvg rectFill=''/>
                    </span>
                </div>
                <div
                    className={`${openAccordion.location ? 'h-auto p-8 ' : 'h-0 overflow-hidden'} flex flex-col space-y-10`}>
                    <div className='flex md:flex-row flex-col gap-7'>
                        <div className='flex flex-col w-full space-y-2'>
                            <label>
                                <span>شهر</span>
                                <span className='text-custom-red'>*</span>
                            </label>

                            <CustomSelect name="city" options={cities} hasLabel={false}

                                          placeholder="شهر خود را انتخاب کنید"
                                          value={props.values.city}
                                // defaultValue={props.values.city}
                                          handleChange={value => {

                                              props.setFieldValue('city', value)
                                              props.setFieldValue('section', null)

                                              setCityId(value?.id)
                                          }}
                            />

                            <ErrorMessage name='city' className={`text-red-500 text-sm`} component='div'/>


                        </div>
                        <div className='flex flex-col w-full space-y-2'>
                            <label>
                                <span>محله</span>
                                <span className='text-custom-red'>*</span>
                            </label>
                            <CustomSelect placeholder={'محله را انتخاب کنید'} hasLabel={false} name='section'
                                          loading={isLoadingSections}
                                          options={sections}

                                          value={cityId ? props.values.section : null}
                                // defaultValue={props.values.section}
                                          handleChange={value => {
                                              props.setFieldValue('section', value)
                                          }}

                            />
                            <ErrorMessage name='section' className={`text-red-500 text-sm`} component='div'/>


                        </div>


                    </div>

                    {
                        props.values.city && position[0] ? <div className='flex flex-col space-y-5'>
                                <label>نقشه</label>
                                <figure className='overflow-hidden rounded-lg'>
                                    <Map position={position} lat={props.values.lat_path} lng={props.values.lng_path}
                                         handleSetLangLat={handleSetLangLat}/>
                                </figure>
                            </div>
                            : ''
                    }
                </div>
            </div>


            {/* general info */}
            <div className='flex flex-col w-full bg-white rounded-2xl overflow-y-hidden box-shadow-1'>
                <div className='bg-primary/10 flex flex-row justify-between items-center px-7 py-4 hover:cursor-pointer'
                     onClick={(e) => setOpenAccordion({...openAccordion, generalInfo: !openAccordion.generalInfo})}
                >
                    <span className='text-xl text-primary font-semibold'>اطلاعات کلی</span>
                    <span className={`${openAccordion.generalInfo ? 'rotate-0' : 'rotate-180'} transition`}>
                        <ArrowDownSvg rectFill=''/>
                    </span>
                </div>
                <div
                    className={`${openAccordion.generalInfo ? 'h-auto p-8 ' : 'h-0 overflow-hidden'} flex flex-col space-y-10`}>
                    <div className='grid grid-cols-12  gap-x-5 gap-y-6 '>
                        <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                            <label>نوع ملک</label>
                            <CustomSelect name="category" isDisable={true} options={categories} hasLabel={false}
                                          placeholder="نوع ملک را انتخاب کنید"
                                          loading={isLoadingCategories}
                                          defaultValue={{name: name, display_name: display_name, id}}
                                          clear={false}
                                          handleChange={value => {
                                              props.setFieldValue('meta.category', value?.id);
                                              dispatch(handleName({
                                                  name: value?.name,
                                                  id: value?.id
                                              }))
                                              if (props.values.meta) {
                                                  props.setFieldValue("meta", {
                                                      category: null,
                                                      area: null,
                                                      zamin_area: null,
                                                      tejari_area: null,
                                                      mojavez_sakht: null,
                                                      mojavez_tejari: null,
                                                      height: null,
                                                      asle: null,
                                                      bedrooms: null,
                                                      age: null,
                                                      numberOfFloors: null,
                                                      floor: null,
                                                  })
                                              }
                                              if (props.values.options) {
                                                  props.setFieldValue('options', [])
                                              }

                                              resetDataCategoryChange()
                                          }}
                            />
                            <ErrorMessage name='meta.category' className={`text-red-500 text-sm`} component='div'/>


                        </div>
                        {/*{*/}
                        {/*    name === "villa" ?*/}
                        {/*        <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>*/}
                        {/*            <label>نوع ویلا</label>*/}
                        {/*            <CustomSelect name="category_meta" options={vilaList} hasLabel={false}*/}
                        {/*                          placeholder="نوع ویلا را انتخاب کنید"*/}
                        {/*                          loading={isLoadingCategories}*/}

                        {/*                          handleChange={value => {*/}
                        {/*                              props.setFieldValue('villa_type', value)*/}
                        {/*                          }}*/}
                        {/*            />*/}

                        {/*        </div>*/}
                        {/*        :*/}
                        {/*        null*/}

                        {/*}*/}
                        {
                            (name === "aparteman" || name === "villa-shahraki" || name === "villa-saheli" || name === "villa-jangali" || name === "khane-villaii" || name === "tejari") ?
                                <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                    <label>
                                        <span>زیربنا</span>
                                        {(name === "aparteman" || name === "tejari") &&
                                            <span className='text-custom-red'>*</span>}
                                    </label>
                                    <Input type='number' name='meta.area'
                                           defaultValue={props.values.meta.area}

                                           placeHolder='زیربنا موردنظر را وارد کنید (متر مربع) '/>

                                </div>
                                :
                                null
                        }

                        {
                            (name === "aparteman" || name === "khane-villaii" || name === "villa-shahraki" || name === "villa-saheli" || name === "villa-jangali") ?
                                <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                    <Input type='number' name='meta.bedrooms'
                                           defaultValue={props.values.meta.bedrooms}
                                           label='تعداد خواب'
                                           placeHolder='تعداد خواب مورد نظر را وارد کنید'/>
                                </div>
                                :
                                null
                        }

                        {
                            (name === "aparteman" || name === "khane-villaii" || name === "villa-shahraki" || name === "villa-saheli" || name === "villa-jangali" || name === "tejari") ?

                                <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                    <Input type='number' name='meta.age' label='سن بنا'
                                           defaultValue={props.values.meta.age}
                                           placeHolder='سن بنا مورد نظر را وارد کنید'/>
                                </div>
                                :
                                null
                        }
                        {
                            (name === "aparteman" || name === "khane-villaii") ?

                                <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                    <label>
                                        <span>تعداد طبقات</span>
                                        {(name === "aparteman") && <span className='text-custom-red'>*</span>}
                                    </label>
                                    <Input type='number' name='meta.numberOfFloors'
                                           defaultValue={props.values.meta.numberOfFloors}

                                           placeHolder='تعداد طبقات مورد نظر را وارد کنید'/>
                                </div>
                                :
                                null
                        }
                        {
                            name === "aparteman" ?
                                <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                    <label>
                                        <span> طبقه</span>
                                        {(name === "aparteman") && <span className='text-custom-red'>*</span>}
                                    </label>
                                    <Input type='number' name='meta.floor'

                                           defaultValue={props.values.meta.floor}
                                           placeHolder='طبقه مورد نظر را وارد کنید'/>
                                </div>
                                :
                                null
                        }
                        {
                            (name === "khane-villaii" || name === "villa-shahraki" || name === "villa-saheli" || name === "villa-jangali" || name === "zamin" || name === "tejari" || name === "bagh")
                                ?
                                <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                    <label>

                                        <span>متراژ زمین</span>
                                        {(name === "khane-villaii" || name === "villa-shahraki" || name === "villa-saheli" || name === "villa-jangali" || name === "zamin" || name === "bagh") &&
                                            <span className='text-custom-red'>*</span>}

                                    </label>
                                    <Input type='number' name='meta.zamin_area'
                                           defaultValue={props.values.meta.zamin_area}

                                           placeHolder='متراژ زمین موردنظر را وارد کنید (متر مربع) '/>
                                </div>
                                :
                                null
                        }
                        {
                            (name === "tejari")
                                ?
                                <>
                                    <div className='flex flex-col md:col-span-6 col-span-12 w-full'>
                                        <label>متراژ تجاری</label>
                                        <Input type='number'
                                               defaultValue={props.values.meta.tejari_area}
                                               name='meta.tejari_area'
                                               placeHolder='متراژ تجاری موردنظر را وارد کنید (متر مربع) '/>

                                    </div>

                                    <div className='flex flex-col md:col-span-6 col-span-12 w-full'>
                                        <label>ارتفاع</label>
                                        <Input type='number'

                                               defaultValue={props.values.meta.height}
                                               name='meta.height'
                                               placeHolder='ارتفاع مورد نظر را وارد کنید '/>

                                    </div>
                                </>
                                :
                                null

                        }
                        {
                            (name === "zamin" || name === "bagh")
                                ?
                                <>
                                    <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                        <label>مجوز ساخت</label>
                                        <CustomSelect name="meta.mojavez_sakht" options={mojavez} hasLabel={false}
                                                      placeholder="مجوز ساخت را انتخاب کنید"
                                                      loading={isLoadingCategories}
                                                      defaultValue={props.values.meta.mojavez_sakht}
                                                      handleChange={value => {
                                                          props.setFieldValue('meta.mojavez_sakht', value)
                                                      }}
                                        />

                                    </div>
                                    <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                        <label>مجوز تجاری</label>
                                        <CustomSelect name="meta.mojavez_tejari" options={mojavez} hasLabel={false}
                                                      placeholder="مجوز تجاری را انتخاب کنید"
                                                      loading={isLoadingCategories}
                                                      defaultValue={props.values.meta.mojavez_tejari}
                                                      handleChange={value => {
                                                          props.setFieldValue('meta.mojavez_tejari', value)
                                                      }}
                                        />

                                    </div>

                                </>
                                :
                                null
                        }
                        {
                            name === "bagh"
                                ?

                                <div key='asle' className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                                    <label>تعداد اصله</label>
                                    <Input type='number' name='meta.asle'
                                           defaultValue={props.values.meta.asle}

                                           placeHolder='تعداد اصله موردنظر را وارد کنید '/>
                                </div>
                                :
                                null
                        }


                    </div>

                </div>
            </div>


            {/* options */}
            <div className='flex flex-col w-full bg-white rounded-2xl overflow-y-hidden box-shadow-1'>
                <div className='bg-primary/10 flex flex-row justify-between items-center px-7 py-4 hover:cursor-pointer'
                     onClick={(e) => setOpenAccordion({...openAccordion, options: !openAccordion.options})}
                >
                    <span className='text-xl text-primary font-semibold'>امکانات رفاهی</span>
                    <span className={`${openAccordion.options ? 'rotate-0' : 'rotate-180'} transition`}>
                        <ArrowDownSvg rectFill=''/>
                    </span>
                </div>
                <div
                    className={`${openAccordion.options ? 'h-auto p-8 ' : 'h-0 overflow-hidden'} flex flex-col space-y-10`}>
                    <div className='flex flex-row items-start justify-start flex-wrap  gap-y-9 gap-x-10'>
                        <Options selectOptions={propertyState.options} options={options}/>
                    </div>

                </div>
            </div>


            {/* completed info */}
            <div className='flex flex-col w-full bg-white rounded-2xl overflow-y-hidden box-shadow-1'>
                <div className='bg-primary/10 flex flex-row justify-between items-center px-7 py-4 hover:cursor-pointer'
                     onClick={(e) => setOpenAccordion({...openAccordion, completedInfo: !openAccordion.completedInfo})}
                >
                    <span className='text-xl text-primary font-semibold'>اطلاعات تکمیلی</span>
                    <span className={`${openAccordion.completedInfo ? 'rotate-0' : 'rotate-180'} transition`}>
                        <ArrowDownSvg rectFill=''/>
                    </span>
                </div>
                <div
                    className={`${openAccordion.completedInfo ? 'h-auto p-8 ' : 'h-0 overflow-hidden'} flex flex-col space-y-10`}>
                    <div className='flex md:flex-row flex-col items-start justify-start gap-x-5 gap-y-5'>
                        <div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>
                            <label>
                                <span> عنوان</span>
                                <span className='text-custom-red'>*</span>
                            </label>
                            <Input type='text' name='title' defaultValue={props.values.title}
                                   placeHolder='مثال آپارتمان ....'/>
                        </div>
                        {/*<div className='flex flex-col md:col-span-6 col-span-12 w-full space-y-3'>*/}
                        {/*    <Input type='text'*/}
                        {/*           defaultValue={props.values.home_phone}*/}

                        {/*           name='home_phone' label='شماره تلفن ثابت'*/}
                        {/*           placeHolder='شماره تلفن ثابت مورد نظر را وارد کنید'/>*/}
                        {/*</div>*/}
                    </div>
                    <div className='flex md:flex-row flex-col items-center justify-start  gap-7'>

                        <div className='flex flex-col md:col-span-6 col-span-12 mb-20 w-full space-y-3'>
                            <label>
                                <span>توضیحات</span>
                                <span className='text-custom-red'>*</span>
                            </label>

                            <Input name='description'
                                   defaultValue={props.values.description}

                                   type='text-area' as='textarea' rows={12}/>

                        </div>
                    </div>

                </div>
            </div>

            {/* price foori */}
            <div className="flex md:flex-row flex-col md:items-center items-start justify-start pt-5 ">
                <div className='flex flex-col md:col-span-6 col-span-12 md:basis-96 w-full space-y-2 relative'>
                    <label>
                        <span>قیمت</span>
                        <span className='text-custom-red'>*</span>
                    </label>
                    {/*<Input  type='number' name='price'*/}

                    {/*       value={props.values.price}*/}
                    {/*       placeHolder={(props.values.tavafoghi === 0) ? 'وارد کردن قیمت در  توافقی امکان پذیر نیست' : 'قیمت را وارد کنید'}*/}
                    {/*       inputClassName={`${( props.values.tavafoghi) ? 'bg-custom-gray-200' : 'bg-primary'} pr-5 pl-20 py-4 text-white text-lg text-right placeholder:text-white`}/>*/}
                    <NumericFormat
                        type="text"
                        value={props.values.price}
                        className={`${(props.values.tavafoghi) ? 'bg-custom-gray-200' : 'bg-primary'} pr-5 pl-20 py-4 focus:outline-primary text-white text-lg text-right placeholder:text-white w-full flex-1 rounded-xl border border-custom-gray-200/20 p-3  placeholder:text-xs `}
                        valueIsNumericString={true}
                        thousandSeparator=","
                        disabled={props.values.tavafoghi}
                        displayType="input"
                        name='price'
                        placeholder={(props.values.tavafoghi) ? 'وارد کردن قیمت در  توافقی امکان پذیر نیست' : 'قیمت را وارد کنید'}
                        onValueChange={(values) => {
                            const {value} = values;

                            props.setFieldValue('price', +value)
                        }}
                        // onChange={(value)=>props.setFieldValue("price" , value)}
                    />
                    <span className="text-base font-semibold text-white absolute top-12 left-5 bottom-2">تومان</span>
                    <div className='text-sm mr-3 flex gap-x-2 items-center'>


                                <span className='text-sm flex gap-x-1   '>
                                    {
                                        <>
                                            {
                                                wordifyfa(props.values.price) + " "
                                            }

                                            تومان
                                        </>

                                    }
                                </span>


                    </div>
                </div>
                <div className="flex flex-row items-center  gap-x-3 mt-10 md:mr-5">
                    <span className="text-base font-normal">توافقی </span>
                    <label className="inline-flex relative items-center cursor-pointer">
                        <Field type="checkbox" name="tavafoghi" className="sr-only peer"/>
                        <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none   dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>


            {/* next prev */}
            <div className="w-full flex flex-row justify-between items-center pt-20">

                <button type="submit"
                        className="bg-primary/80 text-center text-white py-3 px-4 text-sm rounded-lg">مرحله بعدی
                </button>
                {
                    !props.isEdit &&
                    <div className="flex flex-row justify-center gap-x-3">
                        <button type="button" onClick={handlePrevPage}>مرحله قبلی</button>
                        <ArrowLeftSvg width={18} height={18} color="#ccc"/>

                    </div>
                }
            </div>

        </Form>
    )
}


export default InnerAddPropertyFormInfo;


const getFieldErrorNames = (formikErrors: any) => {
    const transformObjectToDotNotation = (obj: any, prefix = "", result: any[] = []) => {
        Object.keys(obj).forEach(key => {
            const value = obj[key]
            if (!value) return

            const nextKey = prefix ? `${prefix}.${key}` : key
            if (typeof value === "object") {
                transformObjectToDotNotation(value, nextKey, result)
            } else {
                result.push(nextKey)
            }
        })

        return result
    }

    return transformObjectToDotNotation(formikErrors)
}


const ScrollToFieldError = () => {
    const {submitCount, isValid, errors} = useFormikContext()

    useMemo(() => {

        if (isValid) return

        const fieldErrorNames = getFieldErrorNames(errors)

        if (fieldErrorNames.length <= 0) return
        const inps = document?.querySelector('input[name="description"]')

        const element = fieldErrorNames[0] === 'description' ?
            document.querySelector(
                `textarea`
            )
            : document.querySelector(
                `input[name='${fieldErrorNames[0]}']`
            )

        if (!element) return
        // Scroll to first known error into view
        element.parentElement!.scrollIntoView({behavior: "smooth", block: "center"})
    }, [submitCount]) // eslint-disable-line react-hooks/exhaustive-deps

    return null
}
