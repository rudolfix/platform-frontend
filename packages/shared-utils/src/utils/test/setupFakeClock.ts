import { Clock, install, InstalledClock, LolexInstallOpts } from "lolex";

export const setupFakeClock = (now?: number, options?: Omit<LolexInstallOpts, "now">) => {
  let wrapper: { fakeClock?: InstalledClock<Clock> } = {};

  beforeEach(() => {
    wrapper.fakeClock = install({ now, ...options });
  });

  afterEach(() => {
    wrapper.fakeClock && wrapper.fakeClock.uninstall();
  });

  return wrapper as { fakeClock: InstalledClock<Clock> };
};
