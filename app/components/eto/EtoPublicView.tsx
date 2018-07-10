import * as React from "react";

import { compose } from "redux";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";

import { FormattedMessage } from "react-intl";
import { Button } from "../shared/Buttons";
import { ViewSubHeaderPanel } from "../shared/ViewSubHeaderPanel";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

interface IProps {
  companyData: any;
  etoData: any;
}

interface ICurrencies {
  [key: string]: string;
}

export const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR",
};

const Page: React.SFC<IProps> = ({ companyData, etoData }) => {
  return (
    <LayoutAuthorized>
      <ViewSubHeaderPanel>
        <Button>
          <FormattedMessage id="eto.ico-monitor" />
        </Button>
      </ViewSubHeaderPanel>
      <EtoPublicComponent companyData={companyData} etoData={etoData} />
    </LayoutAuthorized>
  );
};

export const EtoPublicViewComponent: React.SFC<IProps> = props => <EtoPublicView {...props} />;

export const EtoPublicView = compose<React.SFC>(
  appConnect({
    stateToProps: s => ({
      companyData: s.etoFlow.companyData,
      etoData: s.etoFlow.etoData,
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.etoFlow.loadDataStart()),
  }),
)(Page);
