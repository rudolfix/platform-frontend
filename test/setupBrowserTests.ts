import "./setupTests";

// polyfill request animation frame https://github.com/facebookincubator/create-react-app/issues/3199
(global as any).requestAnimationFrame = function(callback: any): number {
  setTimeout(callback, 0);
  return 0;
};

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });
