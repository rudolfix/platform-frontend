import * as React from "react";

import { compose } from "redux";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";

import { PersonProfileModal } from "../modals/PersonProfileModal";
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
      <EtoPublicComponent companyData={companyData} etoData={etoData} />
      <PersonProfileModal />
    </LayoutAuthorized>
  );
};

export const EtoPublicViewComponent: React.SFC<IProps> = props => <EtoPublicView {...props} />;

export const EtoPublicView = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.etoFlow.loadDataStart()),
  }),
  appConnect({
    stateToProps: s => ({
      companyData: s.etoFlow.companyData,
      etoData: s.etoFlow.etoData,
    }),
  }),
)(Page);
