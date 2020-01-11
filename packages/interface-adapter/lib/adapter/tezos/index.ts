import { InterfaceAdapter, BlockType } from "../types";
import Config from "@truffle/config";
import { Provider } from "web3/providers";
import { TezosToolkit, Tezos } from "@taquito/taquito";

export interface TezosAdapterOptions {
  provider?: Provider;
  networkType?: string;
}

export class TezosAdapter implements InterfaceAdapter {
  public tezos: TezosToolkit;
  constructor({ provider }: TezosAdapterOptions) {
    this.tezos = Tezos;
    if (provider) this.setProvider(provider);
  }

  public async getNetworkId() {
    const { chain_id } = await this.tezos.rpc.getBlockHeader();
    return chain_id;
  }

  public async getBlock(blockNumber: BlockType) {
    // translate ETH nomenclature to XTZ
    if (blockNumber === "latest") blockNumber = "head";
    const { hard_gas_limit_per_block } = await this.tezos.rpc.getConstants();
    const block = await this.tezos.rpc.getBlockHeader({
      block: `${blockNumber}`
    });
    // @ts-ignore: Property 'gasLimit' does not exist on type 'BlockHeaderResponse'.
    block.gasLimit = hard_gas_limit_per_block;
    return block;
  }

  public async getTransaction(tx: string) {
    //  return this.web3.eth.getTransaction(tx);
    return;
  }

  public async getTransactionReceipt(tx: string) {
    //  return this.web3.eth.getTransactionReceipt(tx);
    return;
  }

  public async getBalance(address: string) {
    const balance = (await this.tezos.tz.getBalance(address)).toString();
    return balance;
  }

  public async getCode(address: string) {
    //   return this.web3.eth.getCode(address);
    return "0";
  }

  public async getAccounts(config: Config) {
    await this.setWallet(config);
    const currentAccount = await this.tezos.signer.publicKeyHash();
    return [currentAccount];
  }

  public async estimateGas(transactionConfig: any) {
    //    return this.web3.eth.estimateGas(transactionConfig);
    return 0;
  }

  public async getBlockNumber() {
    const { level } = await this.tezos.rpc.getBlockHeader();
    return level;
  }

  public setProvider(provider: Provider) {
    let currentHost;
    let host;
    // @ts-ignore: Property 'host' does not exist on type 'Provider'.
    if (provider.host) {
      // @ts-ignore: Property 'host' does not exist on type 'Provider'.
      currentHost = provider.host;
      // web3 has some neat quirks
      host = currentHost.match(/(^https?:\/\/)(.*?)\:\d.*/)[2];
    } else {
      host = provider;
    }
    return this.tezos.setProvider({ rpc: host });
  }

  public async setWallet(config: Config) {
    const { networks, network } = config;
    // here we import user's faucet account:
    // email, passphrase, mnemonic, & secret are all REQUIRED.
    // TODO: add logic to check if user is importing only a private secret key
    // that would unlock the account, or a psk w/ passphrase
    let mnemonic = networks[network].mnemonic;
    if (Array.isArray(mnemonic)) mnemonic = mnemonic.join(" ");
    await this.tezos.importKey(
      networks[network].email,
      networks[network].passphrase,
      mnemonic,
      networks[network].secret
    );
  }
}
