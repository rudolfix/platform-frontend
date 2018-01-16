import { Container } from "inversify";
import { push } from "react-router-redux";
import { MiddlewareAPI } from "redux";
import { IAppState } from "./store";
import { IConfig } from "./getConfig";
import { IEthereumNetworkConfig, EthereumNetworkConfig } from "./modules/web3/LedgerConnector";

export type TDelay = (n: number) => Promise<void>;
export type TNavigateTo = (path: string) => void;
export type TGetState = () => IAppState;

export const Dispatch = "Dispatch";
export const NavigateTo = "NavigateTo";
export const Delay = "Delay";
export const GetState = "GetState";

export function getContainer(config: IConfig): Container {
  const container = new Container();

  const delay = (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));

  container.bind<TDelay>("Delay").toConstantValue(delay);
  container.bind<IEthereumNetworkConfig>(EthereumNetworkConfig).toConstantValue(config.ethereumNetwork);

  return container;
}

export function customizerContainerWithMiddlewareApi(
  container: Container,
  { dispatch, getState }: MiddlewareAPI<any>,
): Container {
  container.bind(Dispatch).toConstantValue(dispatch);
  container.bind(GetState).toConstantValue(() => getState());
  container.bind(NavigateTo).toConstantValue((path: string) => dispatch(push(path)));

  return container;
}
