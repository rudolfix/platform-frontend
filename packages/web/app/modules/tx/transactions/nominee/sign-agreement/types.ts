import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

import { IEquityToken } from "../../../../../lib/contracts/IEquityToken";
import { IETOCommitment } from "../../../../../lib/contracts/IETOCommitment";

export interface IAgreementContractAndHash {
  contract: IEquityToken | IETOCommitment;
  currentAgreementHash: string;
}

export const TokenAgreementContractSchema = YupTS.object({
  contract: YupTS.string(),
  currentAgreementHash: YupTS.string(),
});

export type TokenAgreementContractSchema = TypeOfYTS<typeof TokenAgreementContractSchema>;
