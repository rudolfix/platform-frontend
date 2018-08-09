import { Form, Formik, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import * as Web3 from "web3";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { FormFieldColorful } from "../../shared/forms/formField/FormFieldColorful";
import { Panel } from "../../shared/Panel";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./CheckYourICBMWalletWidget.module.scss";

interface IDispatchProps {
  onSubmit: () => void;
}

class FormContent extends React.Component {
  static contextTypes = {
    formik: PropTypes.object,
  };

  web3 = new Web3();

  render(): React.ReactNode {
    const { values } = this.context.formik as FormikProps<any>;

    return (
      <>
        <FormFieldColorful name="address" placeholder="0xff2bee8169957caa2f5a34af7bf8e717fea7f" />
        <Button
          className={styles.button}
          layout="secondary"
          iconPosition="icon-after"
          svgIcon={arrowRight}
          type="submit"
          disabled={!this.web3.isAddress(values.address)}
        >
          <FormattedMessage id="check-your-icbm-wallet-widget.submit" />
        </Button>
      </>
    );
  }
}

class CheckYourICBMWalletWidgetComponent extends React.Component<IDispatchProps> {
  render(): React.ReactNode {
    return (
      <Panel
        headerText={<FormattedMessage id="check-your-icbm-wallet-widget.header" />}
        className="h-100"
      >
        <p>
          <FormattedMessage id="check-your-icbm-wallet-widget.notice" />
        </p>
        <Formik initialValues={{ address: "" }} onSubmit={this.props.onSubmit}>
          <Form>
            <FormContent />
          </Form>
        </Formik>
      </Panel>
    );
  }
}

export const CheckYourICBMWalletWidget = appConnect<IDispatchProps>({
  dispatchToProps: dispatch => ({
    onSubmit: () => {
      dispatch(actions.icbmWalletBalanceModal.showIcbmWalletBalanceModal("0x8e75544b848f0a32a1ab119e3916ec7138f3bed2"))
      dispatch(actions.wallet.getWalletData("0x8e75544b848f0a32a1ab119e3916ec7138f3bed2"))
    },
  }),
})(CheckYourICBMWalletWidgetComponent);
