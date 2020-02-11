import { FormikContext } from "formik";
import { CSSProperties, ReactElement } from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { ToastOptions } from "react-toastify";
import { ComponentEnhancer } from "recompose";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

// we dont use AllHtmlAttributes because they include many more fields which can collide easily with components props (like data)
export type CommonHtmlProps = {
  className?: string;
  style?: CSSProperties;
};

export type TTranslatedString = string | ReactElement<FormattedMessage.Props>;

export type TDataTestId = {
  "data-test-id"?: string;
};

export type ToastWithTestData = ToastOptions & TDataTestId;

// TODO: Remove `any` and provide correct types everywhere
export type TFormikConnect<Values = any> = {
  formik: FormikContext<Values>;
};

export type TElementRef<T> = null | T;

/**
 * Returns HOC inner props
 * @note For consistency HOC\s should be always wrapped by function
 * @example
 * import { compose } from "recompose";
 *
 * const withFoo = () => compose<{ foo: string }, {}>(...);
 * THocProps<typeof withFoo> // { foo: string }
 */
export type THocProps<
  H extends () => ComponentEnhancer<any, any>
> = H extends () => ComponentEnhancer<infer R, any> ? R : never;
