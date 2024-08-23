import {useState, useEffect, SetStateAction} from "react";
import {getOptionss} from "../services/api/property";

const useOptionss = (category: number) => {

    const [options, setOptions] = useState<SetStateAction<any>>([])
    const [isLoadingOptions, setIsLoading] = useState(false)
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

        getOptionss(category, {signal})
            .then(data => {
                setOptions((prevState: any) => [...data])
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)

                if (signal.aborted) return
                setIsError(true)
                setError({message: e.message})
            })

        return () => controller.abort()
    }, [category])


    return {options, isError, isLoadingOptions, error};
};

export {useOptionss};