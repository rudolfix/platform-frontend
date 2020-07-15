import { etoModuleApi, TEtoWithCompanyAndContractReadonly } from "@neufund/shared-modules";
import { RequiredByKeys } from "@neufund/shared-utils";
import * as React from "react";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { EtoOverviewThumbnail } from "../../eto/overview/EtoOverviewThumbnail/EtoOverviewThumbnail";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { ELoadingIndicator, LoadingIndicator } from "../../shared/loading-indicator";

import * as styles from "./EtoList.module.scss";

interface IStateProps {
  etos?: TEtoWithCompanyAndContractReadonly[];
}

type TExternalProps = {
  mockedEtos?: NonNullable<React.ComponentProps<typeof EtoOverviewThumbnail>["mockedEto"]>[];
  shouldOpenInNewWindow?: boolean;
};

type TListProps = RequiredByKeys<IStateProps, "etos">;

const EtoListThumbnails: React.FunctionComponent<TListProps & TExternalProps> = ({
  etos,
  mockedEtos = [],
  shouldOpenInNewWindow,
}) => (
  <Container
    type={EContainerType.INHERIT_GRID}
    className={styles.progressSectionLayout}
    data-test-id="dashboard-eto-list"
  >
    {etos.map(eto => (
      <EtoOverviewThumbnail
        eto={eto}
        key={eto.previewCode}
        shouldOpenInNewWindow={shouldOpenInNewWindow}
      />
    ))}

    {mockedEtos.map(eto => (
      <EtoOverviewThumbnail
        mockedEto={eto}
        key={eto.id}
        shouldOpenInNewWindow={shouldOpenInNewWindow}
      />
    ))}
  </Container>
);

const EtoListLayout: React.FunctionComponent<TExternalProps & IStateProps> = ({
  etos,
  mockedEtos,
  shouldOpenInNewWindow,
}) => (
  <>
    {etos ? (
      <EtoListThumbnails
        etos={etos}
        mockedEtos={mockedEtos}
        shouldOpenInNewWindow={shouldOpenInNewWindow}
      />
    ) : (
      <Container columnSpan={EColumnSpan.THREE_COL}>
        <LoadingIndicator type={ELoadingIndicator.HEXAGON} />
      </Container>
    )}
  </>
);

const EtoList = compose<IStateProps & TExternalProps, TExternalProps>(
  setDisplayName("EtoList"),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.eto.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: etoModuleApi.selectors.selectEtos(state),
    }),
  }),
)(EtoListLayout);

export { EtoList };
