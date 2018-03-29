import * as React from "react";
import { Col, Row } from "reactstrap";
import { BreadCrumb } from "../../../shared/BreadCrumb";
import { Button } from "../../../shared/Buttons";
import { PanelWhite } from "../../../shared/PanelWhite";
import { Tabs } from "../../../shared/Tabs";
import * as styles from "./DepositFunds.module.scss";

import { walletRoutes } from "../../routes";

interface IProps {
  path: string;
}

export const DepositFunds: React.SFC<IProps> = ({ children, path }) => {
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
                  { text: "deposit neur", isSelected: path === walletRoutes.euroToken },
                  { text: "deposit eth", isSelected: path === walletRoutes.eth },
                ]}
              />
              {children}
              <Button onClick={() => {}}>Done</Button>
            </div>
          </PanelWhite>
        </Col>
      </Row>
    </>
  );
};
