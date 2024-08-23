import {useRouter} from "next/router";
import {SetStateAction, useEffect, useState} from "react";
import {getAdvisors} from "../services/api/advisor";

const UseAdvisorsByStatus = (page = 1, queries: any, status = 1, refresh : any , limit = 4 ) => {
    const router = useRouter()

    const [results, setResults] = useState<SetStateAction<any>>([])
    const [isLoading, setIsLoading] = useState(true)
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

        getAdvisors(page, queries, status, limit, {signal})
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
    }, [page, queries ])

    useEffect(() => {

        setIsLoading(true);
        setIsError(false);
        setError({
            message: ''
        });

        const controller = new AbortController();
        const {signal} = controller

        getAdvisors(page, queries, status, limit, {signal})
            .then(data => {

                setResults((prevState: any) => [...data.results])
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
    }, [status , refresh])

    useEffect(() => {
        setResults([])

    }, [queries , status])



    return {results, isError, isLoading, error, hasNextPage};
};

export default UseAdvisorsByStatus;