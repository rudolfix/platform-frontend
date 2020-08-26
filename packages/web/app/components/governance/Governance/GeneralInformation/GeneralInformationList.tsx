import { Button, EButtonLayout, EButtonSize, EButtonWidth } from "@neufund/design-system";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TResolution } from "../../../../modules/governance/types";
import { governanceActionToLabel } from "../../../../modules/governance/utils";
import { Container } from "../../../layouts/Container";
import { GovernanceUpdateDetailsModal } from "./GovernanceUpdateDetailsModal";

import pdfIcon from "../../../../assets/img/file_pdf.svg";
import styles from "./GeneralInformation.module.scss";

export type TGeneralInformationListProps = {
  resolutions: ReadonlyArray<TResolution>;
  companyBrandName: string;
};

export const GeneralInformationList: React.FunctionComponent<TGeneralInformationListProps> = props => {
  const [showDetailsModalForId, setShowDetailsModalForId] = React.useState<undefined | number>(
    undefined,
  );

  return (
    <>
      <Container>
        <ul className={styles.fileList}>
          {props.resolutions.map((resolution: TResolution, index: number) => {
            const title =
              resolution.title ||
              governanceActionToLabel(resolution.action, props.companyBrandName);
            return (
              <li className={styles.fileListItem} key={resolution.id}>
                <img className={styles.fileIcon} src={pdfIcon} alt="PDF" />
                <div className={styles.fileDetailsWrapper}>
                <div className={styles.fileDetailsWrapper}
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{title}</span>
                  <span className={styles.caption}>
                    <FormattedDate
                      value={resolution.startedAt}
                      year="numeric"
                      month="long"
                      day="2-digit"
                    />
                    &#x20;&bull;&#x20;
                    {resolution.draft && (
                      <>
                        <FormattedMessage id="common.draft" />
                        &#x20;&bull;&#x20;
                      </>
                    )}
                    {governanceActionToLabel(resolution.action, props.companyBrandName)}
                  </span>
                </div>
                <Button
                  className={styles.fileAction}
                  onClick={() => setShowDetailsModalForId(index)}
                  width={EButtonWidth.NO_PADDING}
                  size={EButtonSize.SMALL}
                  layout={EButtonLayout.LINK}
                >
                  {resolution.draft ? (
                    <FormattedMessage id="common.edit-draft" />
                  ) : (
                    <FormattedMessage id="common.view-details" />
                  )}
                </Button>
              </dev>
              </li>
            );
          })}
        </ul>
      </Container>
      {showDetailsModalForId !== undefined && (
        <GovernanceUpdateDetailsModal
          isOpen={true}
          title={
            props.resolutions[showDetailsModalForId].title ||
            governanceActionToLabel(
              props.resolutions[showDetailsModalForId].action,
              props.companyBrandName,
            )
          }
          actionName={governanceActionToLabel(
            props.resolutions[showDetailsModalForId].action,
            props.companyBrandName,
          )}
          documentName={props.resolutions[showDetailsModalForId].documentName || "Fallback Title"}
          documentHash={props.resolutions[showDetailsModalForId].documentHash || "#"}
          documentSize={props.resolutions[showDetailsModalForId].documentSize || "NaN"}
          date={props.resolutions[showDetailsModalForId].startedAt}
          onClose={() => setShowDetailsModalForId(undefined)}
        />
      )}
    </>
  );
};
