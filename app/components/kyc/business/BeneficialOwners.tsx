import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
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
import * as styles from "./BeneficialOwners.module.scss";

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
    <h4 className={styles.sectionTitle}>
      <FormattedMessage id="kyc.business.beneficial-owner.beneficial-owners" />
    </h4>
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
    <div className="p-4 text-center">
      <Button
        layout="secondary"
        iconPosition="icon-before"
        svgIcon={plusIcon}
        onClick={props.createBeneficialOwner}
        disabled={props.loading}
      >
        <FormattedMessage id="kyc.business.beneficial-owner.add-new-beneficial-owner" />
      </Button>
    </div>
    <small className={styles.note}>
      <FormattedMessage id="kyc.business.beneficial-owner.anti-laundry" />
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
