import * as lolex from "lolex";
import { LolexClockAsync } from "../typings/lolex";
import { autoUnmountEnzymeComponentsHook } from "./createMount";

afterEach(autoUnmountEnzymeComponentsHook);

export let globalFakeClock: LolexClockAsync<any>;

beforeEach(() => {
  // note: we use custom fork of lolex providing us tickAsync function which should be used to await for any async actions triggered by tick
  globalFakeClock = lolex.install();
});

afterEach(() => {
  globalFakeClock.uninstall();
});
