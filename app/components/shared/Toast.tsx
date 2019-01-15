import "react-toastify/dist/ReactToastify.css";

import * as React from "react";
import { toast, ToastContainer as ToastifyContainer } from "react-toastify";

import { IS_CYPRESS, TOAST_COMPONENT_DELAY } from "../../config/constants";
import { TDataTestId } from "../../types";

const ToastContainer = () => <ToastifyContainer autoClose={TOAST_COMPONENT_DELAY} />;

const getOptions = (options?: TDataTestId) =>
  IS_CYPRESS && options ? { className: options["data-test-id"] } : undefined;

const showErrorToast = (content: React.ReactNode, options?: TDataTestId) => {
  toast.error(content, getOptions(options));
};

const showInfoToast = (content: React.ReactNode, options?: TDataTestId) => {
  toast.info(content, getOptions(options));
};

export { ToastContainer, showErrorToast, showInfoToast };
