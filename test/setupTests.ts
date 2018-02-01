import "ignore-styles";
import "reflect-metadata";

// polyfill request animation frame https://github.com/facebookincubator/create-react-app/issues/3199
(global as any).requestAnimationFrame = function(callback: any): number {
  setTimeout(callback, 0);
  return 0;
};

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

Enzyme.configure({ adapter: new Adapter() });
//For light-wallet testing
(self as any) = undefined;
