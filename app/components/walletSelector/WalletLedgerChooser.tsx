import * as React from "react";

import { ILedgerAccount } from "../../../typings/typings";
import { WalletLedgerChooserComponent } from "./WalletLedgerChooserComponent";

export const WalletLedgerChooser = () => {
  // logic will be here
  const loading = false;
  const accounts = [
    {
      address: "0x6C1086C292a7E1FdF66C68776eA972038467A370",
      derivationPath: "44'/60'/0'/0",
      balance: "1.6495ETH",
    },
    {
      address: "0xB2A0e2688c5A82bEEe6818F5a3D206680FdFD75d",
      derivationPath: "44'/60'/0'/1",
      balance: "0",
    },
    {
      address: "0xa13D14DA39529761a6C45F4f556700735E0774a8",
      derivationPath: "44'/60'/0'/2",
      balance: "0",
    },
    {
      address: "0x3cC2ef578f6Eb7ff63f9CA8f5a54cfe40339256A",
      derivationPath: "44'/60'/0'/3",
      balance: "1.6495ETH",
    },
  ];
  const handleAddressChosen = (ledgerAccount: ILedgerAccount) => {
    alert(`address ${ledgerAccount.address}`);
  };
  const hasPreviousAddress = true;
  const showPrevAddresses = () => {
    alert("prev address clicked");
  };
  const showNextAddresses = () => {
    alert("next address clicked");
  };
  const derivationPath = "44'/60'/0'/0";
  const onDerivationPathChange = () => {
    alert("derivation path changed");
  };
  const invalidDerivationPath = false;

  return (
    <WalletLedgerChooserComponent
      loading={loading}
      accounts={accounts}
      handleAddressChosen={handleAddressChosen}
      hasPreviousAddress={hasPreviousAddress}
      showPrevAddresses={showPrevAddresses}
      showNextAddresses={showNextAddresses}
      derivationPath={derivationPath}
      onDerivationPathChange={onDerivationPathChange}
      invalidDerivationPath={invalidDerivationPath}
    />
  );
};
