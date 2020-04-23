enum EImportPhrase {
  PRIVATE_KEY = "private_key",
  MNEMONICS = "mnemonics",
}

const UNSUPPORTED_IMPORT_PHRASE = "unsupported" as const;

export { EImportPhrase, UNSUPPORTED_IMPORT_PHRASE };
