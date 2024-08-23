import React, {useState, FC, useMemo, useEffect, SetStateAction} from "react";

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
import useCategoriesByCity from "../../hooks/useCategoriesByCity";
import useCitiesByCategory from "../../hooks/useCitiesByCategory";


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
        "name": "sona",
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


interface SearchFilterBoxProps {
    setOpen?: any
}

const SearchFilterBox: FC<SearchFilterBoxProps> = ({setOpen}) => {

    const router = useRouter()

    const {city, category, section} = router.query


    const [optionsExpand, setOptionsExpand] = useState<boolean>(false);
    const [minPrice, setMinPrice] = useState<string | number>(0);
    const [maxPrice, setMaxPrice] = useState<string | number>(100000000000);
    const [valuePrice, setValuePrice] = useState<string | number>(0);

    const [selectedCategory, setSelectedCategory] = useState<SetStateAction<any>>()

    const [selectedCity, setSelectedCity] = useState<SetStateAction<any>>(null)

    const [selectedSection, setSelectedSection] = useState<any>(null)
    //for fetch sections
    const [cityId, setCityId] = useState(null)
    const [cityName, setCityName] = useState(null)

    const [filters, setFilters] = useState<any>({})

    const {categories, isLoadingCategories} = useCategoriesByCity(cityName)

    // const {cities, isLoadingCities} = useCities()

    const {cities, isLoadingCities} = useCitiesByCategory(selectedCategory?.id)

    const {sections, isLoadingSections} = useSections(cityId!)

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



    useEffect(() => {
        setCityName(selectedCity?.slug)
        setCityId(selectedCity?.id)
    }, [selectedCity])
    //set filter values when reload and persist values

    useEffect(() => {

        city && cities && setSelectedCity(cities.find((cityy: any) => (cityy.slug === city)))


        category && categories && setSelectedCategory(categories.find((categoryy: any) => categoryy.name === category))

        section && sections && setSelectedSection(sections.find((sectionn: any) => (sectionn.slug === section)))

        router.query && setFilters({
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

        //     setMinPrice(+priceArr[0])
        //     setMaxPrice(+priceArr[1])
        //     handleChangePrice({min : 10000, maxPrice})
        // }


    }, [router.query, sections])


    //save filters in a state
    const handleChangeFilter = (value: any, action: any) => {


        if (action.name === 'meta') {
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


    const handleChangeCategory = (value: string) => {

        setSelectedCategory(value)
    }


    const handleChangeCity = (value: any) => {

        setSelectedCity(value)
        setCityId(value?.id)
    }

    const handleChangeSection = (value: any) => {
        setSelectedSection(value)
    }

    //show the result of all filters
    const handleSubmitFilter = () => {
        Object.keys(filters).forEach(key => {
            if (!!filters[key] === false) {
                delete filters[key];
            }
        });

        setOpen && setOpen(false)

        // if (router.query?.city) {
        //     router.push(
        //         {
        //             query: `${queryString.stringify(router.query)}&${queryString.stringify(filters)}`,
        //         },
        //     )
        // } else {


        if (selectedCity && !selectedCategory && selectedSection) {
            router.push(
                {
                    query: `${queryString.stringify(filters)}&city=${selectedCity?.slug}&section=${selectedSection?.slug}`,
                },
            )
        } else if (selectedCategory && !selectedCity && selectedSection) {
            router.push(
                {
                    query: `${queryString.stringify(filters)}&category=${selectedCategory?.name}&section=${selectedSection?.slug}`,
                },
            )
        } else if (selectedCity && selectedCategory && selectedSection) {
            router.push(
                {
                    pathname: `${selectedCity?.slug}/${selectedCategory?.name}/${selectedSection?.slug}`,
                    query: `${queryString.stringify(filters)}`,
                },
            )
        } else if (selectedCity && !selectedCategory && !selectedSection) {
            router.push(
                {
                    pathname: `${selectedCity?.slug}`,
                    query: `${queryString.stringify(filters)}`,
                },
            )
        } else if (selectedCategory && !selectedCity && !selectedSection) {
            router.push(
                {
                    query: `${queryString.stringify(filters)}&category=${selectedCategory?.name}`,
                },
            )
        } else if (selectedCity && selectedCategory && !selectedSection) {
            router.push(
                {
                    pathname: `${selectedCity?.slug}/${selectedCategory?.name}`,
                    query: `${queryString.stringify(filters)}`,
                },
            )
        } else {
            router.push(
                {
                    query: queryString.stringify(filters),
                },
            )
        }

        // }
    }

    return (
        <>
            {/* filter box */}
            <div
                className="filter-box bg-white rounded-2xl sticky top-0 box-shadow-2 space-y-5 md:h-screen h-[600px] z-20 overflow-y-auto overflow-x-hidden "

            >
                {/* filters title */}
                <div
                    className="flex flex-row  justify-between items-center sticky top-0 backdrop-blur-md px-5 py-6 z-10 overflow-hidden"
                    style={{backgroundColor: " rgba(255, 255, 255, 0.4)"}}
                >
                    <div className="text-text font-bold text-lg">فیلتر</div>
                    <button
                        onClick={handleSubmitFilter}
                        className="flex flex-row justify-center items-center gap-x-2 bg-primary-lin px-5 py-4 rounded-md">
                        <img src="images/filter.svg"/>
                        <span className="text-white text-sm ">اعمال فیلتر</span>
                    </button>
                </div>

                {/* filters */}
                <div className="px-5 space-y-5">
                    {/* select options */}

                    <div className="flex flex-col gap-y-2">
                        {

                            <CustomSelect placeholder={'شهر را انتخاب کنید'} hasLabel={true} name='city'
                                          title="شهر"
                                          loading={isLoadingCities}
                                          options={cities}
                                          value={selectedCity}
                                          defaultValue={{name: router.query?.city}}
                                          handleChange={handleChangeCity}
                            />
                        }
                    </div>

                    <div className="flex flex-col gap-y-2">
                        {
                            <CustomSelect placeholder={'نوع ملک را انتخاب کنید'} hasLabel={true} name='category'
                                          title="نوع ملک"
                                          options={categories}
                                          loading={isLoadingCategories}
                                          value={selectedCategory}
                                // defaultValue={{name: router.query?.category}}
                                          handleChange={handleChangeCategory}

                            />
                        }
                    </div>

                    <div className="flex flex-col gap-y-2">
                        {
                            cityId &&
                            <CustomSelect placeholder={'محله را انتخاب کنید'} hasLabel={true} name='section'
                                          loading={isLoadingSections}
                                          title="محله"
                                          value={selectedSection}
                                // value={filters?.section && {name: filters?.section}}
                                          handleChange={handleChangeSection}
                                          options={sections}/>
                        }
                    </div>
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
                                            name={opt?.name}
                                            checked={filters[opt.name]}
                                            type="checkbox"/>
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
                            <MultiRangeSlider onChange={handleChangePrice} min={0} max={1000000000000}/>
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
        </>
    );
};

export default SearchFilterBox;