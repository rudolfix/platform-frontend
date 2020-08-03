import { EquityTokenPriceEuro, Eur, Percentage } from "@neufund/design-system";
import {
  EETOStateOnChain,
  IEtoTokenGeneralDiscounts,
  IPersonalDiscount,
} from "@neufund/shared-modules";
import { isZero } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

interface IExternalProps {
  onChainState: EETOStateOnChain;
  etoTokenGeneralDiscounts: IEtoTokenGeneralDiscounts;
  etoTokenPersonalDiscount: IPersonalDiscount;
  etoTokenStandardPrice: number;
}

const PersonalWhitelistDiscountMessage: React.FunctionComponent<Pick<
  IExternalProps,
  "etoTokenPersonalDiscount"
>> = ({ etoTokenPersonalDiscount }) => (
  <FormattedMessage
    id="investment-flow.token-price-info.personal-discount"
    values={{
      whitelistDiscountAmountLeft: (
        <Eur
          data-test-id="investment-flow.token-price.personal-discount.amount-left"
          value={etoTokenPersonalDiscount.whitelistDiscountAmountLeft}
        />
      ),
      discountedTokenPrice: (
        <EquityTokenPriceEuro
          data-test-id="investment-flow.token-price.personal-discount.price"
          value={etoTokenPersonalDiscount.discountedTokenPrice}
        />
      ),
      whitelistDiscountPercentage: (
        <Percentage
          data-test-id="investment-flow.token-price.personal-discount.discount"
          value={(Number(etoTokenPersonalDiscount.whitelistDiscount) * 100).toString()}
        />
      ),
    }}
  />
);

const PersonalWhitelistDiscountGeneralDiscountMessage: React.FunctionComponent<Pick<
  IExternalProps,
  "etoTokenGeneralDiscounts"
>> = ({ etoTokenGeneralDiscounts }) => (
  <FormattedMessage
    id="investment-flow.token-price-info.personal-discount.general-discount"
    values={{
      discountTokenPrice: (
        <EquityTokenPriceEuro
          data-test-id="investment-flow.token-price.personal-discount.general-discount.price"
          value={etoTokenGeneralDiscounts.discountedTokenPrice}
        />
      ),
      discountTokenPricePercentage: (
        <Percentage
          data-test-id="investment-flow.token-price.personal-discount.general-discount.discount"
          value={(Number(etoTokenGeneralDiscounts.whitelistDiscount) * 100).toString()}
        />
      ),
    }}
  />
);

const PersonalWhitelistDiscountNoGeneralDiscountMessage: React.FunctionComponent<Pick<
  IExternalProps,
  "etoTokenStandardPrice"
>> = ({ etoTokenStandardPrice }) => (
  <FormattedMessage
    id="investment-flow.token-price-info.personal-discount.no-discount"
    values={{
      tokenPriceEur: <EquityTokenPriceEuro value={etoTokenStandardPrice.toString()} />,
    }}
  />
);

const GeneralWhitelistDiscountMessage: React.FunctionComponent<Pick<
  IExternalProps,
  "etoTokenGeneralDiscounts"
>> = ({ etoTokenGeneralDiscounts }) => (
  <FormattedMessage
    id="investment-flow.token-price-info.general-discount"
    values={{
      discountTokenPrice: (
        <EquityTokenPriceEuro
          data-test-id="investment-flow.token-price.whitelist-discount.price"
          value={etoTokenGeneralDiscounts.discountedTokenPrice}
        />
      ),
      discountTokenPricePercentage: (
        <Percentage
          data-test-id="investment-flow.token-price.whitelist-discount.discount"
          value={(Number(etoTokenGeneralDiscounts.whitelistDiscount) * 100).toString()}
        />
      ),
    }}
  />
);

const GeneralPublicDiscountMessage: React.FunctionComponent<Pick<
  IExternalProps,
  "etoTokenGeneralDiscounts"
>> = ({ etoTokenGeneralDiscounts }) => (
  <FormattedMessage
    id="investment-flow.token-price-info.general-discount"
    values={{
      discountTokenPrice: <EquityTokenPriceEuro value={etoTokenGeneralDiscounts.publicDiscount} />,
      discountTokenPricePercentage: (
        <Percentage value={Number(etoTokenGeneralDiscounts.publicDiscountFrac * 100).toString()} />
      ),
    }}
  />
);

const NoDiscountMessage: React.FunctionComponent<Pick<IExternalProps, "etoTokenStandardPrice">> = ({
  etoTokenStandardPrice,
}) => (
  <FormattedMessage
    id="investment-flow.token-price-info.no-discount"
    values={{
      tokenPriceEur: (
        <EquityTokenPriceEuro
          data-test-id="investment-flow.token-price.no-discount.price"
          value={etoTokenStandardPrice.toString()}
        />
      ),
    }}
  />
);

const InvestmentPriceInfo: React.FunctionComponent<IExternalProps> = ({
  onChainState,
  etoTokenPersonalDiscount,
  etoTokenGeneralDiscounts,
  etoTokenStandardPrice,
}) => {
  switch (onChainState) {
    case EETOStateOnChain.Whitelist: {
      // do not show personal discount if the amount left is less than 1 cent
      const isTherePersonalWhitelistDiscount = new BigNumber(
        etoTokenPersonalDiscount.whitelistDiscountAmountLeft,
      ).greaterThanOrEqualTo("0.01");
      const isThereGeneralWhitelistDiscount = !isZero(etoTokenGeneralDiscounts.whitelistDiscount);

      if (isTherePersonalWhitelistDiscount) {
        return (
          <>
            <PersonalWhitelistDiscountMessage etoTokenPersonalDiscount={etoTokenPersonalDiscount} />{" "}
            {isThereGeneralWhitelistDiscount ? (
              <PersonalWhitelistDiscountGeneralDiscountMessage
                etoTokenGeneralDiscounts={etoTokenGeneralDiscounts}
              />
            ) : (
              <PersonalWhitelistDiscountNoGeneralDiscountMessage
                etoTokenStandardPrice={etoTokenStandardPrice}
              />
            )}
          </>
        );
      }

      if (isThereGeneralWhitelistDiscount) {
        return (
          <GeneralWhitelistDiscountMessage etoTokenGeneralDiscounts={etoTokenGeneralDiscounts} />
        );
      }

      return <NoDiscountMessage etoTokenStandardPrice={etoTokenStandardPrice} />;
    }
    case EETOStateOnChain.Public:
      if (!isZero(etoTokenGeneralDiscounts.publicDiscountFrac.toString())) {
        return <GeneralPublicDiscountMessage etoTokenGeneralDiscounts={etoTokenGeneralDiscounts} />;
      }

      return <NoDiscountMessage etoTokenStandardPrice={etoTokenStandardPrice} />;
    default:
      throw new Error(
        `Eto on chain state should be either ${EETOStateOnChain.Whitelist} or ${EETOStateOnChain.Public}, received ${onChainState}`,
      );
  }
};

export { InvestmentPriceInfo };
