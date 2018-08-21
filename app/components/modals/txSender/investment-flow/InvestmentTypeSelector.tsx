import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, FormGroup, Row } from "reactstrap";

import { EInvestmentType } from "../../../../modules/investmentFlowModal/reducer";
import { Money } from "../../../shared/Money";

import * as ethIcon from "../../../../assets/img/eth_icon2.svg";
import * as styles from "./InvestmentTypeSelector.module.scss";

export interface IWalletSelectionData {
    type: string;
    name: string;
    balanceEth: string;
    balanceEur?: string;
}

interface IProps {
  wallets: IWalletSelectionData[];
  currentType: EInvestmentType;
  onSelect: (type: EInvestmentType) => void
}

export class InvestmentTypeSelector extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render (): React.ReactNode {
    const { wallets, currentType, onSelect } = this.props;
    return (
      <Row>
        {wallets.map(w => (
          <Col sm="6" key={w.type}>
            <FormGroup>
              <label className={styles.wrapper}>
                <input
                  className={styles.input}
                  checked={currentType === w.type}
                  onChange={e => onSelect(e.target.value as EInvestmentType)}
                  type="radio"
                  name="investmentType"
                  value={w.type}
                />
                <div className={styles.box}>
                  <div className={styles.label}>{w.name}</div>
                  <div className={styles.balance}>
                    <div className={styles.icon}>
                      <img src={ethIcon} />
                    </div>
                    <div className={styles.balanceValues}>
                      <div className={styles.balanceEth}>
                        <Money currency="eth" value={w.balanceEth} />
                      </div>
                      {!!w.balanceEur && (
                        <div className={styles.balanceEur}>
                          = <Money currency="eur" value={w.balanceEur} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            </FormGroup>
          </Col>
        ))}
      </Row>
    );
  }
}
