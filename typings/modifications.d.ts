import { List } from "lodash";

type pairZip = <T, K>(arrayOfT: List<T>, arrayofK: List<K>) => [T, K][];
