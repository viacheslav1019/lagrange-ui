import { TokenAccountLayout } from '@blockworks-foundation/mango-client'
import {AccountInfo, Connection, PublicKey} from '@solana/web3.js';
import {WRAPPED_SOL_MINT} from '@project-serum/serum/lib/token-instructions';
import {TokenAccount} from './types';
import * as BufferLayout from 'buffer-layout';
import {useConnection} from './connection';
import {useAllMarkets, useTokenAccounts} from './markets';
import {getMultipleSolanaAccounts} from './send';
import BN from 'bn.js';
import {useAsyncData} from './fetch-loop';
import tuple from 'immutable-tuple';

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)

export type ProgramAccount<T> = {
  publicKey: PublicKey
  account: T
}

export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(36),
  BufferLayout.blob(8, 'supply'),
  BufferLayout.u8('decimals'),
  BufferLayout.u8('initialized'),
  BufferLayout.blob(36),
]);

export interface MintInfo {
  decimals: number;
  initialized: boolean;
  supply: BN;
}

export function parseTokenAccountData(data: Buffer): {
  mint: PublicKey
  owner: PublicKey
  amount: number
} {
  const { mint, owner, amount } = TokenAccountLayout.decode(data)
  return {
    mint: new PublicKey(mint),
    owner: new PublicKey(owner),
    amount,
  }
}

export async function getTokenAccountInfo(
  connection: Connection,
  ownerAddress: PublicKey,
) {
  let [splAccounts, account] = await Promise.all([
    getOwnedTokenAccounts(connection, ownerAddress),
    connection.getAccountInfo(ownerAddress),
  ]);
  const parsedSplAccounts: TokenAccount[] = splAccounts.map(
    ({ publicKey, accountInfo }) => {
      return {
        pubkey: publicKey,
        account: accountInfo,
        effectiveMint: parseTokenAccountData(accountInfo.data).mint,
      };
    },
  );
  return parsedSplAccounts.concat({
    pubkey: ownerAddress,
    account,
    effectiveMint: WRAPPED_SOL_MINT,
  });
}

export async function getOwnedTokenAccounts(
  connection: Connection,
  publicKey: PublicKey,
): Promise<Array<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }>> {
  let filters = getOwnedAccountsFilters(publicKey);
  let resp = await connection.getProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      filters,
    },
  );
  return resp
    .map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data,
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    }))
}

export function getOwnedAccountsFilters(publicKey: PublicKey) {
  return [
    {
      memcmp: {
        offset: ACCOUNT_LAYOUT.offsetOf('owner'),
        bytes: publicKey.toBase58(),
      },
    },
    {
      dataSize: ACCOUNT_LAYOUT.span,
    },
  ];
}

export function parseTokenMintData(data): MintInfo {
  let { decimals, initialized, supply } = MINT_LAYOUT.decode(data);
  return {
    decimals,
    initialized: !!initialized,
    supply: new BN(supply, 10, 'le'),
  };
}

const _VERY_SLOW_REFRESH_INTERVAL = 5000 * 1000;

export function useMintInfos(): [
  (
    | {
        [mintAddress: string]: {
          decimals: number;
          initialized: boolean;
        } | null;
      }
    | null
    | undefined
  ),
  boolean,
] {
  const connection = useConnection();
  const [tokenAccounts] = useTokenAccounts();
  const [allMarkets] = useAllMarkets();

  const allMints = (tokenAccounts || [])
    .map((account) => account.effectiveMint)
    .concat(
      (allMarkets || []).map((marketInfo) => marketInfo.market.baseMintAddress),
    )
    .concat(
      (allMarkets || []).map(
        (marketInfo) => marketInfo.market.quoteMintAddress,
      ),
    );
  const uniqueMints = [...new Set(allMints.map((mint) => mint.toBase58()))].map(
    (stringMint) => new PublicKey(stringMint),
  );

  const getAllMintInfo = async () => {
    const mintInfos = await getMultipleSolanaAccounts(connection, uniqueMints);
    return Object.fromEntries(
      Object.entries(mintInfos.value).map(([key, accountInfo]) => [
        key,
        accountInfo && parseTokenMintData(accountInfo.data),
      ]),
    );
  };

  return useAsyncData(
    getAllMintInfo,
    tuple(
      'getAllMintInfo',
      connection,
      (tokenAccounts || []).length,
      (allMarkets || []).length,
    ),
    { refreshInterval: _VERY_SLOW_REFRESH_INTERVAL },
  );
}