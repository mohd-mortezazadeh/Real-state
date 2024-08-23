import {useState, useEffect, SetStateAction, useMemo} from "react";
import {getCitiesByCategory} from "../services/api/property";

const useCitiesByCategory = (value : number | string| null) => {

    const [cities, setCities] = useState<SetStateAction<any>>([])
    const [isLoadingCities, setIsLoading] = useState(false)
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


        getCitiesByCategory(value,{signal})
            .then(data => {
                setCities((prevState: any) => [...data])
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


    return {cities, isError, isLoadingCities, error};
};

export default useCitiesByCategory;