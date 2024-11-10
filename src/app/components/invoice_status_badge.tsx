import React from "react";
import { cn } from "@nextui-org/react";
import { InvoiceStatus } from "@prisma/client";

interface IInvoiceStatusBadge {
  status: InvoiceStatus;
  className?: string;
  onClick?: () => void;
}

export default function InvoiceStatusBadge(props: IInvoiceStatusBadge) {
  const badgeStyle = React.useMemo(() => {
    switch (props.status) {
      case InvoiceStatus.CREATED:
        return { colorClass: "bg-green-300", text: "Created" };
      case InvoiceStatus.SENT:
        return { colorClass: "bg-blue-300", text: "Sent" };
      case InvoiceStatus.CLOSED:
        return { colorClass: "bg-purple-300", text: "Closed" };
      case InvoiceStatus.PARTIALLY_PAID:
        return { colorClass: "bg-pink-300", text: "Partially Paid" };
    }
  }, [props.status]);

  return (
    <div onClick={props.onClick} className={cn(props.className, `badge badge-lg px-5 ${badgeStyle.colorClass}`)}>
      {badgeStyle.text}
    </div>
  );
}
