import AdsSvg from "../ads/adsSvg";

interface StatisticsProps {
    title: string,
    titleSvg: any,
    statisticNumber: number,
    statisticTitle: string
}


const Statistics = ({statisticTitle, statisticNumber, title, titleSvg}: StatisticsProps) => {
    return (
        <div className='rounded-lg overflow-hidden '>
            <div className='bg-primary-100/20 flex gap-x-2 items-center justify-center py-4 font-semibold'>
                {titleSvg}
                <span>{title}</span>
            </div>

            <div className='bg-primary-100/30 flex items-center justify-center py-4 gap-x-2 text-primary'>
                <span className='font-black text-xl'>{statisticNumber}</span>
                <span className='font-semibold'>{statisticTitle}</span>
            </div>

        </div>
    );
};

export default Statistics;