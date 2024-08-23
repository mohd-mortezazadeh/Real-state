import React, {
    ChangeEvent,
    FC,
    useCallback,
    useEffect,
    useState,
    useRef
} from "react";
import classnames from "classnames";
import {useRouter} from "next/router";

// import "./multiRangeSlider.css";

interface MultiRangeSliderProps {
    min: number | string;
    max: number | string;
    onChange: Function;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
                                                         min,
                                                         max,
                                                         onChange
                                                     }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);
    const router: any = useRouter()

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - +min) / (+max - +min)) * 100),
        [min, max]
    );


    //get price from query param
    useEffect(() => {

        if (router?.query?.price) {
            const priceArr = router.query?.price?.split('-')
            setMinVal(priceArr[0])
            setMaxVal(priceArr[1])
        }
    }, [router.query])

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(+minVal);
            const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

            if (range.current) {
                range.current.style.right = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(+maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({min: minVal, max: maxVal});
    }, [minVal, maxVal, onChange]);
    console.log(minVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    return (
        <>
            <div className="relative">
                <input
                    dir='rtl'
                    // name='price'
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValRef}
                    step={100000000}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const value = Math.min(+event.target.value, +maxVal - 1);
                        setMinVal(value);
                        event.target.value = value.toString();
                    }}
                    className={classnames("thumb thumb--zindex-3", {
                        "thumb--zindex-5": minVal > +max - 100
                    })}
                />

                <input
                    dir='rtl'
                    // name='price'
                    type="range"
                    min={min}
                    max={max}
                    step={100000000}
                    value={maxVal}
                    ref={maxValRef}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const value = Math.max(+event.target.value, +minVal + 1);
                        setMaxVal(value);
                        event.target.value = value.toString();
                    }}
                    className="thumb thumb--zindex-4"
                />


                <div className="slider">
                    <div className="slider__track"></div>
                    <div ref={range} className="slider__range"></div>
                    <div className="slider__left-value">
                        {/*{minVal}*/}
                    </div>
                    <div className="slider__right-value">
                        {/*{maxVal}*/}
                    </div>
                </div>

            </div>


            {/*input of multi range*/}
            <div className="flex flex-col gap-y-4 mt-4">
                <div
                    className="w-full border-[0.8px] border-custom-gray-200/40 p-4 rounded-md flex flex-row justify-between items-center">
                    <div className="flex w-full  flex-row justify-start items-center gap-x-3">
                        <label htmlFor='multi-range-input-1' className="text-xs font-normal">از</label>
                        {/*<span className="text-primary font-extrabold text-base">*/}
                        {/*  {minPrice}*/}
                        {/*</span>*/}
                        <div>
                            <input className='w-full focus:outline-0 multi-range-input' type="number"
                                   onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                       const value = Math.min(+event.target.value, +maxVal - 1);
                                       if (min <= value && value <= max) {
                                           setMinVal(value);
                                       }
                                       event.target.value = value.toString();
                                   }}
                                   step={100000000}
                                   min={min}
                                   max={max}
                                   value={minVal} name="" id="multi-range-input-1"/>

                        </div>
                    </div>
                    <div className="font-semibold">تومان</div>
                </div>
                <span className='text-sm -my-2 mb-2'>
                                {minVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان
                </span>

                <div
                    className="w-full border-[0.8px] border-custom-gray-200/40 p-4 rounded-md flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-x-3">
                        <label htmlFor='multi-range-input-2' className="text-xs font-normal">تا</label>
                        {/*<span className="text-black font-extrabold text-base">*/}
                        {/*  {maxPrice}*/}
                        {/*</span>*/}
                        <div>
                            <input className='w-full focus:outline-0 multi-range-input'
                                   onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                       const value = Math.max(+event.target.value, +minVal + 1);
                                       if (min <= value && value <= max) {
                                           setMaxVal(value);
                                       }
                                       event.target.value = value.toString();
                                   }}
                                   step={100000000}
                                   min={+min}
                                   max={+max}
                                   value={maxVal} type="number" name="" id="multi-range-input-2"/>
                        </div>
                    </div>
                    <div className="font-semibold">تومان</div>
                </div>
                <span className='text-sm -my-2 mb-2'>
                                {maxVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان
                </span>
            </div>
        </>
    );
};

export default MultiRangeSlider;
