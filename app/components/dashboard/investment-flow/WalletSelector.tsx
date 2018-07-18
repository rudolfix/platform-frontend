import { Field, FormikProps } from 'formik'
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup } from "reactstrap";
import * as ethIcon from '../../../assets/img/eth_icon2.svg'
import * as checkIcon from "../../../assets/img/inline_icons/check.svg";
import { InlineIcon } from '../../shared/InlineIcon';
import { Money } from '../../shared/Money'
import * as styles from './WalletSelector.module.scss'


interface IProps {
  wallets: Array<{
    id: string
    name: string
    balanceEth: string
    balanceEur?: string
  }>
  name: string
}


export class WalletSelector extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render (): React.ReactNode {
    const { wallets, name } = this.props
    const { setFieldValue } = this.context.formik as FormikProps<any>;
    return <FormGroup>
      {wallets.map((w) => (
        <FormGroup key={w.id}>
          <Field
            name={name}
            render={() => {
              return (
                <label className={styles.wrapper}>
                  <input
                    className={styles.input}
                    onChange={() => setFieldValue(name, w.id)}
                    type="radio"
                    name={name}
                    value={w.id}
                    // data-test-id={dataTestId} // TODO: check if this is needed */}
                  />
                  <div className={styles.box}>
                    <div className={styles.label}>{w.name}</div>
                    <div className={styles.balance}>
                      <div className={styles.icon}><img src={ethIcon} /></div>
                      <div className={styles.balanceValues}>
                        <div className={styles.balanceEth}><Money currency="eth" value={w.balanceEth} /></div>
                        {!!w.balanceEur && (
                        <div className={styles.balanceEur}>= <Money currency="eur" value={w.balanceEur}/></div>
                        )}
                      </div>
                    </div>
                    <div className={styles.checked}><InlineIcon svgIcon={checkIcon}/></div>
                  </div>
                </label>
              )
            }}
          >
          </Field>
        </FormGroup>
      ))}
    </FormGroup>
  }
}
