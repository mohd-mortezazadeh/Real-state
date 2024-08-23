import {useState, useEffect, SetStateAction, useMemo} from "react";
import {getCategories} from "../services/api/property";

const useCategories = () => {

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


        getCategories({signal})
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
    }, [])


    return {categories, isError, isLoadingCategories, error};
};

export default useCategories;