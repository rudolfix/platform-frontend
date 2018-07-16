import * as React from "react";
import { Alert } from 'reactstrap';
import * as styles from './Alerts.module.scss'

export const InfoAlert: React.SFC = ({ children }) => {
  return (
    <div className={'alert ' + styles.alert}>{children}</div>
  )
}
