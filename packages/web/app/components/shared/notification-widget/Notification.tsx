import { ButtonBase, ButtonClose } from "@neufund/design-system";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ENotificationType } from "../../../modules/notifications/types";
import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../../types";

import infoIcon from "../../../assets/img/notifications/info.svg";
import warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./Notification.module.scss";

export interface INotificationProps {
  type: ENotificationType;
  text: TTranslatedString;
  onClick?: () => void;
}

const icons = {
  [ENotificationType.INFO]: infoIcon,
  [ENotificationType.WARNING]: warningIcon,
};

const NotificationContent: React.FunctionComponent<Omit<INotificationProps, "onClick">> = ({
  text,
  type,
}) => (
  <div className={cn(styles.notification, type)}>
    <i className={`${styles.iconNotificationType}`}>
      <img src={icons[type]} alt="" />
    </i>
    <span data-test-id="notification-text" className={styles.text}>
      {text}
    </span>
  </div>
);

const Notification: React.FunctionComponent<INotificationProps & TDataTestId & CommonHtmlProps> = ({
  type,
  text,
  onClick,
  className,
  "data-test-id": dataTestId,
}) => (
  <section data-test-id={dataTestId} className={cn(styles.notificationWrapper, className)}>
    {onClick ? (
      <ButtonBase className="w-100" data-test-id="notification-button" onClick={onClick}>
        <NotificationContent text={text} type={type} />
      </ButtonBase>
    ) : (
      <NotificationContent text={text} type={type} />
    )}

    {onClick && (
      <ButtonClose
        className={styles.close}
        data-test-id="notification-close"
        onClick={onClick}
        iconProps={{ alt: <FormattedMessage id="common.close" /> }}
      />
    )}
  </section>
);

export { Notification, NotificationContent };
