import { Button, EButtonLayout, EButtonSize, EButtonWidth } from "@neufund/design-system";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { EResolutionState, TResolution } from "../../../../modules/governance/types";
import { governanceActionToLabel } from "../../../../modules/governance/utils";
import { Container } from "../../../layouts/Container";
import { GovernanceUpdateDetailsModal } from "./GovernanceUpdateDetailsModal";

import pdfIcon from "../../../../assets/img/file_pdf.svg";
import styles from "./GeneralInformation.module.scss";

export type TGeneralInformationListProps = {
  resolutions: ReadonlyArray<TResolution>;
  companyBrandName: string;
};

export type TResolutionProps = {
  resolution: TResolution;
  companyBrandName: string;
  showDetailsModalForId: () => void;
};

//TODO update when designs for loading state are ready
export const Resolution: React.FunctionComponent<TResolutionProps> = ({
  resolution,
  companyBrandName,
  showDetailsModalForId,
}) => {
  switch (resolution.resolutionState) {
    case EResolutionState.BASIC:
      return (
        <li className={styles.fileListItem} key={resolution.id}>
          <img className={styles.fileIcon} src={pdfIcon} alt="PDF" />
          <div className={styles.fileDetailsWrapper}>
            <div className={styles.fileDetails}>
              <span className={styles.fileName}>
                {governanceActionToLabel(resolution.action, companyBrandName)}
              </span>
              <span className={styles.caption}>
                <FormattedDate
                  value={resolution.startedAt}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />
                &#x20;&bull;&#x20;
                {governanceActionToLabel(resolution.action, companyBrandName)}
              </span>
            </div>
            <Button
              className={styles.fileAction}
              disabled={true}
              width={EButtonWidth.NO_PADDING}
              size={EButtonSize.SMALL}
              layout={EButtonLayout.LINK}
            >
              <FormattedMessage id="common.view-details" />
            </Button>
          </div>
        </li>
      );
    case EResolutionState.FULL:
      return (
        <li className={styles.fileListItem} key={resolution.id}>
          <img className={styles.fileIcon} src={pdfIcon} alt="PDF" />
          <div className={styles.fileDetailsWrapper}>
            <div className={styles.fileDetails}>
              <span className={styles.fileName}>{resolution.title}</span>
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
                {governanceActionToLabel(resolution.action, companyBrandName)}
              </span>
            </div>
            <Button
              className={styles.fileAction}
              onClick={showDetailsModalForId}
              width={EButtonWidth.NO_PADDING}
              size={EButtonSize.SMALL}
              layout={EButtonLayout.LINK}
            >
              <FormattedMessage id="common.view-details" />
            </Button>
          </div>
        </li>
      );
  }
};

export const GeneralInformationList: React.FunctionComponent<TGeneralInformationListProps> = props => {
  const [showDetailsModalForId, setShowDetailsModalForId] = React.useState<undefined | number>(
    undefined,
  );

  return (
    <>
      <Container>
        <ul className={styles.fileList}>
          {props.resolutions.map((resolution: TResolution, index: number) => (
            <Resolution
              key={resolution.id}
              resolution={resolution}
              showDetailsModalForId={() => setShowDetailsModalForId(index)}
              companyBrandName={props.companyBrandName}
            />
          ))}
        </ul>
      </Container>
      {showDetailsModalForId !== undefined && (
        <GovernanceUpdateDetailsModal
          isOpen={true}
          companyBrandName={props.companyBrandName}
          resolution={props.resolutions[showDetailsModalForId]}
          onClose={() => setShowDetailsModalForId(undefined)}
        />
      )}
    </>
  );
};
