import { ButtonClose } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal as ReactstrapModal } from "reactstrap";

import { CommonHtmlProps } from "../../types";
import { Panel } from "../shared/Panel";

import * as styles from "./Modal.module.scss";

export interface IModalComponentProps {
  onClose?: () => void;
  isOpen: boolean;
  fixed?: boolean;
  unmountOnClose?: boolean;
  scrollable?: boolean;
  footer?: React.ReactNode;
  bodyClass?: string;
}

export const Modal: React.FunctionComponent<IModalComponentProps & CommonHtmlProps> = ({
  children,
  onClose,
  isOpen,
  className,
  bodyClass,
  scrollable,
  footer,
  unmountOnClose,
  ...props
}) => (
  <ReactstrapModal
    isOpen={isOpen}
    toggle={onClose}
    className={className}
    centered={true}
    unmountOnClose={unmountOnClose}
    scrollable={scrollable}
  >
    <Panel className={cn(styles.modal, { [styles.fixed]: scrollable })} {...props}>
      <div className={styles.header}>
        {onClose && (
          <ButtonClose
            data-test-id="modal-close-button"
            onClick={onClose}
            iconProps={{ alt: <FormattedMessage id="common.close" /> }}
          />
        )}
      </div>
      <div className={cn(styles.body, bodyClass)}>{children}</div>
    </Panel>
    {footer}
  </ReactstrapModal>
);
