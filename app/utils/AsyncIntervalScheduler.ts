import { interfaces } from "inversify";
import { ILogger, LoggerSymbol } from "./Logger";

/**
 * Like setInterval but works with async functions returning promises. It makes sure that callback is called exactly interval microseconds after async execution was finished.
 * It can be started, stopped multiple times.
 */
export class AsyncIntervalScheduler {
  private cancelId: number;
  private isCanceled: boolean = true;
  constructor(
    private readonly logger: ILogger,
    private readonly callback: () => Promise<any>,
    private readonly interval: number,
  ) {}

  public start(): void {
    if (!this.isCanceled) {
      return;
    }
    this.isCanceled = false;
    this.schedule();
  }

  public stop(): void {
    this.isCanceled = true;
    window.clearTimeout(this.cancelId);
  }

  private schedule(): void {
    if (this.isCanceled) {
      return;
    }

    this.cancelId = window.setTimeout(async () => {
      try {
        await this.callback();
      } catch (e) {
        this.logger.error("Uncaught error in AsyncIntervalScheduler: ", e);
      }

      this.schedule();
    }, this.interval);
  }
}

export const AsyncIntervalSchedulerFactorySymbol = "AsyncIntervalSchedulerFactorySymbol";

export type AsyncIntervalSchedulerFactoryType = (
  cb: () => Promise<any>,
  interval: number,
) => AsyncIntervalScheduler;

export const AsyncIntervalSchedulerFactory: (
  context: interfaces.Context,
) => AsyncIntervalSchedulerFactoryType = context => {
  const logger = context.container.get<ILogger>(LoggerSymbol);
  return (callback, interval) => new AsyncIntervalScheduler(logger, callback, interval);
};
