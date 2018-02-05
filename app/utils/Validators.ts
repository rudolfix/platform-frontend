const DERIVATION_PATH_PREFIX_REGEX = /^44'\/60'\/[0-9][0-9]?'\/$/m;

export const derivationPathPrefixValidator = (dp: string): string | null => {
  if (!DERIVATION_PATH_PREFIX_REGEX.test(dp)) {
    return "Invalid derivation path prefix! Ex. 44'/60'/0'/";
  }
  return null;
};
