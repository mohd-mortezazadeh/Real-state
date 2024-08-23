import {useState, useEffect, SetStateAction, useMemo} from "react";
import {getCategories, getCategoriesByCity} from "../services/api/property";

const useCategoriesByCity = (value : string | null) => {

    const [categories, setCategories] = useState<SetStateAction<any>>([])
    const [isLoadingCategories, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({
        message: ''
    })

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        setError({
            message: ''
        });

        const controller = new AbortController();
        const {signal} = controller


        getCategoriesByCity(value,{signal})
            .then(data => {
                setCategories((prevState: any) => [...data])
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)

                if (signal.aborted) return
                setIsError(true)
                setError({message: e.message})
            })

        return () => controller.abort()
    }, [value])


    return {categories, isError, isLoadingCategories, error};
};

export default useCategoriesByCity;