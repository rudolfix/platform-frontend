import {
  assertNever,
  ECurrency,
  EquityToken,
  isInEnum,
  OnlyUnion,
  TToken,
} from "@neufund/shared-utils";
import * as React from "react";

import { AppError } from "classes/AppError";

import { Eth } from "components/shared/formatters";
import { Equity } from "components/shared/formatters/Equity";
import { Eur } from "components/shared/formatters/Eur";
import { EurToken } from "components/shared/formatters/EurToken";
import { Neu } from "components/shared/formatters/Neu";

type TKnownToken =
  | TToken<ECurrency.EUR>
  | TToken<ECurrency.ETH>
  | TToken<ECurrency.EUR_TOKEN>
  | TToken<ECurrency.NEU>;

const isWellKnownToken = (token: TToken): token is TKnownToken => isInEnum(ECurrency, token.type);

const isEquityToken = (token: TToken): token is TToken<EquityToken> =>
  !isInEnum(ECurrency, token.type);

type TExternalProps<T extends ECurrency | EquityToken> = {
  // `OnlyUnion` will make sure during compile time that `MoneyUnsafe` is only used for non narrowed tokens
  token: TToken<OnlyUnion<T>>;
};

class MoneyTypeError extends AppError {
  constructor(type: unknown) {
    super(`MoneyTypeError: ${String(type)}`);
  }
}

/**
 * A top level wrapper for more specific money representations.
 * @note This component is unsafe from type system point of view.
 *        If you know the exact money representation you should use specific components (Eur/Eth/Neu/etc) as they make sure you assign a proper value to a proper component.
 *
 */
const MoneyUnsafe = <T extends ECurrency | EquityToken>({ token }: TExternalProps<T>) => {
  if (isWellKnownToken(token)) {
    // TODO: Don't know how to force generic type-guard to be properly narrowed
    // `token` is for some reason not narrowed in `isWellKnownToken` properly
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const narrowedToken = token as TKnownToken;

    switch (narrowedToken.type) {
      case ECurrency.EUR:
        return <Eur token={narrowedToken} />;
      case ECurrency.ETH:
        return <Eth token={narrowedToken} />;
      case ECurrency.EUR_TOKEN:
        return <EurToken token={narrowedToken} />;
      case ECurrency.NEU:
        return <Neu token={narrowedToken} />;
      default:
        return assertNever(narrowedToken);
    }
  }

  if (isEquityToken(token)) {
    return <Equity token={token} />;
  }

  throw new MoneyTypeError(token.type);
};

export { MoneyUnsafe };
