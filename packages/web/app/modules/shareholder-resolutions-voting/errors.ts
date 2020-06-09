import { EProposalState } from "./types";

class ShareholderResolutionsVotingModuleError extends Error {
  constructor(message: string) {
    super(`ShareholderResolutionsVotingModuleError: ${message}`);
  }
}

class ProposalNotFoundError extends ShareholderResolutionsVotingModuleError {
  constructor(proposalId: string) {
    super(`Proposal id not found ${proposalId}`);
  }
}

class ShareholderHasNoAccessToProposalError extends ShareholderResolutionsVotingModuleError {
  constructor() {
    super(`Shareholder has no access to proposal`);
  }
}

class ProposalStateNotSupportedError extends ShareholderResolutionsVotingModuleError {
  constructor(proposalState: EProposalState) {
    super(`Proposal state not supported ${proposalState}`);
  }
}

export {
  ShareholderResolutionsVotingModuleError,
  ProposalNotFoundError,
  ShareholderHasNoAccessToProposalError,
  ProposalStateNotSupportedError,
};
