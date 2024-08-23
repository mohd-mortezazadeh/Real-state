import {useState, useEffect, SetStateAction, useRef, useMemo} from "react";
import {getMyProperties, getPropertyPage} from "../services/api/property";
import {useRouter} from "next/router";

const useProperties = (page = 1, queries: any = null , limit=4) => {

    const [results, setResults] = useState<SetStateAction<any>>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState<any>()
    const [hasNextPage, setHasNextPage] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        setError('');

        const controller = new AbortController();
        const {signal} = controller

        getPropertyPage(page,  queries, limit,{signal})
            .then(data => {
                setResults((prevState: any) => [...prevState, ...data.results])
                setHasNextPage(Boolean(!!data.next))
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)

                if (signal.aborted) return
                setIsError(true)
                setError(e)

            })

        return () => controller.abort()
    }, [page, queries])

    useEffect(() => {
        setResults([])

    }, [queries])


    return {results, isError, isLoading, error, hasNextPage};
};

export default useProperties;