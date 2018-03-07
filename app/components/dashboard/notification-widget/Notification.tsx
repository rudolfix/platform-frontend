import * as React from "react";
import { Link } from "react-router-dom";
import * as styles from "./Notification.module.scss";


export enum NotificationType {
  INFO,
  WARNING
}


export interface INotification {
  id: number;
  type: NotificationType;
  text: string;
  onClose?: () => void;
  actionLink?: string;
  actionLinkText?: string;
}


export const infoClassName = 'info';
export const warningClassName = 'warning';


export const Notification: React.SFC<INotification> = ({
  type,
  text,
  onClose,
  actionLink,
  actionLinkText
}) => {

  const { INFO, WARNING } = NotificationType;

  const types = {
    [INFO]: infoClassName,
    [WARNING]: warningClassName
  };

  return (
    <div data-test-id="notification" className={`${styles.notification} ${types[type]}`}>
      <i className={`${styles.iconNotificationType}`} />
      <span data-test-id="notification-text" className={`${styles.text}`}>{text}</span>
      {
        actionLink
          && <Link data-test-id="notification-link" className={`${styles.link}`} to={actionLink}>{actionLinkText}</Link>
      }
      {
        onClose
          && <i data-test-id="notification-close" className={`${styles.close}`} onClick={onClose}/>
      }
    </div>
  )
};