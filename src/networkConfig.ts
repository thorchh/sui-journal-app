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
        graphqlUrl: "https://graphql.devnet.sui.io/graphql",
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        journalPackageId: TESTNET_JOURNAL_PACKAGE_ID,
        graphqlUrl: "https://graphql.testnet.sui.io/graphql",
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        journalPackageId: MAINNET_JOURNAL_PACKAGE_ID,
        graphqlUrl: "https://graphql.mainnet.sui.io/graphql",
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
