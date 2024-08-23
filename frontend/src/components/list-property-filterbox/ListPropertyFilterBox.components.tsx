import React, {useState, FC, useMemo, SetStateAction, useEffect} from "react";

import MultiRangeSlider from "../multi-range-slider/MultiRangeSlider";
import CustomSelect from "../select/CustomSelect";
import ArrowUp from "../svg/arrows/arrow-up/arrowUpSvg";
import ArrowDownSvg from "../svg/arrows/arrow-down/arrowDownSvg";
import useCategories from "../../hooks/useCategories";
import useCities from "../../hooks/useCities";
import {useRouter} from "next/router";
import * as queryString from "querystring";
import useSections from "../../hooks/useSections";
import useOptions from "../../hooks/useOptions";
import Loading from "../loading/Loading.component";


const optionOptions = [
    {
        "id": 1,
        "name": "estakhr",
        "display_name": "استخر"
    },
    {
        "id": 2,
        "name": "asansor",
        "display_name": "آسانسور"
    },
    {
        "id": 3,
        "name": "parking",
        "display_name": "پارکینگ"
    },
    {
        "id": 4,
        "name": "anbari",
        "display_name": "انباری"
    },
    {
        "id": 12,
        "name": "sona_jacozi",
        "display_name": "سونا و جکوزی"
    },
    {
        "id": 14,
        "name": "roof_garden",
        "display_name": "روف گاردن"
    },
]

const metaOptions = [
    {
        id: '0-100', name: 'تا صد متر', slug: '0-100'
    },
    {
        id: '100-300', name: 'از 100 تا 300 متر', slug: '100-300'
    },
    {
        id: '300-1000', name: 'از 300 تا هزار متر', slug: '300-1000'
    },
    {
        id: '1000-5000', name: 'از هزار تا 5هزار متر', slug: '1000-5000'
    },
    {
        id: '5000-1000000', name: 'بیشتر از 5 هزار متر', slug: '5000-1000000'
    },
]

const villaTypeOptions = [
    {id: 1, name: "جنگلی", slug: "jangali"},
    {id: 2, name: "شهرکی", slug: "shahraki"},
    {id: 3, name: "ساحلی", slug: "saheli"},
]


interface ListPropertyFilterBoxProps {
    setOpen?: any
}

const ListPropertyFilterBox: FC<ListPropertyFilterBoxProps> = ({setOpen}) => {

        const router = useRouter()
        // const {category} = router.query

        const [optionsExpand, setOptionsExpand] = useState<boolean>(false);
        const [minPrice, setMinPrice] = useState<string | number>(0);
        const [maxPrice, setMaxPrice] = useState<string | number>(100000000000);
        const [valuePrice, setValuePrice] = useState<string | number>(0);
        // const [selectedCategory, setSelectedCategory] = useState<SetStateAction<any>>()
        // const [selectedVillaType, setSelectedVillaType] = useState<SetStateAction<any>>()
        // const [selectedCity, setSelectedCity] = useState<SetStateAction<any>>()
        //for fetch sections
        // const [cityId, setCityId] = useState(null)

        const [filters, setFilters] = useState<any>({})

        // const {categories, isLoadingCategories} = useCategories()

        // const {cities, isLoadingCities} = useCities()

        // const {sections, isLoadingSections} = useSections(cityId!)


        // const {options, isLoadingOptions} = useOptions()

        const handleChangePrice = ({min, max}: any): void => {

            setMinPrice(min)
            setMaxPrice(max)

        }

        useMemo(() => {
            setFilters({
                ...filters,
                'price': `${minPrice}-${maxPrice}`
            })
        }, [minPrice, maxPrice])


        //set filter values when reload and persist values
        useEffect(() => {

            //
            // category && setSelectedCategory(categories.find((categoryy: any) => categoryy.name === category[0]))
            // category && setSelectedVillaType(villaTypeOptions.find((type: any) => type.slug === category[1]))
            // category && setSelectedCity(cities.find((city: any) => (city.slug === category[2])))

            router.query && setFilters({
                ...filters,
                meta: router.query.meta,
                asansor: !!router.query.asansor,
                estakhr: !!router.query.estakhr,
                anbari: !!router.query.anbari,
                parking: !!router.query.parking,
                roof_garden: !!router.query.roof_garden,
                sona: !!router.query.sona
            })

            // if(router.query?.price ){
            //     const priceArr = router.query?.price?.split('-')
            //
            //     setMinPrice(+priceArr[0])
            //     setMaxPrice(+priceArr[1])
            //     handleChangePrice({min : 10000, maxPrice})
            // }


        }, [router.query])


        //save filters in a state
        const handleChangeFilter = (value: any, action: any) => {

            if (action.name === 'section' || action.name === 'meta') {
                setFilters({
                    ...filters,
                    [action.name]: value?.slug || null
                })
            } else if (action.name === 'option') {

                setFilters({
                    ...filters,
                    [value.name]: value.id
                })

            } else {
                setFilters({
                    ...filters,
                    [action.name]: value?.name
                })
            }

        }
        // const handleChangeCategory = (value: string) => {
        //
        //     setSelectedCategory(value)
        // }
        //
        // const handleChangeSelectedVillaType = (value: string) => {
        //     setSelectedVillaType(value)
        // }
        //
        // const handleChangeCity = (value: any) => {
        //     setSelectedCity(value)
        //     setCityId(value?.id)
        // }


        //show the result of all filters
        const handleSubmitFilter = () => {
            let newFilters = {
                ...filters,
                // city: filters?.city?.slug,
            }
            Object.keys(newFilters).forEach(key => {
                if (!!newFilters[key] === false) {
                    delete newFilters[key];
                }
            });

            setOpen && setOpen(false)

            router.push(
                {
                    pathname: router.asPath.split("?")[0],
                    query: queryString.stringify(newFilters),
                },
            )
        }


        return (
            <>
                {/* filter box */}

                {
                    <div
                        className="filter-box bg-white rounded-2xl sticky md:top-40 top-20  box-shadow-2 space-y-5 md:h-[550px] h-[600px] z-20 overflow-y-auto overflow-x-hidden "

                    >
                        {/* filters title */}
                        <div
                            className="flex flex-row  justify-between items-center sticky top-0 backdrop-blur-md px-5 py-4 z-10 overflow-hidden"
                            style={{backgroundColor: " rgba(255, 255, 255, 0.4)"}}
                        >
                            <div className="text-text font-bold text-lg">فیلتر</div>
                            <button
                                onClick={handleSubmitFilter}
                                className="flex flex-row justify-center items-center gap-x-2 bg-primary-lin px-5 py-4 rounded-md">
                                <img src="/images/filter.svg"/>
                                <span className="text-white text-sm ">اعمال فیلتر</span>
                            </button>
                        </div>

                        {/* filters */}
                        <div className="px-5 space-y-5">
                            {/* select options */}
                            {/*<div className="flex flex-col gap-y-2">*/}
                            {/*{*/}
                            {/*    <CustomSelect placeholder={'نوع ملک را انتخاب کنید'} hasLabel={true} name='category'*/}
                            {/*                  title="نوع ملک"*/}
                            {/*                  options={categories}*/}
                            {/*                  loading={isLoadingCategories}*/}
                            {/*        // defaultValue={{name: category[0]}}*/}
                            {/*                  value={selectedCategory && {*/}
                            {/*                      name: selectedCategory?.name,*/}
                            {/*                      display_name: selectedCategory?.display_name*/}
                            {/*                  }}*/}
                            {/*                  handleChange={handleChangeCategory}*/}

                            {/*    />*/}
                            {/*}*/}
                            {/*{*/}
                            {/*    !category &&*/}
                            {/*    <CustomSelect placeholder={'نوع ملک را انتخاب کنید'} hasLabel={true} name='category'*/}
                            {/*                  title="نوع ملک"*/}
                            {/*                  options={categories}*/}
                            {/*                  loading={isLoadingCategories}*/}

                            {/*                  handleChange={handleChangeCategory}*/}

                            {/*    />*/}
                            {/*}*/}
                            {/*</div>*/}

                            {/*<div className="flex flex-col gap-y-2">*/}
                            {/*    {*/}
                            {/*        selectedCategory?.name === 'villa' &&*/}
                            {/*        <CustomSelect placeholder={'نوع ویلا را انتخاب کنید'} hasLabel={true} name='villa_type'*/}
                            {/*                      title="نوع ویلا"*/}
                            {/*                      options={villaTypeOptions}*/}
                            {/*            // defaultValue={{name: category[0]}}*/}
                            {/*                      value={selectedVillaType && {*/}
                            {/*                          name: selectedVillaType?.name,*/}
                            {/*                          slug: selectedVillaType?.slug*/}
                            {/*                      }}*/}
                            {/*                      handleChange={handleChangeSelectedVillaType}*/}

                            {/*        />*/}
                            {/*    }*/}

                            {/*</div>*/}

                            {/*<div className="flex flex-col gap-y-2">*/}
                            {/*    {*/}

                            {/*        <CustomSelect placeholder={'شهر را انتخاب کنید'} hasLabel={true} name='city'*/}
                            {/*                      title="شهر"*/}
                            {/*                      loading={isLoadingCities}*/}
                            {/*                      options={cities}*/}
                            {/*                      value={selectedCity && {*/}
                            {/*                          name: selectedCity.name,*/}
                            {/*                          slug: selectedCity.slug*/}
                            {/*                      }*/}
                            {/*                      }*/}
                            {/*            // defaultValue={{name: router.query?.city}}*/}
                            {/*                      handleChange={handleChangeCity}*/}
                            {/*        />*/}

                            {/*    }*/}
                            {/*</div>*/}
                            {/*<div className="flex flex-col gap-y-2">*/}
                            {/*    {*/}
                            {/*        filters?.city &&*/}
                            {/*        <CustomSelect placeholder={'محله را انتخاب کنید'} hasLabel={true} name='section'*/}
                            {/*                      loading={isLoadingSections}*/}
                            {/*                      title="محله"*/}
                            {/*                      value={filters?.section && {name: filters?.section}}*/}
                            {/*                      handleChange={handleChangeFilter}*/}
                            {/*                      options={sections}/>*/}
                            {/*    }*/}
                            {/*</div>*/}
                            <div className="flex flex-col gap-y-2">
                                <CustomSelect placeholder={'متراژ مورد نظر را انتخاب کنید'} hasLabel={true} name='meta'
                                              title="متراژ"
                                              value={filters?.meta && {name: filters?.meta}}
                                              handleChange={handleChangeFilter}
                                              options={metaOptions}/>
                            </div>


                            {/* property options filters  */}
                            <div className="flex flex-col gap-y-5">
                                <label className="text-text ">امکانات رفاهی</label>

                                {/* checkboxes */}
                                <div
                                    className={`transition-all ease-linear grid grid-cols-12 gap-x-2 gap-y-3 ${
                                        optionsExpand
                                            ? "min-h-[80px] overflow-y-visible "
                                            : "h-[80px] overflow-y-hidden"
                                    }`}
                                >
                                    {
                                        optionOptions.map((opt: any) => (
                                            <label key={opt?.id} className="checkbox-container col-span-6">
                                                <input
                                                    onChange={(e) => handleChangeFilter({
                                                        name: opt.name,
                                                        id: e.target.checked
                                                    }, {name: 'option'})}
                                                    checked={filters[opt.name]}
                                                    name={opt?.name} type="checkbox"/>
                                                <span className="checkmark ml-1"></span>
                                                <span className="text-xs font-bold"> {opt?.display_name}</span>
                                            </label>
                                        ))
                                    }

                                </div>

                                {/* show more expand */}
                                {/*{optionsExpand ? (*/}
                                {/*    <div*/}
                                {/*        className="text-sm text-primary flex flex-row items-center justify-center items-center gap-x-2 hover:cursor-pointer"*/}
                                {/*        onClick={(e) => setOptionsExpand(false)}*/}
                                {/*    >*/}
                                {/*        <span>نمایش کمتر</span>*/}

                                {/*        /!*  HERE NEED TO IMPORT ARROW UP COMPONENT *!/*/}
                                {/*        <div className='rotate-180'>*/}
                                {/*            <ArrowDownSvg/>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*) : (*/}
                                {/*    <div*/}
                                {/*        className="text-sm text-primary flex flex-row justify-center items-center gap-x-2 hover:cursor-pointer"*/}
                                {/*        onClick={(e) => setOptionsExpand(true)}*/}
                                {/*    >*/}
                                {/*        <span>نمایش بیشتر</span>*/}

                                {/*        /!*  HERE NEED TO IMPORT ARROW Down COMPONENT *!/*/}
                                {/*        <ArrowDownSvg/>*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {/* price filter */}

                                <div className='flex flex-col gap-y-4 pb-8'>
                                    <label className="text-text ">قیمت</label>
                                    <MultiRangeSlider onChange={handleChangePrice} min={0} max={30000000000}/>
                                </div>


                                {/* foori label toggler */}
                                {/*<div className="pt-5 pb-16">*/}
                                {/*    <div className="flex flex-row gap-x-3">*/}
                                {/*        <span className="text-base font-normal">فوری </span>*/}
                                {/*        <label className="foori-swtich">*/}
                                {/*            <input*/}
                                {/*                type="checkbox"*/}
                                {/*                name="foori-swtich"*/}
                                {/*                id="foori-swtich"*/}
                                {/*                className="foori-input"*/}
                                {/*                checked={foori}*/}
                                {/*                onChange={(e) => setFoori(!foori)}*/}
                                {/*            />*/}
                                {/*            <span className="foori-slider round"></span>*/}
                                {/*        </label>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                }


            </>
        );
    }
;

export default ListPropertyFilterBox;
