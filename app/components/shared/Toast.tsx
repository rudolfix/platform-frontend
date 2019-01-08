import "react-toastify/dist/ReactToastify.css";

import * as React from "react";
import { toast, ToastContainer as ToastifyContainer } from "react-toastify";

import { TOAST_COMPONENT_DELAY } from "../../config/constants";
import { TTranslatedString } from "../../types";

const ToastContainer = () => <ToastifyContainer autoClose={TOAST_COMPONENT_DELAY} />;

const showErrorToast = (content: TTranslatedString) => {
  toast.error(content);
};

const showInfoToast = (content: TTranslatedString) => {
  toast.info(content);
};

export { ToastContainer, showErrorToast, showInfoToast };
