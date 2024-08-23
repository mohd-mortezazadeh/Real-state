import {useState, useEffect, SetStateAction} from "react";
import {useRouter} from "next/router";
import {getArticlesPage} from "../services/api/article";

const useArticles = (page = 1, queries: any , limit=6) => {

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

        getArticlesPage(page,  queries, limit,{signal})
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
    }, [page, queries])

    useEffect(() => {
        setResults([])

    }, [queries])


    return {results, isError, isLoading, error, hasNextPage};
};

export default useArticles;