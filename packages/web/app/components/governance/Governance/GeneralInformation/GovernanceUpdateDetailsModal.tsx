import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { IModalComponentProps, Modal } from "../../../modals/Modal";
import { InlineIcon } from "../../../shared/icons";
import { ExternalLink } from "../../../shared/links";

import downloadIcon from "../../../../assets/img/inline_icons/download.svg";
import styles from "./GovernanceUpdateDetailsModal.module.scss";

interface IGovernanceUpdateDetailsModalProps {
  title: React.ReactNode;
  date: Date;
  documentName: string;
  documentHash: string;
  documentSize: string;
  actionName: React.ReactNode;
}

export const GovernanceUpdateDetailsModal: React.FunctionComponent<IModalComponentProps &
  IGovernanceUpdateDetailsModalProps> = ({
  documentName,
  title,
  date,
  documentSize,
  actionName,
  onClose,
}) => (
  <Modal isOpen={true} onClose={onClose} bodyClass={styles.body}>
    <h4 className={styles.title}>{title}</h4>
    <span className={styles.caption}>
      <FormattedDate value={date} year="numeric" month="long" day="2-digit" />
      &#x20;&bull;&#x20;{actionName}
    </span>
    <span className={styles.message}>
      <FormattedMessage id="governance.governance-update-details-modal.update-is-visible" />
    </span>
    <div>
      <div className={styles.download}>Download</div>
      <div className={styles.downloadRow}>
        <InlineIcon svgIcon={downloadIcon} className={styles.downloadIcon} />
        <ExternalLink href="#">{documentName}</ExternalLink>
        <span className={styles.size}>&nbsp;({documentSize})</span>
      </div>
    </div>
  </Modal>
);
