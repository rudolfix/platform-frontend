import { autoUnmountEnzymeComponentsHook } from "./createMount";
const hook = require("css-modules-require-hook");
const sass = require("node-sass");
const path = require("path");
const fs = require("fs");
const paths = require("../webpack/paths");

afterEach(autoUnmountEnzymeComponentsHook);

// hook({
//   extensions: [".scss"],
//   preprocessCss: (data, fileName) =>
//     sass.renderSync({
//       data,
//       includePaths: [
//         path.resolve(
//           __dirname,
//           "../../design-system/src/styles",
//         ),
//       ],
//       file: fileName,
//     }).css,
// });
