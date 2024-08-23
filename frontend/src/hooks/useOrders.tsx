import {SetStateAction, useEffect, useState} from "react";
import {getOrders} from "../services/api/packages";

const useOrders = () => {

    const [orders, setOrders] = useState<SetStateAction<any>>([])
    const [isLoadingOrders, setIsLoading] = useState(true)
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


        getOrders({signal})
            .then(data => {
                setOrders((prevState: any) => [...data])
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


    return {orders, isError, isLoadingOrders, error};
};

export default useOrders;