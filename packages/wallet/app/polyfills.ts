/**
 * Provides a proper runtime type information extensively used in inversify DI container
 */
import "reflect-metadata";

// a process shim is required from some native module polyfills to be in the global scope
global.process = require("process");
