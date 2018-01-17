import { Container } from "inversify";
import { push } from "react-router-redux";
import { MiddlewareAPI } from "redux";
import { IConfig } from "./getConfig";
import { EthereumNetworkConfig, IEthereumNetworkConfig } from "./modules/web3/Web3Manager";
import { IAppState } from "./store";

export type Delay = (n: number) => Promise<void>;
export type NavigateTo = (path: string) => void;
export type GetState = () => IAppState;

export const DispatchSymbol = "Dispatch";
export const NavigateToSymbol = "NavigateTo";
export const DelaySymbol = "Delay";
export const GetStateSymbol = "GetState";

export function getContainer(config: IConfig): Container {
  const container = new Container();

  const delay = (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));

  container.bind<Delay>("Delay").toConstantValue(delay);
  container
    .bind<IEthereumNetworkConfig>(EthereumNetworkConfig)
    .toConstantValue(config.ethereumNetwork);

  return container;
}

export function customizerContainerWithMiddlewareApi(
  container: Container,
  { dispatch, getState }: MiddlewareAPI<any>,
): Container {
  container.bind(DispatchSymbol).toConstantValue(dispatch);
  container.bind(GetStateSymbol).toConstantValue(() => getState());
  container.bind(NavigateToSymbol).toConstantValue((path: string) => dispatch(push(path)));

  return container;
}
