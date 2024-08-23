import React, {CSSProperties, FC, SetStateAction, useState} from 'react'

interface StepperProps {
    steps: [],
    activeStep: number | null,
    dir?: CSSProperties | string | undefined,
    clickable: boolean
}


const Stepper: FC<StepperProps> = ({steps, activeStep, dir = "rtl", clickable}) => {


    const renderSteps = steps?.map((item: any) => {
        if (item.id === 1) {
            return (
                <div className='flex flex-row items-center justify-center w-full flex-1 '
                     key={item.id ? item.id : item.label}>
                    <div className="h-[4px] flex-1 content-['']"></div>
                    <div
                        className={`rounded-full   font-bold flex flex-col justify-center items-center step-circle ${item.id === activeStep ? 'active-step text-2xl text-white' : item.id < activeStep! && 'completed-step text-white'} relative`}>
                        <span className={` ${item.id === activeStep ? "text-4xl pt-2" : 'text-2xl'}`}>{item.id}</span>
                        <span
                            className={`absolute text-primary  w-32 text-center ${item.id === activeStep ? '-left-8 -bottom-8 text-primary font-bold' : '-left-10 -bottom-10'}  `}>{item.label}</span>
                    </div>
                    <div
                        className={`h-[4px] flex-1 content-[''] ${item.id === activeStep ? 'bg-slate-200' : 'bg-primary'}`}></div>
                </div>
            )
        }
        if (item.id === steps.length) {
            return (
                <div className='flex flex-row items-center justify-center w-full flex-1 '
                     key={item.id ? item.id : item.label}>
                    <div
                        className={`h-[4px] flex-1 content-[''] ${item.id <= activeStep! ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    <div
                        className={`rounded-full   font-bold flex flex-col justify-center items-center step-circle  ${item.id === activeStep ? 'active-step text-xl text-white' : item.id > activeStep! && ' text-custom-gray-200/50'} relative`}>
                        <span
                            className={` ${item.id === activeStep ? "text-4xl pt-2" : 'text-2xl pt-1'}`}>{item.id}</span>

                        <span
                            className={`absolute  w-32 text-center ${item.id === activeStep ? '-left-8 -bottom-8 text-primary font-bold' : '-left-10 -bottom-10 text-custom-gray-200/50 '}`}>{item.label}</span>
                    </div>
                    <div className="h-[4px] flex-1 content-[''] "></div>
                </div>
            )
        }
        return (
            <div className='flex flex-row items-center justify-center w-full flex-1'
                 key={item.id ? item.id : item.label}>
                <div
                    className={`h-[4px] flex-1 content-[''] ${item.id === activeStep ? 'bg-primary' : item.id > activeStep! ? 'bg-slate-200' : item.id < activeStep! && 'bg-primary'}`}></div>
                <div
                    className={`rounded-full   font-bold flex flex-col justify-center items-center step-circle  ${item.id === activeStep ? 'active-step text-xl text-white' : item.id < activeStep! ? 'completed-step text-white' : 'text-custom-gray-200/50'} relative`}>
                    <span className={` ${item.id === activeStep ? "text-4xl pt-2" : 'text-2xl pt-1'}`}>{item.id}</span>

                    <span
                        className={`absolute   w-32 text-center ${item.id === activeStep ? '-left-8 -bottom-8 text-primary font-bold' : item.id < activeStep! ? '-left-10 -bottom-10 text-primary' : '-left-10 -bottom-10 text-custom-gray-200/50 '}`}>{item.label}</span>
                </div>
                <div
                    className={`h-[4px] flex-1 content-[''] ${item.id === activeStep ? 'bg-slate-200' : item.id > activeStep! ? 'bg-slate-200' : item.id < activeStep! && 'bg-primary'} `}></div>
            </div>
        )

    })
    return (
        <div className="flex flex-row items-center  mx-auto stepper-wrapper w-full" style={{direction: "rtl"}}>
            <div className=" flex flex-row justify-center items-center flex-1 step ">

                {renderSteps}
            </div>

        </div>
    )
}

export default Stepper
