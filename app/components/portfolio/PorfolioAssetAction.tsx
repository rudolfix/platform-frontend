import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { ETOStateOnChain } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { Button } from "../shared/buttons";

import * as arrowIcon from "../../assets/img/inline_icons/arrow_right.svg";

type TExternalProps = {
  state: ETOStateOnChain;
  etoId: string;
};

type TDispatchProps = {
  claim: () => void;
};

const PortfolioAssetActionLayout: React.SFC<TExternalProps & TDispatchProps> = ({
  state,
  claim,
}) => {
  switch (state) {
    case ETOStateOnChain.Claim:
    case ETOStateOnChain.Payout:
      return (
        <Button onClick={claim} layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
          <FormattedMessage id="portfolio.section.reserved-assets.claim-tokens" />
        </Button>
      );
    case ETOStateOnChain.Refund:
      return (
        <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
          <FormattedMessage id="portfolio.section.reserved-assets.refund" />
        </Button>
      );
    case ETOStateOnChain.Signing:
      return (
        <Button layout="simple" disabled>
          <FormattedMessage id="portfolio.section.reserved-assets.wait-for-update" />
        </Button>
      );

    default:
      return null;
  }
};

export const PortfolioAssetAction = compose<TExternalProps & TDispatchProps, TExternalProps>(
  appConnect<{}, TDispatchProps, TExternalProps>({
    dispatchToProps: (dispatch, props) => ({
      claim: () => dispatch(actions.investorEtoTicket.claim(props.etoId)),
    }),
  }),
)(PortfolioAssetActionLayout);
