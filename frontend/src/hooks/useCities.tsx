import {useState, useEffect, SetStateAction} from "react";
import {getCities} from "../services/api/property";

const useCities = () => {

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


        getCities({signal})
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
    }, [])


    return {cities, isError, isLoadingCities, error};
};

export default useCities;