import { UseControllerReturn } from "react-hook-form";

import { SPECIALS } from "constant";

import FormControlBase, { FormControlBaseProps } from "./FormControlBase";

type FormControlProps = {
  controlState: any;
  label?: React.ReactNode;
  placeholder?: string;
} & FormControlBaseProps;

const FormControlCode = (props: FormControlProps) => {
  const {
    label,
    InputProps,
    placeholder,
    controlState,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;

  const { error } = fieldState;
  const { name, onBlur, onChange, ref, value } = field;

  return (
    <FormControlBase
      FormControlProps={{
        error: !!error,
        ...FormControlProps,
      }}
      FormLabelProps={{
        children: label,
        htmlFor: name,
        ...(error && { error: true }),
        ...(SPECIALS.test(value) && {
          error: true,
        }),
        ...FormLabelProps,
      }}
      InputProps={{
        onKeyPress: (e) => {
          if (SPECIALS.test(value)) {
            e.preventDefault();
          }
        },
        placeholder,
        id: name,
        value,
        onChange,
        inputRef: ref,
        onBlur,
        ...(error && { error: true }),
        ...(SPECIALS.test(value) && {
          error: true,
        }),
        ...InputProps,
      }}
      FormHelperTextProps={{
        ...(error && { children: error ? error.message : undefined }),
        ...(SPECIALS.test(value) && {
          children: "Không được nhập ký tự đặc biệt",
          error: true,
        }),
        // children: error ? error.message : undefined,

        ...FormHelperTextProps,
      }}
    />
  );
};

export default FormControlCode;
