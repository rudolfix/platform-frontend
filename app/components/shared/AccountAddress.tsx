import * as cn from "classnames";
import * as React from "react";
import { toast } from "react-toastify";

import { FormattedMessage } from "react-intl-phraseapp";
import { CommonHtmlProps } from "../../types";
import { Avatar } from "./Avatar";
import { ButtonIcon } from "./Buttons";

import * as clipboardIcon from "../../assets/img/inline_icons/icon-clipboard.svg";
import * as styles from "./AccountAddress.module.scss";

export interface IAccountAddressProps {
  address: string;
  "data-test-id"?: string;
}

export class AccountAddress extends React.Component<IAccountAddressProps & CommonHtmlProps> {
  private addressNode: any = React.createRef();
  private addressRef = (element: any) => (this.addressNode = element);

  private handleCopyButtonClick = (): void => {
    this.addressNode.select();
    document.execCommand("copy");

    toast.info(`Your ETH address is in clipboard!`);
  };

  render(): React.ReactNode {
    const { address, className } = this.props;

    return (
      <div className={cn(styles.accountAddress, className)}>
        <Avatar seed={address} />

        <div className={styles.addressWrapper}>
          <div className={styles.address} data-test-id="account-address.your.ether-address.div">
            {address}
            <input
              className={styles.hiddenInput}
              ref={this.addressRef}
              value={address}
              readOnly
              data-test-id="account-address.your.ether-address.input"
            />
          </div>
          <div className={styles.transactionHistory}>
            <FormattedMessage id="shared-components.account-address.transaction-history" />{" "}
            <a href={`https://etherscan.io/address/${address}`} target="_blank">
              {`https://etherscan.io`}
            </a>
          </div>
        </div>

        <ButtonIcon svgIcon={clipboardIcon} onClick={this.handleCopyButtonClick} />
      </div>
    );
  }
}
