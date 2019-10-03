import * as assert from "assert";
import * as dappeteer from "dappeteer";
import * as puppeteer from "puppeteer";

import {tid} from "../../../test/testUtils";

const BSE_URL = "https://localhost:9090";
const RPC_PROVIDER = "https://localhost:9090/node";

let browser;
let page;
let metamask;

before(async function(): Promise<any> {
  this.timeout(60 * 1000);
  browser = await dappeteer.launch(puppeteer,{headless: false, args: ['--ignore-certificate-errors']});
  metamask = await dappeteer.getMetamask(browser);

  await metamask.createAccount();
  // await metamask.importPK(PRIVATE_KEY);
  await metamask.addNetwork(RPC_PROVIDER);
  await metamask.switchNetwork(RPC_PROVIDER);

  page = await browser.newPage();
});

describe('Login with metamask', () => {
  it('sould login user with new wallet', async () => {
    await page.goto(BSE_URL + "/login", { waitUntil: 'networkidle2' });
    await page.waitForSelector(tid("wallet-selector-browser"));

    await page.click(tid("wallet-selector-browser"));

    // Dappeteer have problem with confirming transaction it's useless
    await metamask.confirmTransaction();
  }).timeout(60 * 1000)
});

after(async () => {
  await browser.close()
});
