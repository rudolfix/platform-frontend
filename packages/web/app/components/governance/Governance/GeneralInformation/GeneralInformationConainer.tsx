import { Button, EButtonLayout, EButtonSize, EIconPosition } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Container } from "../../../layouts/Container";
import { Heading } from "../../../shared/Heading";
import { GovernanceUpdateModal } from "./GovernanceUpdateModal";

import plusIcon from "../../../../assets/img/inline_icons/plus_bare.svg";
import styles from "./GeneralInformation.module.scss";

export type TGeneralInformationContainerProps = {
  showUpdateModal: boolean;
  toggleGovernanceUpdateModal: (show: boolean) => void;
  onUpdatePublish: (title: string) => void;
};

export const GeneralInformationContainer: React.FunctionComponent<TGeneralInformationContainerProps> = props => (
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
          onClick={() => props.toggleGovernanceUpdateModal(true)}
          data-test-id="governance-add-new-update"
        >
          <FormattedMessage id="governance.add-new-update"/>
        </Button>
      </div>
    </Container>

    {props.children}

    <GovernanceUpdateModal
      isOpen={props.showUpdateModal}
      onClose={() => props.toggleGovernanceUpdateModal(false)}
      onPublish={props.onUpdatePublish}
    />
  </>
);
