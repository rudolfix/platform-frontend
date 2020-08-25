import { Button, EButtonLayout, EButtonSize, EIconPosition } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TGovernanceUpdateModalState } from "../../../../modules/governance/reducer";
import { Container } from "../../../layouts/Container";
import { Heading } from "../../../shared/Heading";
import { GovernanceUpdateModal } from "./GovernanceUpdateModal";

import plusIcon from "../../../../assets/img/inline_icons/plus_bare.svg";
import styles from "./GeneralInformation.module.scss";

export type TGeneralInformationContainerProps = {
  governanceUpdateModalState: TGovernanceUpdateModalState;
  openGovernanceUpdateModal: () => void;
  closeGovernanceUpdateModal: () => void;
  publishUpdate: () => void;
  uploadFile: (file: File) => void;
  removeFile: () => void;
  onFormChange: (formId: string, fieldPath: string, newValue: string) => void;
  onFormBlur: (formId: string, fieldPath: string, newValue: string) => void;
};

export const GeneralInformationContainer: React.FunctionComponent<TGeneralInformationContainerProps> = ({
  openGovernanceUpdateModal,
  closeGovernanceUpdateModal,
  uploadFile,
  removeFile,
  publishUpdate,
  governanceUpdateModalState,
  children,
  onFormChange,
  onFormBlur,
}) => (
  <>
    <Container>
      <div className={styles.titleRow}>
        <Heading level={3} decorator={false}>
          <FormattedMessage id="governance.title.general-information" />
        </Heading>

        <Button
          iconPosition={EIconPosition.ICON_BEFORE}
          layout={EButtonLayout.PRIMARY}
          size={EButtonSize.NORMAL}
          svgIcon={plusIcon}
          onClick={openGovernanceUpdateModal}
          data-test-id="governance-add-new-update"
        >
          <FormattedMessage id="governance.add-new-update" />
        </Button>
      </div>
    </Container>

    {children}

    <GovernanceUpdateModal
      closeGovernanceUpdateModal={closeGovernanceUpdateModal}
      uploadFile={uploadFile}
      removeFile={removeFile}
      publishUpdate={publishUpdate}
      onFormChange={onFormChange}
      onFormBlur={onFormBlur}
      {...governanceUpdateModalState}
    />
  </>
);
