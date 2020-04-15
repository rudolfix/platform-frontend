import { ArrayWithAtLeastOneMember } from "@neufund/shared-utils";
import * as cn from "classnames";
import { FormikContextType, useField, useFormikContext } from "formik";
import { FieldMetaProps } from "formik/dist/types";
import * as React from "react";
import { FormGroup, InputProps } from "reactstrap";
import { Schema } from "yup";

import { TTranslatedString } from "../../../../types";
import {
  getSchemaField,
  getSchemaMeta,
  getValidationSchema,
  isRequired,
} from "../../../../utils/yupUtils";
import { generateLabelId } from "../layouts/FormLabel";
import { FormFieldError } from "./FormFieldError";
import { FormFieldLabel } from "./FormFieldLabel";
import { IImageDimensions } from "./FormSingleFileUpload";

import * as styles from "../fields/FormStyles.module.scss";

export enum EMimeType {
  PDF = "application/pdf",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  PNG = "image/png",
  SVG = "image/svg+xml",
  ANY_IMAGE_TYPE = "image/*",
}

export type TAcceptedFileType = EMimeType & string;

export interface IFormField {
  name: string;
}

type TBareFormFieldExternalProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label?: TTranslatedString;
  reverseMetaInfo?: boolean;
  charactersLimit?: number;
  ignoreTouched?: boolean;
};

export enum EWithFormFieldType {
  NORMAL = "normal",
  CHECKBOX_GROUP = "checkbox-group",
}

type TWithFormFieldOptions = {
  type: EWithFormFieldType;
};

export const withFormField = (
  options: TWithFormFieldOptions = { type: EWithFormFieldType.NORMAL },
) => <T extends IFormField>(
  InputComponent: React.ComponentType<T>,
): React.FunctionComponent<TBareFormFieldExternalProps & T> => ({
  label,
  labelClassName,
  wrapperClassName,
  reverseMetaInfo,
  charactersLimit,
  ignoreTouched,
  ...inputProps
}) => {
  const [, meta] = useField(inputProps.name);

  const wrapperProps:
    | {
        role: "group";
        "aria-labeledby": string;
      }
    | {} =
    options.type === EWithFormFieldType.CHECKBOX_GROUP
      ? // to be accessible in case it's a checkbox group we need to provide some role and aria attr
        {
          role: "group",
          "aria-labeledby": generateLabelId(inputProps.name),
        }
      : {};

  return (
    <FormGroup {...wrapperProps} className={wrapperClassName}>
      {label && (
        <FormFieldLabel
          className={labelClassName}
          component={options.type === EWithFormFieldType.NORMAL ? "label" : "span"}
          name={inputProps.name}
        >
          {label}
        </FormFieldLabel>
      )}

      <InputComponent {...(inputProps as T)} />

      <div className={cn(styles.inputMeta, { [styles.inputMetaReverse]: reverseMetaInfo })}>
        {charactersLimit && <span>{withCountedCharacters(meta.value, charactersLimit)}</span>}
        <FormFieldError
          name={inputProps.name}
          ignoreTouched={ignoreTouched}
          alignLeft={reverseMetaInfo}
        />
      </div>
    </FormGroup>
  );
};

/**
 *  The function that encapsulates the logic of determining a value for field valid property.
 */
export const isValid = (
  touched: boolean,
  error: string | undefined,
  submitCount: number,
  ignoreTouched?: boolean,
): boolean => (ignoreTouched || touched || submitCount > 0 ? !error : true);

type TUseFieldMetaOptions = {
  ignoreTouched: boolean;
};

type TUseFieldMeta<Val> = FieldMetaProps<Val> & {
  invalid: boolean;
  valid: boolean;
  changeValue: (value: Val) => void;
};

/**
 * Custom meta information related to the formik field.
 *
 * @param fieldName - Field name provided to formik
 * @param options - Custom options
 * @param options.ignoreTouched - Mark field as invalid even when it was not touched yet
 *
 * @returns All formik provided meta information's and some custom one.
 *          - invalid, valid - marks whether field is valid or invalid
 *                             (takes into account whether it's touched or no and submit count)
 *          - changeValue - touches then field and then changes it's value
 */
// tslint:disable-next-line:no-any-on-steroid
export const useFieldMeta = <Val extends any = any>(
  fieldName: string,
  options: TUseFieldMetaOptions = {
    ignoreTouched: false,
  },
): TUseFieldMeta<Val> => {
  const [, meta] = useField<Val>(fieldName);
  const { submitCount, setFieldValue, setFieldTouched } = useFormikContext<Val>();

  const valid = isValid(meta.touched, meta.error, submitCount, options.ignoreTouched);

  const changeValue = React.useCallback(
    (value: Val) => {
      // do not run validation twice here, just only when changing the value
      // also it's important to do touch field before changing the value
      // as otherwise validation gonna be called with previous value
      setFieldTouched(fieldName, true, false);
      setFieldValue(fieldName, value);
    },
    [fieldName],
  );

  return {
    ...meta,
    valid,
    invalid: !valid,
    changeValue,
  };
};

export const applyCharactersLimit = (val: InputProps["value"] = "", limit: number | undefined) => {
  if (typeof val === "number" || Array.isArray(val) || !limit) {
    return val;
  }

  return limit && val.length > limit ? val.slice(0, limit) : val;
};

export const withCountedCharacters = (val: InputProps["value"] = "", limit: number) => {
  if (typeof val !== "string") {
    throw new Error("Only strings are supported for character counters");
  }

  return `${val.length}/${limit}`;
};

export const isFieldRequired = <T extends {}>(
  validationSchema: Schema<T> | (() => Schema<T>),
  name: string,
  context?: FormikContextType<T>,
) => {
  if (validationSchema) {
    const schema = getValidationSchema(validationSchema);
    const fieldSchema = getSchemaField(name, schema, context);
    return isRequired(fieldSchema);
  } else {
    return false;
  }
};

export const isWysiwyg = <T extends unknown>(validationSchema: Schema<T>, name: string) => {
  if (validationSchema) {
    const schema = getValidationSchema(validationSchema);
    const fieldSchema = getSchemaField(name, schema);

    const meta = fieldSchema ? getSchemaMeta(fieldSchema) : undefined;

    return meta ? meta.isWysiwyg : false;
  } else {
    return false;
  }
};

const mapMimeTypeToExtension = (mimeType: EMimeType): string => {
  const mime2Extension: { [key: string]: string } = {
    [EMimeType.PDF]: "pdf",
    [EMimeType.JPEG]: "jpeg",
    [EMimeType.JPG]: "jpg",
    [EMimeType.PNG]: "png",
    [EMimeType.SVG]: "svg",
  };
  return mime2Extension[mimeType];
};

export const generateFileInformationDescription = (
  acceptedFiles: ArrayWithAtLeastOneMember<TAcceptedFileType>,
  dimensions?: IImageDimensions,
): string => {
  const chooseDelimiter = (index: number, length: number) => {
    if (index === 0) {
      return "";
    } else if (index !== 0 && index === length - 1) {
      return " or ";
    } else {
      return ", ";
    }
  };

  const imageDimensions = dimensions ? `${dimensions.width}px × ${dimensions.height}px, ` : "";

  const fileTypes = acceptedFiles.reduce(
    (acc: string, mimeType: EMimeType, index: number): string => {
      // insert 'or' before last one, otherwise ', ': 'pdf, jpg or gif'
      acc += `${chooseDelimiter(index, acceptedFiles.length)}${mapMimeTypeToExtension(mimeType)}`;
      return acc;
    },
    "",
  );

  return `${imageDimensions}${fileTypes}`;
};

// TODO: write a unit test.
// This involves providing URL.createObjectUrl and Image events polyfills
// because jsdom doesn't have them
const onImageLoad = (image: HTMLImageElement): Promise<IImageDimensions> =>
  new Promise((resolve, reject) => {
    image.onload = (e: Event) => {
      if (e.target !== null) {
        return resolve({
          width: ((e.target as HTMLImageElement) as IImageDimensions).width,
          height: ((e.target as HTMLImageElement) as IImageDimensions).height,
        });
      } else {
        return reject(new Error("image upload failed"));
      }
    };
    image.onerror = () => reject(new Error("could not read this image"));
    image.onabort = () => reject(new Error("image upload has been aborted"));
  });

export const readImageAndGetDimensions = (file: File): Promise<IImageDimensions> => {
  const image = new Image();
  image.src = URL.createObjectURL(file);

  return onImageLoad(image).then(res => {
    URL.revokeObjectURL(image.src);
    return res;
  });
};
