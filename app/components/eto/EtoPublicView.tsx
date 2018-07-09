import * as React from "react";

import { compose } from "redux";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";

import { EtoPublicComponent } from "./shared/EtoPublicComponent";

const peopleNodes = peopleCarouselData.map(person => {
  return (
    <SlidePerson
      key={person.name}
      name={person.name}
      title={person.title}
      bio={person.bio}
      srcSet={person.image}
      layout="vertical" />
  )
})

const peopleNodesMultiRow = peopleCarouselData.map(person => {
  return (
    <SlidePerson
      key={person.name}
      name={person.name}
      title={person.title}
      bio={person.bio}
      srcSet={person.image}
      layout="horizontal" />
  )
})
interface IProps {
  companyData: any;
  etoData: any;
}

interface ICurrencies {
  [key: string]: string;
}

export const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR"
}

const Page: React.SFC<IProps> = ({companyData, etoData}) => {
  return (
    <LayoutAuthorized>
      <EtoPublicComponent companyData={companyData} etoData={etoData} />
    </LayoutAuthorized>
  );
};

export const EtoPublicViewComponent: React.SFC<IProps> = props => (
  <EtoPublicView {...props} />
);

export const EtoPublicView = compose<React.SFC>(
  appConnect({
    stateToProps: s => ({
      companyData: s.etoFlow.companyData,
      etoData: s.etoFlow.etoData
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.etoFlow.loadDataStart())
  }),
)(Page);
