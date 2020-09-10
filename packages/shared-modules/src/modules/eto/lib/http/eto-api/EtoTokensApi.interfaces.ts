import { TypeOfYTS, YupTS } from "../../../../../lib/yup/yup-ts.unsafe";

const TokenholderSchema = YupTS.object({
  amount: YupTS.number(),
  email: YupTS.string(),
  userId: YupTS.string(),
});

const TokenholdersSchema = YupTS.array(TokenholderSchema);

type TTokenholder = TypeOfYTS<typeof TokenholderSchema>;

type TTokenholders = TypeOfYTS<typeof TokenholdersSchema>;

export { TokenholderSchema, TokenholdersSchema, TTokenholder, TTokenholders };
