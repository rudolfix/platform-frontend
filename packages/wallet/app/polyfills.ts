/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access */

/**
 * Provides a proper runtime type information extensively used in inversify DI container
 */
// eslint-disable-next-line import/no-unassigned-import
import "reflect-metadata";

// a process shim is required from some native module polyfills to be in the global scope
// eslint-disable-next-line import/no-nodejs-modules
import process from "process";

global.process = process;

/**
 * Polyfill `btoa` and `atob` as they are not available on embedded virtual machine
 */
if (typeof (global as any).btoa === "undefined") {
  (global as any).btoa = (str: string) => new Buffer(str, "binary").toString("base64");
}
if (typeof (global as any).atob === "undefined") {
  (global as any).atob = (b64Encoded: string) =>
    new Buffer(b64Encoded, "base64").toString("binary");
}

// crypto is loaded first, so it can populate global.crypto
// eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-nodejs-modules, import/no-unassigned-import
require("crypto");
