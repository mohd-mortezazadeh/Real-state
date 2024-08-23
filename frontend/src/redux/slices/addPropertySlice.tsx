import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store";


interface addPropertyState {
    page: number,
    // pageEdit : number,
    name: string | null,
    display_name: string,
    id: number | null,
    propertyInfo: any,

}

const initialState: addPropertyState = {
    page: 1,
    // pageEdit : 2,
    name: '',
    display_name: '',
    id: null,
    propertyInfo: {
        city: null,
        section: null,
        location: null,

        category: null,
        options: [],
        meta: {
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
        },
        title: '',
        home_phone: '',
        description: '',

        price: null,
        tavafoghi: false,
        media: {
            thumbnail: [],
            gallery: []
        }
    },


}

export const addPropertySlice = createSlice({
    name: "add_property",
    initialState,
    reducers: {
        nextPage: (state) => {
            state.page += 1
        },
        prevPage: (state) => {
            state.page -= 1
        },
        handlePage: (state, action) => {
            state.page = action.payload
        },
        handleName: (state, action) => {
            state.display_name = action.payload.display_name
            state.name = action.payload.name
            state.id = action.payload.id
            state.propertyInfo.category = action.payload.id
        },
        handlePropertyInfo: (state, action) => {
            state.propertyInfo = action.payload
        },
        handlePropertyInfoEdit: (state, action) => {
            state.propertyInfo = action.payload
            state.name = action.payload?.category?.name
            state.display_name = action.payload?.category?.display_name
            state.propertyInfo.category = action.payload?.category.id

            state.id = action.payload?.category?.id
            state.propertyInfo.city = {
                name: action.payload?.section?.city,
                id: action.payload?.section?.city_id,
                slug: action.payload?.section?.city_slug,
            }
            state.propertyInfo.lat_path = action.payload.lat_path
            state.propertyInfo.lng_path = action.payload.lng_path
            state.propertyInfo.meta = action.payload?.meta?.reduce((obj: any, item: any) => Object.assign(obj, {[item.key]: item.value}), {});
            state.propertyInfo.meta?.mojavez_sakht ? state.propertyInfo.meta.mojavez_sakht = {
                name: state.propertyInfo?.meta?.mojavez_sakht,
                slug: state.propertyInfo?.meta?.mojavez_sakht
            } : ''
            state.propertyInfo.meta?.mojavez_tejari ? state.propertyInfo.meta.mojavez_tejari = {
                name: state.propertyInfo.meta.mojavez_tejari,
                slug: state.propertyInfo.meta.mojavez_tejari
            } : ''
            state.propertyInfo.options = action.payload.options?.map((item: any) => item?.id)
            if (action.payload?.media?.thumbnail[0].id === 2881) {
                state.propertyInfo.media.thumbnail = []

            } else {

                state.propertyInfo.media.thumbnail = [action.payload?.media?.thumbnail[1].id]
            }

            if(action.payload?.media?.gallery[0].id === 2881){
                state.propertyInfo.media.gallery = []

            }else{
                state.propertyInfo.media.gallery = action.payload.media?.gallery.map((item: any) => item.id)
            }
        },
        handleAddThumbnail: (state, action) => {
            state.propertyInfo.media.thumbnail = [action.payload]
        },
        handleRemoveThumbnail: (state) => {
            state.propertyInfo.media.thumbnail = []
        },
        handleAddGallery: (state, action) => {

            state.propertyInfo.media.gallery.push(action.payload)

        },
        handleRemoveOption: (state, action) => {
            let index = state.propertyInfo.options.indexOf(action.payload)
            if (index > -1) {
                state.propertyInfo.options.splice(index, 1)
            } else {
                state.propertyInfo.options.push(action.payload)
            }
        },
        handleRemoveGallery: (state, action) => {

            const list = [...state.propertyInfo.media.gallery];
            list.splice(action.payload, 1)

            state.propertyInfo.media.gallery = list;
        },
        reset: () => initialState,
        resetDataCategoryChange: (state) => {
            state.propertyInfo.meta = {
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
            }
            state.propertyInfo.options = []
        }
    }
})


export const selectAddPropertyPage = (state: RootState) => state.add_property.page
// export const selectEditPropertyPage = (state: RootState) => state.add_property.pageEdit

export const selectNameProperty = (state: RootState) => state.add_property.name
export const selectDisplayNameProperty = (state: RootState) => state.add_property.display_name
export const selectIdProperty = (state: RootState) => state.add_property.propertyInfo.category
export const selectPropertyInfo = (state: RootState) => state.add_property.propertyInfo

export const {
    nextPage,
    prevPage,
    handlePage,
    handleName,
    handlePropertyInfo,
    handleAddThumbnail,
    handleRemoveThumbnail,
    handleAddGallery,
    handleRemoveGallery,
    reset,
    resetDataCategoryChange,
    handlePropertyInfoEdit,
    handleRemoveOption,

} = addPropertySlice.actions

export default addPropertySlice.reducer