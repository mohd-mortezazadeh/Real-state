export interface AddPropertyFormInfoValuesInterface{
    city:any,
    section:number | null,
    location:any,
    category:string | null | number,
    meta : {
        category:string | null | number,
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
    title: null | string,
    home_phone: null | string,
    description: null | string,
    options:number[],
    price:number | null,
    tavafoghi:boolean
}



export interface AddPropertyFormGalleryValuesInterface{

}