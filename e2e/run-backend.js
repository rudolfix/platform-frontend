const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const getApiSha = async () => {
  try {
    const {commitSha} = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, "..", "health-check-sha.json"),
    ));

    exec(
      `./run_backend.sh ${commitSha}
      `,
      (err, stdout) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      },
    );
  } catch (e) {
    console.log("There was an error while trying to run the backend", e);
  }
};

getApiSha();
