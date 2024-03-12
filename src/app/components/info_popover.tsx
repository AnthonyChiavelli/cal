"use client";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

interface IInfoPopoverProps {
  text: string;
}

export default function InfoPopover(props: IInfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <QuestionMarkCircleIcon width={20} height={20} />
      </PopoverTrigger>
      <PopoverContent className="text-gray-900">
        <div>{props.text}</div>
      </PopoverContent>
    </Popover>
  );
}
