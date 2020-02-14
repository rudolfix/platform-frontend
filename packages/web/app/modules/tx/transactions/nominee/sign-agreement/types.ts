import { IEquityToken } from "../../../../../lib/contracts/IEquityToken";
import { IETOCommitment } from "../../../../../lib/contracts/IETOCommitment";
import * as YupTS from "../../../../../lib/yup-ts.unsafe";

export enum EAgreementType {
  RAAA = "raaa",
  THA = "tha",
  ISHA = "isha",
}

export interface IAgreementContractAndHash {
  contract: IEquityToken | IETOCommitment;
  currentAgreementHash: string;
}

export const TokenAgreementContractSchema = YupTS.object({
  contract: YupTS.string(),
  currentAgreementHash: YupTS.string(),
});

export type TokenAgreementContractSchema = YupTS.TypeOf<typeof TokenAgreementContractSchema>;
