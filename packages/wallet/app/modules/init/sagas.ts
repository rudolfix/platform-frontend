import { neuTakeLatest, put, fork, getContext } from "@neufund/sagas";
import { TGlobalDependencies } from "../../di/setupBindings";
import { initActions } from "./actions";
import * as yup from "yup";

// TODO: Remove after testing. Test setting some data.
// We can use Yup as both: schema and a type
const PersonSchema = yup.object().shape({
  name: yup.string(),
  age: yup.number(),
});

// get a type for TS from Yup object
type Person = yup.InferType<typeof PersonSchema>;

const JohnDoe: Person = {
  name: "John Doe",
  age: 22,
};

const testWallet: any = {
  wallets: ["cd2a3d9f938e13cd947ec05abc7fe734df8dd826", "cd2a3d9f938e13cd947ec05abc7fe734df8dd826"],
};
// remove after testing end

export function* initStartSaga({
  logger,
}: TGlobalDependencies): Generator<any, void, TGlobalDependencies> {
  try {
    // TODO: Provide a proper init flow

    // TODO: Remove after testing. Test setting some data.
    const { appStorage }: TGlobalDependencies = yield getContext("deps");
    const { singleKeyAppStorage }: TGlobalDependencies = yield getContext("deps");

    yield appStorage.setItem("test", JohnDoe);
    yield singleKeyAppStorage.setItem(testWallet);

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));
    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
