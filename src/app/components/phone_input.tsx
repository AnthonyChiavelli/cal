import { Control } from "react-hook-form";
import ReactPhoneInput from "react-phone-number-input/react-hook-form-input";
import "react-phone-number-input/style.css";

interface IPhoneInputProps {
  name: string;
  value: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  control?: Control<any, any>;
  labelledBy?: string;
}

export default function PhoneInput(props: IPhoneInputProps) {
  // @ts-ignore
  if (props.control) {
    return (
      <ReactPhoneInput
        control={props.control}
        name={props.name}
        className="input w-full"
        country="US"
        data-testid={`phone-input-${props.name}`}
        data-cy={`phone-input-${props.name}`}
        />
      );
    } else {
      return (
        <ReactPhoneInput
        data-testid={`phone-input-${props.name}`}
        data-cy={`phone-input-${props.name}`}
        name={props.name}
        className="input w-full"
        country="US"
      />
    );
  }
}
