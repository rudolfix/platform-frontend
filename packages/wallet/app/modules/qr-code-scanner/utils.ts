import { parse } from "eth-url-parser";

function isValidTransactionRequestUri(data: string) {
  try {
    parse(data);

    return true;
  } catch {
    return false;
  }
}

export { isValidTransactionRequestUri };
