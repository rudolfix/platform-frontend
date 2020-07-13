import * as React from "react";
import { FormattedDate } from "react-intl";

import { IModalComponentProps, Modal } from "../../../modals/Modal";
import { InlineIcon } from "../../../shared/icons";
import { ExternalLink } from "../../../shared/links";

import downloadIcon from "../../../../assets/img/inline_icons/download.svg";
import styles from "./GovernanceUpdateDetailsModal.module.scss";

interface IGovernanceUpdateDetailsModalProps {
  title: React.ReactNode | undefined;
  date: Date | undefined;
}

export const GovernanceUpdateDetailsModal: React.FunctionComponent<IModalComponentProps &
  IGovernanceUpdateDetailsModalProps> = props => (
  <Modal unmountOnClose {...props} bodyClass={styles.body}>
    <h4 className={styles.title}>{props.title}</h4>
    <span className={styles.caption}>
      {props.date && <FormattedDate value={props.date} year="numeric" month="long" day="2-digit" />}
      &#x20;&bull;&#x20;{props.title}
    </span>
    <span className={styles.message}>This update is visible to your token holder investors.</span>
    <div>
      <div className={styles.download}>Download</div>
      <div className={styles.downloadRow}>
        <InlineIcon svgIcon={downloadIcon} className={styles.downloadIcon} />
        <ExternalLink href="#">Fifth Force GmbH financials 2020 for investors.pdf</ExternalLink>
        <span className={styles.size}>&nbsp;(19MB)</span>
      </div>
    </div>
  </Modal>
);
