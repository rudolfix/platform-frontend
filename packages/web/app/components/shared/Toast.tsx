import * as React from "react";
import { toast, ToastContainer as ToastifyContainer } from "react-toastify";

import { TOAST_COMPONENT_DELAY } from "../../config/constants";
import { TDataTestId, ToastWithTestData, TTranslatedString } from "../../types";

// tslint:disable-next-line:no-submodule-imports
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => <ToastifyContainer autoClose={TOAST_COMPONENT_DELAY} />;

const ComponentWithTestId = (children: TTranslatedString, options?: TDataTestId) =>
  (process.env.NF_CYPRESS_RUN === "1" || __DEV__) && options && options["data-test-id"] ? (
    <div data-test-id={options["data-test-id"]}>{children}</div>
  ) : (
    children
  );
// Options is used in order to keep backwards compatibility

const showErrorToast = (content: TTranslatedString, options?: ToastWithTestData) => {
  toast.error(ComponentWithTestId(content, options), options);
};

const showInfoToast = (content: TTranslatedString, options?: ToastWithTestData) => {
  toast.info(ComponentWithTestId(content, options), options);
};

export { ToastContainer, showErrorToast, showInfoToast };
