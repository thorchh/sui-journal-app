import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Journal } from "./Journal";
import { CreateJournal } from "./CreateJournal";
import { JournalList } from "./JournalList";
import { JournalGallery } from "./JournalGallery";

function App() {
  const currentAccount = useCurrentAccount();
  const [journalId, setJournal] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>Journal App</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {currentAccount ? (
            journalId ? (
              <Journal
                id={journalId}
                onBack={() => {
                  window.location.hash = "";
                  setJournal(null);
                }}
              />
            ) : (
              <>
                <CreateJournal
                  onCreated={(id) => {
                    window.location.hash = id;
                    setJournal(id);
                  }}
                />
                <Box mt="5">
                  <JournalList
                    onSelectJournal={(id) => {
                      window.location.hash = id;
                      setJournal(id);
                    }}
                  />
                </Box>
                <Box mt="5">
                  <JournalGallery
                    onSelectJournal={(id) => {
                      window.location.hash = id;
                      setJournal(id);
                    }}
                  />
                </Box>
              </>
            )
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;