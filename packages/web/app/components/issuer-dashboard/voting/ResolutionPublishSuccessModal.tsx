import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import successImage from "../../../assets/img/modal-icon_metamask.svg";
import { shareholderResolutionsVotingSetupModuleApi } from "../../../modules/shareholder-resolutions-voting-setup/module";
import { appConnect } from "../../../store";
import { Modal } from "../../modals/Modal";
import { Heading } from "../../shared/Heading";

import * as styles from "./ResolutionPublishSuccessModal.module.scss";

type TStateProps = {
  showModal: boolean;
};

type TDispatchProps = {
  onClose: () => void;
};

export const ResolutionPublishSuccessModalLayout: React.FunctionComponent<TStateProps &
  TDispatchProps> = props => (
  <Modal isOpen={props.showModal} onClose={props.onClose} className={styles.main}>
    <img src={successImage} alt="Success" />

    <Heading level={4} decorator={false} className={styles.title}>
      <FormattedMessage id="common.success" />
    </Heading>

    <p className={styles.description}>
      <FormattedHTMLMessage
        tagName="span"
        id="eto-dashboard.voting-resolution-published-modal.description"
      />
      <br />
      <a href="https://platform.neufund.org/absdfw1234551/voting/" className={styles.link}>
        https://platform.neufund.org/absdfw1234551/voting/
      </a>
    </p>
  </Modal>
);

export const ResolutionPublishSuccessModal = compose<TStateProps & TDispatchProps, {}>(
  appConnect({
    stateToProps: state => ({
      showModal: shareholderResolutionsVotingSetupModuleApi.selectors.selectShowSuccessModal(state),
    }),
    dispatchToProps: dispatch => ({
      onClose: () =>
        dispatch(shareholderResolutionsVotingSetupModuleApi.actions.closeSuccessModal()),
    }),
  }),
)(ResolutionPublishSuccessModalLayout);
