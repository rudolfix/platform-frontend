import * as cn from "classnames";
import * as React from "react";

import { NotificationType } from "../../../modules/notifications/reducer";
import { ButtonClose } from "../../shared/Buttons";

import * as styles from "./Notification.module.scss";

import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";

export interface INotificationProps {
  type: NotificationType;
  text: string;
  actionLinkText?: string;
  onClick: () => void;
}

const { INFO, WARNING } = NotificationType;

const icons = {
  [INFO]: infoIcon,
  [WARNING]: warningIcon,
};

export const Notification: React.SFC<INotificationProps> = ({
  type,
  text,
  onClick,
  actionLinkText,
}) => (
  <div data-test-id="notification" className={cn(styles.notification, type)}>
    <i className={`${styles.iconNotificationType}`}>
      <img src={icons[type]} />
    </i>
    <span data-test-id="notification-text" className={styles.text}>
      {text}
    </span>
    {actionLinkText ? (
      <span data-test-id="notification-close" className={styles.link} onClick={onClick}>
        {actionLinkText}
      </span>
    ) : (
      <i className={styles.close} data-test-id="notification-close" onClick={onClick}>
        <ButtonClose />
      </i>
    )}
  </div>
);
