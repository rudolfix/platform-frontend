import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../modules/actions";
import { EETOStateOnChain } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { Button, ButtonArrowRight, EButtonLayout } from "../shared/buttons";

type TExternalProps = {
  state: EETOStateOnChain;
  etoId: string;
};

interface IDispatchProps {
  onClaim: (etoId: string) => void;
}
const PortfolioAssetActionComponent: React.SFC<TExternalProps & IDispatchProps> = ({
  state,
  etoId,
  onClaim,
}) => {
  switch (state) {
    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Payout:
      return (
        <ButtonArrowRight
          onClick={() => onClaim(etoId)}
          data-test-id={"modals.portfolio.portfolio-asset-action.claim-" + etoId}
        >
          <FormattedMessage id="portfolio.section.reserved-assets.claim-tokens" />
        </ButtonArrowRight>
      );
    // case ETOStateOnChain.Refund:
    //   return (
    //     <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
    //       <FormattedMessage id="portfolio.section.reserved-assets.refund" />
    //     </Button>
    //   );
    case EETOStateOnChain.Signing:
      return (
        <Button layout={EButtonLayout.SECONDARY} disabled>
          <FormattedMessage id="portfolio.section.reserved-assets.wait-for-update" />
        </Button>
      );

    default:
      return null;
  }
};

const PortfolioAssetAction = appConnect<{}, IDispatchProps, TExternalProps>({
  dispatchToProps: dispatch => ({
    onClaim: (etoId: string) => dispatch(actions.txTransactions.startUserClaim(etoId)),
  }),
})(PortfolioAssetActionComponent);

export { PortfolioAssetAction };
