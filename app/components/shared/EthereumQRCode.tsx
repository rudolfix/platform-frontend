import EthereumQRPlugin from 'ethereum-qr-code'
import { uniqueId } from 'lodash';
import * as React from 'react';

interface IProps {
  uriScheme?: string,
  to: string,
  value: number,
  gas: number,
}

export class EthereumQRCode extends React.Component<IProps> {

  private generator = new EthereumQRPlugin();

  private id = uniqueId('qrCode');

  componentDidMount ():void {
    this.generateQRCode();
  }

  componentDidUpdate ():void {
    this.generateQRCode();
  }

  generateQRCode ():void {
    const { to, value, gas, uriScheme } = this.props;
    const sendDetails = uriScheme
      ? this.generator.readStringToJSON(uriScheme)
      : { to, value, gas };

    const qrCode = this.generator.toCanvas(sendDetails, {
      selector: `#${this.id}`,
    });
  }

  render (): React.ReactNode {
    return (
      <div id={this.id}></div>
    );
  }
}
