import * as React from "react";
import { Col, Row } from "reactstrap";
import { actions } from "../../../../modules/actions";
import { BreadCrumb } from "../../../shared/BreadCrumb";
import { Button } from "../../../shared/Buttons";
import { PanelWhite } from "../../../shared/PanelWhite";
import { Tabs } from "../../../shared/Tabs";
import * as styles from "./DepositFunds.module.scss";

import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";
import { appConnect } from "../../../../store";
import { injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { walletRoutes } from "../../routes";

const DoneButton = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      onClick: () => dispatch(actions.routing.goToWallet()),
    }),
  }),
)(Button);

interface IProps {
  path: string;
}

export const DepositFunds = injectIntlHelpers<IProps>(
  ({ children, intl: { formatIntlMessage } }) => {
    return (
      <>
        <Row>
          <Col>
            <BreadCrumb
              path={[formatIntlMessage("dashboard.name"), formatIntlMessage("wallet.name")]}
              view={formatIntlMessage("wallet.deposit-funds.name")}
              className="pt-5 pb-5"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={{ size: 10, offset: 1 }}>
            <PanelWhite>
              <div className={styles.panelContent}>
                <Tabs
                  className="mb-5"
                  tabs={[
                    {
                      text: formatIntlMessage("wallet.deposit-funds.menu.eur"),
                      path: walletRoutes.euroToken,
                    },
                    {
                      text: formatIntlMessage("wallet.deposit-funds.menu.eth"),
                      path: walletRoutes.eth,
                    },
                  ]}
                />
                {children}
                <DoneButton>
                  <FormattedMessage id="form.button.done" />
                </DoneButton>
              </div>
            </PanelWhite>
          </Col>
        </Row>
      </>
    );
  },
);
