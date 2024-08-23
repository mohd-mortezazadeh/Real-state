import React, {FC} from "react";

import ArrowLeftSvg from "../svg/arrows/arrow-left/ArrowLeftSvg";
import ArrowRightSvg from "../svg/arrows/arrow-right/ArrowRightSvg";
import Link from "next/link";

interface ShowMoreProps {
  hasArrowRight?: boolean;
  hasArrowLeft?: boolean;
  title?: string;
  fontSize?: string;
  fontWeight?: string;
  fontColor?: string;
  path?: string;
}

const ShowMore: FC<ShowMoreProps> = ({
  hasArrowRight = false,
  hasArrowLeft = true,
  title = "نمایش بیشتر",
  fontSize = "text-base",
  fontWeight = "font-semibold",
  fontColor = "text-primary",
  path = "",
}) => {
  return (
    <>
      <Link legacyBehavior href={path}>
        <div className="flex flex-row justify-center items-center gap-x-1 cursor-pointer ">
          {hasArrowRight && <ArrowRightSvg />}
          <span className={fontSize + " " + fontWeight + " " + fontColor}>
            {title}
          </span>
          {hasArrowLeft && <ArrowLeftSvg color="#005adc" width={14} height={14} />}
        </div>
      </Link>
    </>
  );
};

export default ShowMore;
