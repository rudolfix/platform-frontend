import * as React from "react";
import { Col, Row } from "reactstrap";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { BreadCrumb } from "../shared/BreadCrumb";
import { Button } from "../shared/Buttons";
import { PanelWhite } from "../shared/PanelWhite";
import { Tabs } from "../shared/Tabs";
import * as styles from "./DepositFunds.module.scss";
import { MethodEth } from "./methods/MethodEth";
import { MethodEuroToken } from "./methods/MethodEuroToken";

export const DepositFunds = () => {
  return (
    <LayoutAuthorized>
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
                  { text: "deposit neur", isSelected: false },
                  { text: "deposit eth", isSelected: true },
                ]}
              />
              <MethodEuroToken />
              <MethodEth />
              <Button onClick={() => {}}>Done</Button>
            </div>
          </PanelWhite>
        </Col>
      </Row>
    </LayoutAuthorized>
  );
};
