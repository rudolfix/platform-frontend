export const lazyLoadIpfsOnlyHash = (): Promise<any> => {
  return new Promise((res, reject) => {
    let importedModule;
    try {
      if (process.env.NF_CYPRESS_RUN === "0") {
        importedModule = import(/* webpackChunkName: "ipfs-only-hash" */"ipfs-only-hash");
      } else {
        importedModule = require("ipfs-only-hash")
      }
      res(importedModule)
    } catch(e) {
      reject(`could not load module: "ipfs-only-hash". Error: ${e}`)
    }
  })
};
