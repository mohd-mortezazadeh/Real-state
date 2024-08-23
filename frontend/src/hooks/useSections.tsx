import {useState, useEffect, SetStateAction} from "react";
import {getSections} from "../services/api/property";

const useSections = (city: number | null) => {

    const [sections, setSections] = useState<SetStateAction<any>>([])
    const [isLoadingSections, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({
        message: ''
    })

    useEffect(() => {

        if(!city){
            setIsLoading(true);
            setIsError(false);
            setError({
                message: ''
            });

            const controller = new AbortController();
            const {signal} = controller

            getSections(0, {signal})
                .then(data => {
                    setSections((prevState: any) => [...data])
                    setIsLoading(false)
                })
                .catch(e => {
                    setIsLoading(false)

                    if (signal.aborted) return
                    setIsError(true)
                    setError({message: e.message})
                })
            return () => controller.abort()
        }
        if (city) {
            setIsLoading(true);
            setIsError(false);
            setError({
                message: ''
            });

            const controller = new AbortController();
            const {signal} = controller

            city && getSections(city, {signal})
                .then(data => {
                    setSections((prevState: any) => [...data])
                    setIsLoading(false)
                })
                .catch(e => {
                    setIsLoading(false)

                    if (signal.aborted) return
                    setIsError(true)
                    setError({message: e.message})
                })
            return () => controller.abort()
        }

    }, [city])


    return {sections, isError, isLoadingSections, error};
};

export default useSections;