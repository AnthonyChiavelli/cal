import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
export type ITailwindIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>
>;
