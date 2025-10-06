import { getFullnodeUrl } from "@mysten/sui/client";
import {
  DEVNET_JOURNAL_PACKAGE_ID,
  TESTNET_JOURNAL_PACKAGE_ID,
  MAINNET_JOURNAL_PACKAGE_ID,
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        journalPackageId: DEVNET_JOURNAL_PACKAGE_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        journalPackageId: TESTNET_JOURNAL_PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        journalPackageId: MAINNET_JOURNAL_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
