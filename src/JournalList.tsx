import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";
import { JournalGallery } from "./JournalGallery";

export function JournalList({
  onSelectJournal,
  onCreateNew,
}: {
  onSelectJournal: (id: string) => void;
  onCreateNew: () => void;
}) {
  const currentAccount = useCurrentAccount();
  const journalPackageId = useNetworkVariable("journalPackageId");

  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: currentAccount?.address as string,
      filter: {
        StructType: `${journalPackageId}::journal::Journal`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!currentAccount?.address,
    }
  );

  if (isPending) {
    return (
      <Flex justify="center" align="center" p="6">
        <ClipLoader size={40} />
      </Flex>
    );
  }

  if (error) {
    return <Text color="red">Error loading journals: {error.message}</Text>;
  }

  const journals = data?.data || [];

  return (
    <Flex direction="column" gap="6">
      <Box>
        <Flex justify="between" align="center" mb="4">
          <Heading size="5">My Journals</Heading>
          <Button onClick={onCreateNew}>Create New Journal</Button>
        </Flex>

        {journals.length === 0 ? (
          <Card>
            <Text color="gray">
              You don't have any journals yet. Create your first journal to get
              started!
            </Text>
          </Card>
        ) : (
          <Flex direction="column" gap="3">
            {journals.map((journal) => {
              const content = journal.data?.content;
              const fields =
                content?.dataType === "moveObject"
                  ? (content.fields as { title: string; owner: string })
                  : null;

              return (
                <Card
                  key={journal.data?.objectId}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectJournal(journal.data?.objectId!)}
                >
                  <Heading size="3">{fields?.title || "Untitled Journal"}</Heading>
                  <Text size="1" color="gray" mt="1">
                    ID: {journal.data?.objectId}
                  </Text>
                </Card>
              );
            })}
          </Flex>
        )}
      </Box>

      <JournalGallery onSelectJournal={onSelectJournal} />
    </Flex>
  );
}
