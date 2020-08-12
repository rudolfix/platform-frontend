import { Button, EButtonLayout, EButtonSize, EButtonWidth } from "@neufund/design-system";
import { TCompanyEtoData } from "@neufund/shared-modules";
import { nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { IResolution } from "../../../../modules/governance/types";
import { governanceActionToLabel } from "../../../../modules/governance/utils";
import { Container } from "../../../layouts/Container";
import { GovernanceUpdateDetailsModal } from "./GovernanceUpdateDetailsModal";

import pdfIcon from "../../../../assets/img/file_pdf.svg";
import styles from "./GeneralInformation.module.scss";

export type TGeneralInformationListProps = {
  files: ReadonlyArray<IResolution>;
  company: TCompanyEtoData;
};

export const GeneralInformationList: React.FunctionComponent<TGeneralInformationListProps> = props => {
  const company = nonNullable(props.company);
  const [showDetailsModal, setShowDetailsModal] = React.useState<boolean>(false);
  const [fileDetailsIndex, setFileDetailsIndex] = React.useState<number>(-1);
  const onViewDetails = (index: number) => {
    setFileDetailsIndex(index);
    setShowDetailsModal(true);
  };

  return (
    <>
      <Container>
        <ul className={styles.fileList}>
          {props.files.map((file: IResolution, index: number) => {
            const title = governanceActionToLabel(file.action, company.brandName);
            return (
              <li className={styles.fileListItem} key={file.id}>
                <img className={styles.fileIcon} src={pdfIcon} alt="PDF" />

                <div className={styles.fileDetailsWrapper}>
                  <div className={styles.fileDetails}>
                    <span className={styles.fileName}>{title}</span>
                    <span className={styles.caption}>
                      <FormattedDate
                        value={file.startedAt}
                        year="numeric"
                        month="long"
                        day="2-digit"
                      />
                      &#x20;&bull;&#x20;
                      {file.draft && (
                        <>
                          <FormattedMessage id="common.draft" />
                          &#x20;&bull;&#x20;
                        </>
                      )}
                      {title}
                    </span>
                  </div>

                  <Button
                    className={styles.fileAction}
                    onClick={() => onViewDetails(index)}
                    width={EButtonWidth.NO_PADDING}
                    size={EButtonSize.SMALL}
                    layout={EButtonLayout.LINK}
                  >
                    {file.draft ? (
                      <FormattedMessage id="common.edit-draft" />
                    ) : (
                      <FormattedMessage id="common.view-details" />
                    )}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>

      <GovernanceUpdateDetailsModal
        isOpen={showDetailsModal}
        title={
          fileDetailsIndex > -1
            ? governanceActionToLabel(props.files[fileDetailsIndex].action, company.brandName)
            : undefined
        }
        date={fileDetailsIndex > -1 ? props.files[fileDetailsIndex].startedAt : undefined}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  );
};
