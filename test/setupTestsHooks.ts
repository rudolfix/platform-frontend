import { SinonFakeTimers, useFakeTimers } from "sinon";
import { autoUnmountEnzymeComponentsHook } from "./createMount";

afterEach(autoUnmountEnzymeComponentsHook);

export let globalFakeClock: SinonFakeTimers;

beforeEach(() => {
  globalFakeClock = useFakeTimers();
});

afterEach(() => {
  globalFakeClock.restore();
});
