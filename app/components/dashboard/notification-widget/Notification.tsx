import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";

import { ButtonClose } from "../../shared/Buttons";

import * as styles from "./Notification.module.scss";
import * as infoIcon from "../../../assets/img/notfications/info.svg";
import * as warningIcon from "../../../assets/img/notfications/warning.svg";

export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
}

export interface INotification {
  id: number;
  type: NotificationType;
  text: string;
  onClose?: () => void;
  actionLink?: string;
  actionLinkText?: string;
  className?: string;
}

const { INFO, WARNING } = NotificationType;

const icons = {
  [INFO]: infoIcon,
  [WARNING]: warningIcon,
};

export const Notification: React.SFC<INotification> = ({
  type,
  text,
  onClose,
  actionLink,
  actionLinkText,
  className,
}) => {
  return (
    <div data-test-id="notification" className={cn(styles.notification, type, className)}>
      <i className={`${styles.iconNotificationType}`}>
        <img src={icons[type]} />
      </i>
      <span data-test-id="notification-text" className={styles.text}>
        {text}
      </span>
      {actionLink && (
        <Link data-test-id="notification-link" className={styles.link} to={actionLink}>
          {actionLinkText}
        </Link>
      )}
      {onClose && (
        <i className={styles.close} data-test-id="notification-close" onClick={onClose}>
          <ButtonClose />
        </i>
      )}
    </div>
  );
};
