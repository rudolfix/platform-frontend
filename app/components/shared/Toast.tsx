import "react-toastify/dist/ReactToastify.css";

import * as React from "react";
import { toast, ToastContainer as ToastifyContainer } from "react-toastify";

import { TOAST_COMPONENT_DELAY } from "../../config/constants";

const ToastContainer = () => <ToastifyContainer autoClose={TOAST_COMPONENT_DELAY} />;

const showErrorToast = (content: React.ReactNode) => {
  toast.error(content);
};

const showInfoToast = (content: React.ReactNode) => {
  toast.info(content);
};

export { ToastContainer, showErrorToast, showInfoToast };
