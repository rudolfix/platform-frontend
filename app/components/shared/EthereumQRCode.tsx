import * as QRCode from "qrcode";
import * as React from "react";

interface IProps {
  address: string;
  value?: number;
  gas?: number;
}

export class EthereumQRCode extends React.Component<IProps> {
  private qrCode = "";

  generateQRCode(): void {
    const { address, value, gas } = this.props;
    const computedValue = value && `?value=${value}`;
    const computedGas = gas && `?gas=${gas}`;

    const url = `ethereum:${address}${computedValue}${computedGas}`;

    QRCode.toString(url, (err: any, string: string) => {
      if (err) {
        throw err;
      }

      this.qrCode = string;
    });
  }

  componentDidUpdate(): void {
    this.generateQRCode();
  }

  render(): React.ReactNode {
    return <div dangerouslySetInnerHTML={{ __html: this.qrCode }} />;
  }
}
