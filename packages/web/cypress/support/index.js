// Polyfills
import "reflect-metadata";

// External plugins
import "cypress-plugin-retries";

import "./filterTestsByTags";
import "./commands";
import "./fetch-support";

import * as BigNumber from "bignumber.js";
import * as chaiBignumber from "chai-bignumber";

chai.use(chaiBignumber(BigNumber));
