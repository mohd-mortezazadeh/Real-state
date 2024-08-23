import {FC} from "react";
import CustomSelect from "../select/CustomSelect";

interface ListPropertySingleFilterProps {
    title: string;
    name: string,
    options: any[],
    hasLabel?: boolean,
    selectClassNames?: string
}

const SingleFilter: FC<ListPropertySingleFilterProps> = ({
                                                             name,
                                                             title,
                                                             options,
                                                             hasLabel = true,
                                                             selectClassNames
                                                         }) => {
    return (

        <>

            {
                hasLabel &&
                <label className="text-text font-semibold">{title}</label>
            }

                {/*<CustomSelect  name={name} options={options}/>*/}

        </>
    );
};

export default SingleFilter;
