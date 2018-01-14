import "ignore-styles";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinonChai from "sinon-chai";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

chai.use(chaiAsPromised);
chai.use(sinonChai);

Enzyme.configure({ adapter: new Adapter() });
