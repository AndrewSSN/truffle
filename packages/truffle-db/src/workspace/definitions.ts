import { Definitions } from "./pouch";

export type WorkspaceCollections = {
  bytecodes: {
    resourceName: "bytecode";
    resource: DataModel.IBytecode;
    addMutation: "bytecodesAdd";
    input: DataModel.IBytecodesAddInput;
  };
  compilations: {
    resourceName: "compilation";
    resource: DataModel.ICompilation;
    addMutation: "compilationsAdd";
    input: DataModel.ICompilationsAddInput;
  };
  contractInstances: {
    resourceName: "contractInstance";
    resource: DataModel.IContractInstance;
    addMutation: "contractInstancesAdd";
    input: DataModel.IContractInstancesAddInput;
  };
  contracts: {
    resourceName: "contract";
    resource: DataModel.IContract;
    addMutation: "contractsAdd";
    input: DataModel.IContractsAddInput;
  };
  networks: {
    resourceName: "network";
    resource: DataModel.INetwork;
    addMutation: "networksAdd";
    input: DataModel.INetworksAddInput;
  };
  sources: {
    resourceName: "source";
    resource: DataModel.ISource;
    addMutation: "sourcesAdd";
    input: DataModel.ISourcesAddInput;
  };
};

export const definitions: Definitions<WorkspaceCollections> = {
  contracts: {
    createIndexes: [],
    idFields: ["name", "abi", "sourceContract", "compilation"]
  },
  sources: {
    createIndexes: [{ fields: ["contents"] }, { fields: ["sourcePath"] }],
    idFields: ["contents", "sourcePath"]
  },
  compilations: {
    createIndexes: [],
    idFields: ["compiler", "sources"]
  },
  bytecodes: {
    createIndexes: [],
    idFields: ["bytes", "linkReferences"]
  },
  networks: {
    createIndexes: [{ fields: ["id"] }],
    idFields: ["networkId", "historicBlock"]
  },
  contractInstances: {
    createIndexes: [],
    idFields: ["address", "network"]
  }
};
