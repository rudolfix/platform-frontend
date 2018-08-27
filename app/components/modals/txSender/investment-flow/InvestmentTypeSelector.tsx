import * as cn from "classnames"
import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, FormGroup, Row } from "reactstrap";

import { EInvestmentType } from "../../../../modules/investmentFlow/reducer";
import { Money } from "../../../shared/Money";

import * as styles from "./InvestmentTypeSelector.module.scss";

export interface IWalletSelectionData {
    type: string;
    name: string;
    icon: string;
    balanceEth?: string;
    balanceNEuro?: string;
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
    const selected = currentType !== EInvestmentType.None
    return (
      <Row className={selected && styles.selected}>
        {wallets.map(w => {
          const checked = currentType === w.type;
          return (
            <Col sm="6" key={w.type}>
              <FormGroup>
                <label className={cn(styles.wrapper, checked && styles.checked)}>
                  <input
                    className={styles.input}
                    checked={checked}
                    onChange={e => onSelect(e.target.value as EInvestmentType)}
                    type="radio"
                    name="investmentType"
                    value={w.type}
                  />
                  <div className={styles.box}>
                    <div className={styles.icon}>
                      <img src={w.icon} />
                    </div>
                    <div className={styles.label}>{w.name}</div>
                    <div className={styles.balance}>
                      <div className={styles.balanceValues}>
                        {w.balanceEth && (
                          <Money currency="eth" value={w.balanceEth} />
                        )}
                        {w.balanceNEuro && (
                          <Money currency="eur_token" value={w.balanceNEuro} />
                        )}
                        {w.balanceEur && (
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
          )
        })}
      </Row>
    );
  }
}
