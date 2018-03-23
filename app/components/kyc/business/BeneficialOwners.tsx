import * as cn from "classnames";
import * as React from "react";
import * as styles from "./BeneficialOwners.module.scss";

import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { IKycBeneficialOwner } from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Accordion } from "../../shared/Accordion";
import { Button } from "../../shared/Buttons";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { KYCBeneficialOwner } from "./BeneficialOwner";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";

interface IStateProps {
  beneficialOwners: IKycBeneficialOwner[];
  loading: boolean;
}

interface IDispatchProps {
  createBeneficialOwner: () => void;
}

type IProps = IStateProps & IDispatchProps;

export const KYCBeneficialOwnersComponent: React.SFC<IProps> = props => (
  <div>
    <HorizontalLine className={cn("mt-2", "mb-2")} />
    <h4 className={styles.sectionTitle}>Beneficial owners (which hold more than 25%)</h4>
    <Accordion>
      {props.beneficialOwners.map(
        (owner, index) =>
          owner.id ? (
            <KYCBeneficialOwner key={owner.id} owner={owner} index={index} id={owner.id} />
          ) : (
            <div />
          ),
      )}
    </Accordion>
    <Button
      layout="icon-before"
      svgIcon={plusIcon}
      onClick={props.createBeneficialOwner}
      disabled={props.loading}
    >
      Add new Beneficial Owner
    </Button>
    <small className={styles.note}>
      According to the German anti money laundering act, we are obliged to keep a record of your
      personal data for five years after account closure.
    </small>
  </div>
);

export const KYCBeneficialOwners = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      beneficialOwners: state.kyc.beneficialOwners,
      loading: !!state.kyc.loadingBeneficialOwners || !!state.kyc.loadingBeneficialOwner,
    }),
    dispatchToProps: dispatch => ({
      createBeneficialOwner: () => dispatch(actions.kyc.kycAddBeneficialOwner()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBeneficialOwners());
    },
  }),
)(KYCBeneficialOwnersComponent);
