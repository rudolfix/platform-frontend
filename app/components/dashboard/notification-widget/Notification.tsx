import * as React from "react";
import { Link } from "react-router-dom";
import * as styles from "./Notification.module.scss";

import * as closeIcon from "../../../assets/img/close.svg";
import * as infoIcon from "../../../assets/img/notfications/info.svg";
import * as warningIcon from "../../../assets/img/notfications/warning.svg";

export enum NotificationType {
  INFO,
  WARNING,
}

export interface INotification {
  id: number;
  type: NotificationType;
  text: string;
  onClose?: () => void;
  actionLink?: string;
  actionLinkText?: string;
}

export const infoClassName = "info";
export const warningClassName = "warning";

export const Notification: React.SFC<INotification> = ({
  type,
  text,
  onClose,
  actionLink,
  actionLinkText,
}) => {
  const { INFO, WARNING } = NotificationType;

  const types = {
    [INFO]: infoClassName,
    [WARNING]: warningClassName,
  };

  const icons = {
    [INFO]: infoIcon,
    [WARNING]: warningIcon,
  };

  return (
    <div data-test-id="notification" className={`${styles.notification} ${types[type]}`}>
      <i className={`${styles.iconNotificationType}`}>
        <img src={icons[type]} />
      </i>
      <span data-test-id="notification-text" className={`${styles.text}`}>
        {text}
      </span>
      {actionLink && (
        <Link data-test-id="notification-link" className={`${styles.link}`} to={actionLink}>
          {actionLinkText}
        </Link>
      )}
      {onClose && (
        <i data-test-id="notification-close" className={`${styles.close}`} onClick={onClose}>
          <img src={closeIcon} />
        </i>
      )}
    </div>
  );
};
