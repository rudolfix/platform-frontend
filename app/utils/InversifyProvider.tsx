import { Container } from "inversify";
import * as React from "react";

export interface IInversifyProvider {
  container: Container;
}

export type TContainerContext = Container | undefined;

export const ContainerContext = React.createContext<TContainerContext>(undefined);

export const InversifyProvider: React.SFC<IInversifyProvider> = ({ container, children }) => (
  <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
);
