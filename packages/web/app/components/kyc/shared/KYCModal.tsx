import * as React from "react";

import { IModalComponentProps, Modal } from "../../modals/Modal";

import * as styles from "./KYCModal.module.scss";

interface IKYCModalProps {
  title: React.ReactNode;
}

interface IKYCModalTitleProps {
  children: React.ReactNode;
}

export const KYCModal: React.FunctionComponent<IModalComponentProps & IKYCModalProps> = ({
  title,
  children,
  ...props
}) => (
  <Modal scrollable unmountOnClose bodyClass={styles.body} {...props}>
    {title}
    {children}
  </Modal>
);

export const KYCModalTitle: React.FunctionComponent<IKYCModalTitleProps> = ({ children }) => (
  <h1 className={styles.title}>{children}</h1>
);
