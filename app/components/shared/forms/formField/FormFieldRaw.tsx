import * as cn from "classnames";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputProps } from "reactstrap";

import { CommonHtmlProps, InputType } from "../../../../types";
import { FormLabel } from "./FormLabel";

import * as styles from "./FormStyles.module.scss";

export interface IFieldGroup {
  label?: string | React.ReactNode;
  placeholder?: string | React.ReactNode;
  errorMsg?: string | React.ReactNode;
  type?: InputType;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  addonStyle?: string;
  maxLength?: string;
  charactersLimit?: number;
  invalid?: boolean
  controlCursor?: boolean
}

type FieldGroupProps = IFieldGroup & InputProps & CommonHtmlProps;

export const computedValue = (val: InputProps['value'], limit: number | undefined) => {
  if (typeof val === 'number' || Array.isArray(val) || !val || !limit) {
    return val;
  }
  return limit && val.length > limit ? val.slice(0, limit - 1) : val;
};

export const countedCharacters = (val: InputProps['value'], limit: number | undefined) => {
  val = val || ""
  return `${(val as string).length}/${limit}`;
};

export class FormFieldRaw extends React.Component<FieldGroupProps> {
  private rawStr = ""
  private caretPosition = 0
  private inputRef?: HTMLInputElement

  private handleChange = (ev: React.ChangeEvent<any>) => {
    this.rawStr = String(ev.target.value);
    this.caretPosition = Number(ev.target.selectionEnd);

    if (this.props.onChange) {
      this.props.onChange(ev);
    }
  }

  componentDidUpdate ({ value }: FieldGroupProps): void {
    if (this.props.controlCursor && this.inputRef) {
      const input = this.inputRef
      if (this.props.value !== value) {
        const str = this.rawStr.substr(0, this.caretPosition);
        const index = String(this.props.value).indexOf(str) + this.caretPosition;

        if (index !== -1) {
          input.setSelectionRange(index, index)
        }
      } else {
        const index = this.caretPosition
        input.setSelectionRange(index, index)
      }
    }
  }

  render (): React.ReactNode {
    const {
      value,
      name,
      type,
      placeholder,
      label,
      prefix,
      suffix,
      className,
      addonStyle,
      charactersLimit,
      errorMsg,
      onChange,
      controlCursor,
      ...props
    } = this.props

    const val = computedValue(value, charactersLimit)
    const invalid = props.invalid || !!errorMsg

    return (
      <FormGroup>
        {label && <FormLabel>{label}</FormLabel>}
        <InputGroup>
          {prefix && (
            <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
              {prefix}
            </InputGroupAddon>
          )}
          <Input
            className={cn(className, styles.inputField)}
            type={type}
            value={val}
            valid={!invalid}
            placeholder={placeholder}
            invalid={invalid}
            onChange={this.handleChange}
            innerRef={(ref) => this.inputRef = ref}
            {...props}
          />
          {suffix && (
            <InputGroupAddon addonType="append" className={cn(styles.addon, addonStyle)}>
              {suffix}
            </InputGroupAddon>
          )}
        </InputGroup>
        {errorMsg && (
          <div className={styles.errorLabel}>{errorMsg}</div>
        )}
        {charactersLimit && <div>{countedCharacters(val, charactersLimit)}</div>}
      </FormGroup>
    );
  }
}
