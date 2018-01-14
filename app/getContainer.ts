import { Container } from "inversify";
import { Delay } from "./modules/counter/index";

export function getContainer(): Container {
  const container = new Container();

  const delay = (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));

  container.bind<Delay>("Delay").toConstantValue(delay);

  return container;
}
