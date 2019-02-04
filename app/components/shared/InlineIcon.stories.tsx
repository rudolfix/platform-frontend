import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as accordion_arrow from "../../assets/img/inline_icons/accordion_arrow.svg";
import * as add_file from "../../assets/img/inline_icons/add_file.svg";
import * as arrow_left from "../../assets/img/inline_icons/arrow_left.svg";
import * as arrow_right from "../../assets/img/inline_icons/arrow_right.svg";
import * as arrowhead from "../../assets/img/inline_icons/arrowhead.svg";
import * as check from "../../assets/img/inline_icons/check.svg";
import * as close from "../../assets/img/inline_icons/close.svg";
import * as close_no_border from "../../assets/img/inline_icons/close_no_border.svg";
import * as download from "../../assets/img/inline_icons/download.svg";
import * as edit from "../../assets/img/inline_icons/edit.svg";
import * as icon_clipboard from "../../assets/img/inline_icons/icon-clipboard.svg";
import * as icon_menu_dashboard from "../../assets/img/inline_icons/icon-menu-dashboard.svg";
import * as icon_menu_documents from "../../assets/img/inline_icons/icon-menu-documents.svg";
import * as icon_menu_eto from "../../assets/img/inline_icons/icon-menu-eto.svg";
import * as icon_menu_help from "../../assets/img/inline_icons/icon-menu-help.svg";
import * as icon_menu_portfolio from "../../assets/img/inline_icons/icon-menu-portfolio.svg";
import * as icon_menu_settings from "../../assets/img/inline_icons/icon-menu-settings.svg";
import * as icon_menu_wallet from "../../assets/img/inline_icons/icon-menu-wallet.svg";
import * as icon_check from "../../assets/img/inline_icons/icon_check.svg";
import * as icon_edit from "../../assets/img/inline_icons/icon_edit.svg";
import * as icon_home_active from "../../assets/img/inline_icons/icon_home_active.svg";
import * as icon_link from "../../assets/img/inline_icons/icon_link.svg";
import * as icon_portfolio_inactive from "../../assets/img/inline_icons/icon_portfolio_inactive.svg";
import * as icon_questionmark from "../../assets/img/inline_icons/icon_questionmark.svg";
import * as icon_settings_inactive from "../../assets/img/inline_icons/icon_settings_inactive.svg";
import * as icon_stats from "../../assets/img/inline_icons/icon_stats.svg";
import * as icon_support from "../../assets/img/inline_icons/icon_support.svg";
import * as icon_wallet_inactive from "../../assets/img/inline_icons/icon_wallet_inactive.svg";
import * as link_out from "../../assets/img/inline_icons/link_out.svg";
import * as link_out_small from "../../assets/img/inline_icons/link_out_small.svg";
import * as plus from "../../assets/img/inline_icons/plus.svg";
import * as plus_bare from "../../assets/img/inline_icons/plus_bare.svg";
import * as questionmark_huge from "../../assets/img/inline_icons/questionmark_huge.svg";
import * as round_close from "../../assets/img/inline_icons/round_close.svg";
import * as round_plus from "../../assets/img/inline_icons/round_plus.svg";
import * as social_facebook from "../../assets/img/inline_icons/social_facebook.svg";
import * as social_github from "../../assets/img/inline_icons/social_github.svg";
import * as social_google_plus from "../../assets/img/inline_icons/social_google_plus.svg";
import * as social_instagram from "../../assets/img/inline_icons/social_instagram.svg";
import * as social_link from "../../assets/img/inline_icons/social_link.svg";
import * as social_linkedin from "../../assets/img/inline_icons/social_linkedin.svg";
import * as social_medium from "../../assets/img/inline_icons/social_medium.svg";
import * as social_reddit from "../../assets/img/inline_icons/social_reddit.svg";
import * as social_slack from "../../assets/img/inline_icons/social_slack.svg";
import * as social_telegram from "../../assets/img/inline_icons/social_telegram.svg";
import * as social_twitter from "../../assets/img/inline_icons/social_twitter.svg";
import * as social_xing from "../../assets/img/inline_icons/social_xing.svg";
import * as social_youtube from "../../assets/img/inline_icons/social_youtube.svg";
import * as trash from "../../assets/img/inline_icons/trash.svg";
import * as upload from "../../assets/img/inline_icons/upload.svg";

import * as info from "../../assets/img/notifications/info.svg";
import * as Success_small from "../../assets/img/notifications/Success_small.svg";
import * as warning from "../../assets/img/notifications/warning.svg";

import * as no_computer from "../../assets/img/seed_backup/no_computer.svg";
import * as safe from "../../assets/img/seed_backup/safe.svg";
import * as write from "../../assets/img/seed_backup/write.svg";

import * as browser_icon from "../../assets/img/wallet_selector/browser_icon.svg";
import * as ledger_confirm from "../../assets/img/wallet_selector/ledger_confirm.svg";
import * as ledger_login_step_1 from "../../assets/img/wallet_selector/ledger_login_step_1.svg";
import * as ledger_login_step_2 from "../../assets/img/wallet_selector/ledger_login_step_2.svg";
import * as ledger_login_step_3 from "../../assets/img/wallet_selector/ledger_login_step_3.svg";
import * as ledger_login_step_4 from "../../assets/img/wallet_selector/ledger_login_step_4.svg";
import * as ledger_login_step_5 from "../../assets/img/wallet_selector/ledger_login_step_5.svg";
import * as ledger_login_step_6 from "../../assets/img/wallet_selector/ledger_login_step_6.svg";
import * as lock_icon from "../../assets/img/wallet_selector/lock_icon.svg";
import * as logo_chrome from "../../assets/img/wallet_selector/logo_chrome.svg";
import * as logo_firefox from "../../assets/img/wallet_selector/logo_firefox.svg";
import * as wallet_confirm_icon from "../../assets/img/wallet_selector/wallet_confirm_icon.svg";
import * as wallet_icon from "../../assets/img/wallet_selector/wallet_icon.svg";

import * as eth_icon from "../../assets/img/eth_icon.svg";
import * as euro_icon from "../../assets/img/euro_icon.svg";
import * as link_arrow from "../../assets/img/link_arrow.svg";
import * as logo_square_white from "../../assets/img/logo-square-white.svg";
import * as logo_capitalized from "../../assets/img/logo_capitalized.svg";
import * as logo_small_black from "../../assets/img/logo_small_black.svg";
import * as logo_white from "../../assets/img/logo_white.svg";
import * as logo_yellow from "../../assets/img/logo_yellow.svg";
import * as mail_link from "../../assets/img/mail_link.svg";
import * as neu_icon from "../../assets/img/neu_icon.svg";
import * as nEUR_icon from "../../assets/img/nEUR_icon.svg";
import * as token_icon from "../../assets/img/token_icon.svg";

import { InlineIcon } from "./InlineIcon";
storiesOf("Icons", module)
  .add("InlineIcon", () => (
    <>
      {[
        accordion_arrow,
        add_file,
        arrow_left,
        arrow_right,
        arrowhead,
        check,
        close,
        close_no_border,
        download,
        edit,
        icon_clipboard,
        icon_menu_dashboard,
        icon_menu_documents,
        icon_menu_eto,
        icon_menu_help,
        icon_menu_portfolio,
        icon_menu_settings,
        icon_menu_wallet,
        icon_check,
        icon_edit,
        icon_home_active,
        icon_link,
        icon_portfolio_inactive,
        icon_questionmark,
        icon_settings_inactive,
        icon_stats,
        icon_support,
        icon_wallet_inactive,
        link_out,
        link_out_small,
        plus,
        plus_bare,
        questionmark_huge,
        round_close,
        round_plus,
        social_facebook,
        social_github,
        social_google_plus,
        social_instagram,
        social_link,
        social_linkedin,
        social_medium,
        social_reddit,
        social_slack,
        social_telegram,
        social_twitter,
        social_xing,
        social_youtube,
        trash,
        upload,
      ].map(svg => (
        <span style={{ display: "inline-block", height: "2em", width: "3em" }}>
          <InlineIcon svgIcon={svg} />
        </span>
      ))}
      <br />
    </>
  ))
  .add("other icons", () => (
    <>
      <h3>Notification</h3>
      {[info, Success_small, warning].map(svg => (
        <span style={{ display: "inline-block", height: "2em", width: "3em" }}>
          <img src={svg} />
        </span>
      ))}
      <br />

      <h3>Seed backup</h3>
      {[no_computer, safe, write].map(svg => (
        <span style={{ display: "inline-block" }} className="m-1">
          <img src={svg} />
        </span>
      ))}
      <br />

      <h3>Wallet selector</h3>
      {[
        browser_icon,
        ledger_confirm,
        ledger_login_step_1,
        ledger_login_step_2,
        ledger_login_step_3,
        ledger_login_step_4,
        ledger_login_step_5,
        ledger_login_step_6,
        lock_icon,
        logo_chrome,
        logo_firefox,
        wallet_confirm_icon,
        wallet_icon,
      ].map(svg => (
        <span style={{ display: "inline-block" }} className="m-1">
          <img src={svg} />
        </span>
      ))}
      <br />

      <h3>Other icons</h3>
      {[
        eth_icon,
        euro_icon,
        link_arrow,
        logo_capitalized,
        logo_small_black,
        logo_square_white,
        logo_white,
        logo_yellow,
        mail_link,
        neu_icon,
        nEUR_icon,
        token_icon,
      ].map(svg => (
        <span style={{ display: "inline-block" }} className="m-1">
          <img src={svg} />
        </span>
      ))}
      <br />
    </>
  ));
