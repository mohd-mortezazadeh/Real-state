import {useState, useEffect, SetStateAction} from "react";
import {getProperty, getPropertyPage} from "../services/api/property";

const useProperty = (id : string) => {
    const [results, setResults] = useState<SetStateAction<any>>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({
        message: ''
    })
    const [hasNextPage, setHasNextPage] = useState(false)


    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        setError({
            message: ''
        });

        const controller = new AbortController();
        const {signal} = controller

        getProperty(id,{signal})
            .then(data => {

                setResults((prevState: any) => [...prevState, ...data.results])
                setHasNextPage(Boolean(!!data.next))
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)

                if (signal.aborted) return
                setIsError(true)
                setError({message: e.message})
            })

        return () => controller.abort()
    }, [id])


    return {results, isError, isLoading, error, hasNextPage};
};

export default useProperty;