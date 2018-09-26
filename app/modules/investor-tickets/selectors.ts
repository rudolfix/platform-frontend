import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { IAppState } from "../../store";
import { selectPublicEtos } from "../public-etos/selectors";
import { ETOStateOnChain } from "../public-etos/types";
import { TETOWithInvestorTicket } from "./types";

const selectInvestorTicketsState = (state: IAppState) => state.investorTickets;

export const selectInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectEtoWithInvestorTickets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectPublicEtos(state);

  if (etos && etos.every(eto => !!selectInvestorTicket(state, eto.etoId))) {
    return etos
      .filter(eto => eto.state === EtoState.ON_CHAIN)
      .filter(eto => eto.contract!.timedState !== ETOStateOnChain.Setup)
      .map(eto => ({ ...eto, investorTicket: selectInvestorTicket(state, eto.etoId)!} ));
  }

  return undefined;
};

export const selectMyAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);

  if (etos) {
    return etos.filter(eto => eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectMyPendingAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);

  if (etos) {
    return etos.filter(eto => !eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};
