export interface AuthFormPhoneValues {
    phone: string
}

export interface AuthFormInfoValues {
    phone: string,
    role : string | number | null ,
    fullname : string,
    city : number | null,
    company_name : string | null
}

export interface AuthFormVerifyValues {
    code : null | number,
    token : string
}
export interface AuthFormPasswordValues{
    password : string
    phone : string
}