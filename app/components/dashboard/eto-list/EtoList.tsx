import * as React from "react";
import { Col } from "reactstrap";
import { compose } from "redux";

import { TPublicEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectPublicEtoList } from "../../../modules/public-etos/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { SectionHeader } from "../../shared/SectionHeader";

interface IStateProps {
  etos: TPublicEtoData[];
}

interface IDispatchProps {
  startInvestmentFlow: (eto: TPublicEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

// TODO: Invest button needs to go to details view later
export const EtoListComponent: React.SFC<IProps> = ({ etos, startInvestmentFlow }) => (
  <>
    <Col xs={12}>
      <SectionHeader>ETO Offerings</SectionHeader>
    </Col>
    {etos.map((eto, index) => (
      <Col xs={12} lg={6} key={index}>
        {/* TODO: implement real ETO Card here */}
        <div className="mb-3">
          <h4>{`${eto.company.brandName} - ${eto.company.name}`}</h4>
          {eto.state === "on_chain" && (
            <Button onClick={() => startInvestmentFlow(eto)}>invest now</Button>
          )}
        </div>
      </Col>
    ))}
  </>
);

export const EtoList = compose<React.ComponentClass>(
  onEnterAction({
    actionCreator: d => d(actions.publicEtos.loadEtos()),
  }),
  appConnect({
    stateToProps: state => ({
      etos: selectPublicEtoList(state.publicEtos),
    }),
    dispatchToProps: d => ({
      startInvestmentFlow: (eto: TPublicEtoData) => {
        // TODO: The current ETO should be loaded alread by details view
        d(actions.publicEtos.loadCurrentEto(eto.etoId));

        d(actions.investmentFlow.investmentStart());
      },
    }),
  }),
)(EtoListComponent);
