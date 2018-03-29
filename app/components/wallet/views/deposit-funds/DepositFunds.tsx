import * as React from "react";
import { Col, Row } from "reactstrap";
import { actions } from "../../../../modules/actions";
import { BreadCrumb } from "../../../shared/BreadCrumb";
import { Button } from "../../../shared/Buttons";
import { PanelWhite } from "../../../shared/PanelWhite";
import { Tabs } from "../../../shared/Tabs";
import * as styles from "./DepositFunds.module.scss";

import { compose } from "redux";
import { appConnect } from "../../../../store";
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

export const DepositFunds: React.SFC<IProps> = ({ children }) => {
  return (
    <>
      <Row>
        <Col>
          <BreadCrumb path={["Dashboard", "Wallet"]} view={"Deposit funds"} className="pt-5 pb-5" />
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
                    text: "deposit neur",
                    path: walletRoutes.euroToken,
                  },
                  {
                    text: "deposit eth",
                    path: walletRoutes.eth,
                  },
                ]}
              />
              {children}
              <DoneButton>Done</DoneButton>
            </div>
          </PanelWhite>
        </Col>
      </Row>
    </>
  );
};
