import React, {FC} from "react";
import LoadingSvg from "../svg/loading/LoadingSvg";

interface LoadingProps {
  axis?: string;
}

const Loading: FC<LoadingProps> = ({ axis = "col" }) => {
  return (
    <div
      className={`justify-center items-center   ${
        axis === "row" ? "flex flex-row gap-x-3 " : "flex flex-col  gap-y-5"
      }`}
    >
        <div className='animate-spin'>
            <LoadingSvg />
        </div>
      <span className="text-base font-medium">درحال بارگیری</span>
    </div>
  );
};

export default Loading;
