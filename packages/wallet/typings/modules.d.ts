declare module "@react-native-community/async-storage/jest/async-storage-mock";

declare namespace EthUrlParser {
  function parse(uri: string): void;
}

declare module "eth-url-parser" {
  export = EthUrlParser;
}
