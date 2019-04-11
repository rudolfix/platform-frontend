import * as React from "react";
import { toast, ToastContainer as ToastifyContainer, ToastOptions } from "react-toastify";

import { IS_CYPRESS, TOAST_COMPONENT_DELAY } from "../../config/constants";
import { TDataTestId, TTranslatedString } from "../../types";

import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => <ToastifyContainer autoClose={TOAST_COMPONENT_DELAY} />;

const getOptions = (options?: TDataTestId & ToastOptions) =>
  IS_CYPRESS && options && options["data-test-id"]
    ? { className: options["data-test-id"], ...options }
    : options;

const showErrorToast = (content: TTranslatedString, options?: Parameters<typeof getOptions>[0]) => {
  toast.error(content, getOptions(options));
};

const showInfoToast = (content: TTranslatedString, options?: Parameters<typeof getOptions>[0]) => {
  toast.info(content, getOptions(options));
};

export { ToastContainer, showErrorToast, showInfoToast };
