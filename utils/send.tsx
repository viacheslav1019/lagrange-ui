
import {
  Account,
  AccountInfo,
  Commitment,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';

import { Buffer } from 'buffer';
import assert from 'assert';
import {struct} from 'superstruct';


export async function getMultipleSolanaAccounts(
  connection: Connection,
  publicKeys: PublicKey[],
): Promise<
  RpcResponseAndContext<{ [key: string]: AccountInfo<Buffer> | null }>
> {
  const args = [publicKeys.map((k) => k.toBase58()), { commitment: 'recent' }];
  // @ts-ignore
  const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args);
  const res = GetMultipleAccountsAndContextRpcResult(unsafeRes);
  if (res.error) {
    throw new Error(
      'failed to get info about accounts ' +
      publicKeys.map((k) => k.toBase58()).join(', ') +
      ': ' +
      res.error.message,
    );
  }
  assert(typeof res.result !== 'undefined');
  const accounts: Array<{
    executable: any;
    owner: PublicKey;
    lamports: any;
    data: Buffer;
  } | null> = [];
  for (const account of res.result.value) {
    let value: {
      executable: any;
      owner: PublicKey;
      lamports: any;
      data: Buffer;
    } | null = null;
    if (res.result.value) {
      const { executable, owner, lamports, data } = account;
      assert(data[1] === 'base64');
      value = {
        executable,
        owner: new PublicKey(owner),
        lamports,
        data: Buffer.from(data[0], 'base64'),
      };
    }
    accounts.push(value);
  }
  return {
    context: {
      slot: res.result.context.slot,
    },
    value: Object.fromEntries(
      accounts.map((account, i) => [publicKeys[i].toBase58(), account]),
    ),
  };
}

function jsonRpcResult(resultDescription: any) {
    const jsonRpcVersion = struct.literal('2.0');
    return struct.union([
      struct({
        jsonrpc: jsonRpcVersion,
        id: 'string',
        error: 'any',
      }),
      struct({
        jsonrpc: jsonRpcVersion,
        id: 'string',
        error: 'null?',
        result: resultDescription,
      }),
    ]);
}

function jsonRpcResultAndContext(resultDescription: any) {
    return jsonRpcResult({
      context: struct({
        slot: 'number',
      }),
      value: resultDescription,
    });
  }
  
  const AccountInfoResult = struct({
    executable: 'boolean',
    owner: 'string',
    lamports: 'number',
    data: 'any',
    rentEpoch: 'number?',
  });

export const GetMultipleAccountsAndContextRpcResult = jsonRpcResultAndContext(
    struct.array([struct.union(['null', AccountInfoResult])]),
);
