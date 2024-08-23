import {useState, useEffect, SetStateAction} from "react";
import {getCompoanies} from "../services/api/property";

const useCities = (status = 1) => {

    const [companies, setCompanies] = useState<SetStateAction<any>>([])
    const [isLoadingCompanies, setIsLoading] = useState(false)
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

        getCompoanies(status  ,{signal})
            .then(data => {
                setCompanies((prevState: any) => [...data])
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


    return {companies, isError, isLoadingCompanies, error};
};

export default useCities;