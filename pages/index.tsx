import { sponsored } from "@gelatonetwork/smartwallet";
import {
  useSendTransaction,
  useWaitForTransactionReceipt
} from "@gelatonetwork/smartwallet-react-wagmi";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {Button} from 'huhu-ui'

export default function Home() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [isClient, setIsClient] = useState(false);

  const [txError, setTxError] = useState<string | undefined>(undefined);

  const {
    sendTransactionAsync,
    data: taskId,
    isPending
  } = useSendTransaction({
    payment: sponsored()
  });

  const { data: receipt } = useWaitForTransactionReceipt({
    id: taskId
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendTransactionCallback = useCallback(async () => {
    setTxError(undefined);
    try {
      await sendTransactionAsync({
        data: "0xd09de08a",
        to: "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27",
        value: 0n
      });
    } catch (error: any) {
      setTxError(error.message ?? "Unknown error");
    }
  }, [sendTransactionAsync]);

  return (
    <>
      <Head>
        <title>Wagmi Wallet Connection</title>
        <meta name="description" content="Wagmi smart wallet app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>Wagmi Wallet Connection</h1>
      </header>
      <main>
        <h2>1. Connect</h2>
        {isClient ? (
          <div>
            {connectors.map((connector) => (
              <div key={connector.uid}>
                <Button onClick={() => connect({ connector })}>
                  {connector.name}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading connectors...</div>
        )}
        <pre>status: {status}</pre>
        <div>{error?.message}</div>

        <h2>2. Account</h2>
        <pre>
          status: <strong>{account.status}</strong>
          <br />
          addresses: <strong>{JSON.stringify(account.addresses)}</strong>
          <br />
          chainId: <strong>{account.chainId}</strong>
        </pre>

        {account.status === "connected" && (
          <div>
            <Button onClick={() => disconnect()}>
              Disconnect
            </Button>
            <h2>3. Send transaction</h2>

            <Button onClick={sendTransactionCallback}>
              {isPending ? 'Processing...' : 'Send Transaction'}
            </Button>

            {taskId && !receipt && (
              <div>
                <div>Awaiting confirmation</div>
                Etherscan: <a href={`https://sepolia.etherscan.io/tx/${taskId}`}
                  target="_blank" rel="noopener noreferrer">{taskId}</a>
              </div>
            )}

            {receipt && (
              <div>
                Receipt: {receipt.status} - Tx Hash: {receipt.transactionHash}
              </div>
            )}
            {txError && <p>Error occured: {txError}</p>}
            <br />
            <br />
            <br />
          </div>
        )}
      </main>
    </>
  );
}
