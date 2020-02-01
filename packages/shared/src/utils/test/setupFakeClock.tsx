import * as lolex from "lolex";

export const setupFakeClock = (now?: number) => {
  let wrapper: { fakeClock?: lolex.InstalledClock<lolex.Clock> } = {};

  beforeEach(() => {
    wrapper.fakeClock = lolex.install({ now });
  });

  afterEach(() => {
    wrapper.fakeClock && wrapper.fakeClock.uninstall();
  });

  return wrapper as { fakeClock: lolex.InstalledClock<lolex.Clock> };
};
