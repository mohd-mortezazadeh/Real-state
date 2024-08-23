import React, {useState} from 'react';
import CustomSelect from "../../../components/select/CustomSelect";
import SearchIcon from "../../../components/svg/search/searchSvg";
import queryString from "querystring";
import useCategoriesByCity from "../../../hooks/useCategoriesByCity";
import useCitiesByCategory from "../../../hooks/useCitiesByCategory";
import useSections from "../../../hooks/useSections";
import {useRouter} from "next/router";

const FilterBox = () => {
    const router = useRouter()
    const [categoryId, setCategoryId] = useState('')
    const [cityId, setCityId] = useState(null)
    const [cityName, setCityName] = useState('')

    const [filters, setFilters] = useState<any>()
    // const {categories, isLoadingCategories} = useCategories()

    const {categories, isLoadingCategories} = useCategoriesByCity(cityName!)

    const {cities, isLoadingCities} = useCitiesByCategory(categoryId!)
    // const {cities, isLoadingCities} = useCities()
    const {sections, isLoadingSections} = useSections(cityId!)


    const handleChangeFilter = (value: any, action: any) => {

        if (action.name === 'city') {
            setFilters({
                ...filters,
                [action.name]: value || null,
                section: null
            })
            setCityId(value?.id)
            setCityName(value?.slug)
        } else if (action.name === 'section' || action.name === 'meta') {
            setFilters({
                ...filters,
                [action.name]: value || null
            })
        } else {
            setFilters({
                ...filters,
                [action.name]: value?.name
            })
            setCategoryId(value?.id)
        }

    }


    const handleSubmitFilter = () => {
        filters && Object.keys(filters).forEach(key => {
            if (!!filters[key] === false) {
                delete filters[key];
            }
        });

        if (filters?.category && filters?.city?.slug && filters?.section?.slug) {
            router.push(
                {
                    pathname: `/${filters.city?.slug}/${filters.category}/${filters.section?.slug}`,
                },
            )
        } else if (filters?.city?.slug && filters?.section?.slug) {
            router.push(
                {
                    pathname: `/search`,
                    query: queryString.stringify({section: filters.section.slug, city: filters.city.slug})
                },
            )
        } else if (filters?.category && filters?.city?.slug && !filters.section?.slug) {
            router.push(
                {
                    pathname: `/${filters.city?.slug}/${filters.category}`,
                },
            )
        } else if (filters?.city?.slug && !filters.section?.slug && !filters?.category) {
            router.push(
                {
                    pathname: `/${filters.city?.slug}`,
                },
            )
        } else if (!filters?.city?.slug && !filters?.section?.slug && filters?.category) {
            router.push(
                {
                    pathname: `/shomal/${filters.category}`,
                    // query: queryString.stringify(filters)
                },
            )
        } else {
            router.push(
                {
                    pathname: `/search`,
                },
            )
        }
    }
    return (
        <div className='container mx-auto lg:max-w-screen-xl  lg:block '>


            {/* dijimelk motto*/}
            <div className='relative text-white mt-14 hidden lg:block'>
                <h1 className='text-[40px] font-bold'>ویلا ارزان</h1>
                <p className='text-4xl mt-6'>
                    تخصص ما مناطق
                </p>
                <p className='text-[40px] mt-6'>
                    <span className=' font-bold'>شــمالی </span>
                    کشور اســـــت
                </p>
            </div>

            {/*filter box wrapper*/}
            <div className='flex w-full justify-center'>

                {/*filter box*/}

                <div
                    className='flex flex-col lg:flex-row justify-between gap-4  w-4/5 p-6 rounded-lg -bottom-[120px] lg:-bottom-3  absolute bg-white box-shadow-3'
                >

                    <CustomSelect placeholder='شهر خود را انتخاب کنید' hasLabel={false}
                                  handleChange={handleChangeFilter}
                                  loading={isLoadingCities}
                                  value={filters?.city}
                                  name='city'
                                  options={cities}/>

                    <CustomSelect placeholder='نوع ملک را انتخاب کنید' hasLabel={false}
                                  name='category'

                                  options={categories}
                        // clear={false}
                        // defaultValue={{name: 'villa-shahraki', display_name: "ویلا شهرکی"}}
                                  loading={isLoadingCategories}
                                  handleChange={handleChangeFilter}
                    />

                    <CustomSelect placeholder='محله خود را انتخاب کنید' hasLabel={false}
                                  handleChange={handleChangeFilter}
                                  name='section'
                                  value={filters?.section}
                                  options={sections}/>


                    <button
                        className='lg:px-1 py-2 lg:py-0 text-white rounded-lg flex items-center justify-center  gap-x-2 bg-primary-lin'
                        onClick={handleSubmitFilter}>
                        <span className='text-sm'>جستجو</span>
                        <SearchIcon color='#fff' width={14} height={14}/>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FilterBox;