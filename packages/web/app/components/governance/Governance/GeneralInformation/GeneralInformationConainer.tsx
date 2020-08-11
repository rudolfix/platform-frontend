import { Button, EButtonLayout, EButtonSize, EIconPosition } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Container } from "../../../layouts/Container";
import { Heading } from "../../../shared/Heading";
import { GovernanceUpdateModal } from "./GovernanceUpdateModal";
import { TGovernanceUpdateModalState } from "../../../../modules/governance/reducer";

import plusIcon from "../../../../assets/img/inline_icons/plus_bare.svg";
import styles from "./GeneralInformation.module.scss";

export type TGeneralInformationContainerProps = {
  governanceUpdateModalState: TGovernanceUpdateModalState;
  openGovernanceUpdateModal: ()=> void;
  closeGovernanceUpdateModal: ()=> void;
  publish: (title: string)=> void;
  uploadFile: (file: File) =>void;
  updateForm:(formId: string, fieldPath:string,newValue:string) => void
};

export const GeneralInformationContainer: React.FunctionComponent<TGeneralInformationContainerProps> = ({
  openGovernanceUpdateModal,
  closeGovernanceUpdateModal,
  uploadFile,
  publish,
  governanceUpdateModalState,
  children,
  updateForm
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
          <FormattedMessage id="governance.add-new-update"/>
        </Button>
      </div>
    </Container>

    {children}

    <GovernanceUpdateModal
      closeGovernanceUpdateModal={closeGovernanceUpdateModal}
      uploadFile={uploadFile}
      publish={publish}
      updateForm={updateForm}
      {...governanceUpdateModalState}
    />
  </>
);
