import { TTxHistory } from "@neufund/shared-modules";

export enum ETransactionKind {
  SUCCESSFUL = "successful",
  PENDING = "pending",
}

export type TTransaction =
  | ({ kind: ETransactionKind.SUCCESSFUL } & TTxHistory)
  | ({ kind: ETransactionKind.PENDING } & TTxHistory);
