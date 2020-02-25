import { ButtonArrowRight, EButtonLayout } from "@neufund/design-system";
import { ECountries } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Message } from "../../modals/message/Message";
import { VALUES } from "../../shared/forms/fields/form-select-fields/FormSelectCountryField";

import cityIcon from "../../../assets/img/eto/city.png";

interface IExternalProps {
  closeModal: () => void;
  restrictedJurisdiction: ECountries;
}

interface IDispatchProps {
  confirm: () => void;
}

const JurisdicitonDisclaimerModalLayout: React.FunctionComponent<IExternalProps &
  IDispatchProps> = ({ closeModal, confirm, restrictedJurisdiction }) => (
  <Message
    data-test-id="jurisdiction-disclaimer-modal"
    image={<img src={cityIcon} alt="Image" className="mb-3 w-50" />}
    text={
      <FormattedMessage
        id="jurisdiction-disclaimer.text"
        values={{
          jurisdiction: VALUES[restrictedJurisdiction],
          lineBreak: <br />,
        }}
      />
    }
  >
    <ButtonArrowRight onClick={closeModal} data-test-id="jurisdiction-disclaimer-modal.deny">
      <FormattedMessage id="form.select.yes-i-am" />
    </ButtonArrowRight>
    <ButtonArrowRight
      onClick={confirm}
      layout={EButtonLayout.GHOST}
      data-test-id="jurisdiction-disclaimer-modal.confirm"
    >
      <FormattedMessage id="form.select.no-i-am-not" />
    </ButtonArrowRight>
  </Message>
);

const JurisdictionDisclaimerModal = appConnect<{}, IDispatchProps, IExternalProps>({
  dispatchToProps: dispatch => ({
    confirm: () => dispatch(actions.eto.confirmJurisdictionDisclaimer()),
  }),
})(JurisdicitonDisclaimerModalLayout);

export { JurisdictionDisclaimerModal, JurisdicitonDisclaimerModalLayout };
