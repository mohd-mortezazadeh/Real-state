import React from 'react';
import LoadingSvg from "../svg/loading/LoadingSvg";

const TinyLoading = () => {
    return (
        <div className='animate-spin'>
            <LoadingSvg  width={20} height={20}/>
        </div>
    );
};

export default TinyLoading;