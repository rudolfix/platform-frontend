import * as cn from "classnames";
import * as React from 'react';
import { toast } from 'react-toastify';

import { FormattedMessage } from 'react-intl-phraseapp';
import { CommonHtmlProps } from '../../types';
import { ButtonIcon } from './Buttons';
import { IResponsiveImage, ResponsiveImage } from './ResponsiveImage';

import * as clipboardIcon from "../../assets/img/inline_icons/icon-clipboard.svg";
import * as styles from './AccountAddress.module.scss';

export interface IAccountAddressProps {
  address: string;
  avatar: IResponsiveImage;
}

export class AccountAddress extends React.Component<IAccountAddressProps & CommonHtmlProps> {
  private addressNode: any = React.createRef()
  private addressRef = (element: any) => this.addressNode = element;

  private handleCopyButtonClick = (): void => {
    this.addressNode.select();
    document.execCommand("copy");

    toast.info(`Your ETH address is in clipboard!`);
  }

  render ():React.ReactNode {
    const { avatar, address, className } = this.props;

    return (
      <div className={cn(styles.accountAddress, className)}>
        <div className={styles.avatar}>
          <ResponsiveImage
            srcSet={avatar.srcSet}
            alt={avatar.alt}
          />
        </div>

        <div className={styles.addressWrapper}>
          <input
            type="text"
            className={styles.address}
            ref={this.addressRef}
            value={address}
            readOnly={true}
            spellCheck={false}
            size={46}
          />
          <div className={styles.transactionHistory}>
            <FormattedMessage id="shared-components.account-address.transaction-history" />
            {" "}
            <a href={`https://etherscan.io/address/${address}`} target="_blank">https://etherscan.io</a>
          </div>
        </div>

        <ButtonIcon
          svgIcon={clipboardIcon}
          onClick={this.handleCopyButtonClick}
        />
      </div>
    )
  }
}
