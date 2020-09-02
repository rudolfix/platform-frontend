import { ButtonInline } from "@neufund/design-system";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { resolutionIsFull, TResolution } from "../../../../modules/governance/types";
import { governanceActionToLabel } from "../../../../modules/governance/utils";
import { IModalComponentProps, Modal } from "../../../modals/Modal";
import { InlineIcon } from "../../../shared/icons";

import downloadIcon from "../../../../assets/img/inline_icons/download.svg";
import styles from "./GovernanceUpdateDetailsModal.module.scss";

interface IGovernanceUpdateDetailsModalProps {
  resolution: TResolution;
  companyBrandName: string;
  downloadIpfsDocument: (documentHash: string, documentName: string) => void;
}

export const GovernanceUpdateDetailsModal: React.FunctionComponent<IModalComponentProps &
  IGovernanceUpdateDetailsModalProps> = ({
  resolution,
  companyBrandName,
  onClose,
  downloadIpfsDocument,
}) => {
  if (resolutionIsFull(resolution)) {
    return (
      <Modal isOpen={true} onClose={onClose} bodyClass={styles.body}>
        <h4 className={styles.title}>{resolution.title}</h4>
        <span className={styles.caption}>
          <FormattedDate value={resolution.startedAt} year="numeric" month="long" day="2-digit" />
          &#x20;&bull;&#x20;{governanceActionToLabel(resolution.action, companyBrandName)}
        </span>
        <span className={styles.message}>
          <FormattedMessage id="governance.governance-update-details-modal.update-is-visible" />
        </span>
        <div>
          <div className={styles.download}>Download</div>
          <div className={styles.downloadRow}>
            <InlineIcon svgIcon={downloadIcon} className={styles.downloadIcon} />
            <ButtonInline
              onClick={() => downloadIpfsDocument(resolution.documentHash, resolution.documentName)}
            >
              {resolution.documentName}
            </ButtonInline>
            <span className={styles.size}>&nbsp;({resolution.documentSize})</span>
          </div>
        </div>
      </Modal>
    );
  } else {
    return null;
  }
};
