import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, TextField } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";

export function CreateJournal({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const journalPackageId = useNetworkVariable("journalPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [title, setTitle] = useState("");
  const {
    mutate: signAndExecute,
    isSuccess,
    isPending,
  } = useSignAndExecuteTransaction();

  function create() {
    if (!currentAccount) return;

    /**
     * Task 1:
     *
     * Create a new Transaction instance from the @mysten/sui/transactions module.
     */

    const tx = new Transaction();

    /**
     * Task 2: 
     * 
     * Execute a call to the `journal::new_journal` function to create a new journal. 
     * 
     * Make sure to use the title input from the user
     */

     const newJournal = tx.moveCall({
      target: `${journalPackageId}::journal::new_journal`,
      arguments: [tx.pure.string(title)],
    });

    /**
     * Task 3: 
     * 
     * Transfer the new Journal object to the connected user's address
     * 
     * Hint: use currentAccount.address to the user's address
     */

    tx.transferObjects([newJournal], tx.pure.address(currentAccount.address));

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          onCreated(effects?.created?.[0]?.reference?.objectId!);
        },
      },
    );
  }

  return (
    <Container>
      <TextField.Root
        placeholder="Enter journal title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="3"
        mb="3"
      />
      <Button
        size="3"
        onClick={() => {
          create();
        }}
        disabled={isSuccess || isPending || !title.trim()}
      >
        {isSuccess || isPending ? <ClipLoader size={20} /> : "Create Journal"}
      </Button>
    </Container>
  );
}