import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text, TextArea, Box } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const SUI_CLOCK_OBJECT_ID = "0x6";

export function Journal({ id }: { id: string }) {
  const journalPackageId = useNetworkVariable("journalPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  useEffect(() => {
    console.log("journal", { id, data });
  }, [id, data  ]);

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState("");

  const addEntry = () => {
    if (!newEntryContent.trim()) return;

    setWaitingForTxn(true);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(id),
        tx.pure.string(newEntryContent),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
      target: `${journalPackageId}::journal::add_entry`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
            await refetch();
            setWaitingForTxn(false);
            setNewEntryContent("");
          });
        },
        onError: () => {
          setWaitingForTxn(false);
        },
      },
    );
  };

  if (isPending) return <Text>Loading...</Text>;

  if (error) return <Text>Error: {error.message}</Text>;

  if (!data.data) return <Text>Not found</Text>;

  const journalFields = getJournalFields(data.data);
  const ownedByCurrentAccount = journalFields?.owner === currentAccount?.address;

  return (
    <>
      <Heading size="3">{journalFields?.title || "Journal"}</Heading>

      <Flex direction="column" gap="4" mt="4">
        {/* Past Entries */}
        <Box>
          <Heading size="2" mb="2">
            Past Entries
          </Heading>
          {journalFields?.entries && journalFields.entries.length > 0 ? (
            <Flex direction="column" gap="3">
              {journalFields.entries.map((entry: any, index: number) => (
                <Box
                  key={index}
                  p="3"
                  style={{
                    background: "var(--gray-a3)",
                    borderRadius: "var(--radius-2)",
                  }}
                >
                  <Text size="1" color="gray" mb="1">
                    {formatTimestamp(entry.create_at_ms)}
                  </Text>
                  <Text m="1">{entry.content}</Text>
                </Box>
              ))}
            </Flex>
          ) : (
            <Text color="gray">No entries yet</Text>
          )}
        </Box>

        {/* Add New Entry */}
        {ownedByCurrentAccount && (
          <Box>
            <Heading size="2" mb="2">
              Add New Entry
            </Heading>
            <Flex direction="column" gap="2">
              <TextArea
                placeholder="Write your journal entry here..."
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                disabled={waitingForTxn}
                rows={4}
              />
              <Button
                onClick={addEntry}
                disabled={waitingForTxn || !newEntryContent.trim()}
              >
                {waitingForTxn ? <ClipLoader size={20} /> : "Add Entry"}
              </Button>
            </Flex>
          </Box>
        )}
      </Flex>
    </>
  );
}

function getJournalFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  const fields = data.content.fields as {
    owner: string;
    title: string;
    entries: Array<{ fields: { content: string; create_at_ms: string } }>;
  };

  // Flatten the entries array to extract the fields
  return {
    owner: fields.owner,
    title: fields.title,
    entries: fields.entries.map((entry) => entry.fields),
  };
}

function formatTimestamp(timestampMs: string): string {
  const date = new Date(parseInt(timestampMs));
  return date.toLocaleString();
}
