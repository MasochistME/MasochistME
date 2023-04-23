class UpdateQueue {
  public MAX_UPDATE_MEMBER_QUEUE = 4;
  public MAX_UPDATE_CANDIDATE_QUEUE = 1;
  private _MEMBER_QUEUE: string[] = [];
  private _CANDIDATE_QUEUE: string[] = [];

  constructor() {
    this._MEMBER_QUEUE = [];
    this._CANDIDATE_QUEUE = [];
  }

  // Member queues
  get MEMBER_QUEUE(): string[] {
    return this._MEMBER_QUEUE;
  }
  set MEMBER_QUEUE(Q_UPDATE: string[]) {
    this._MEMBER_QUEUE = Q_UPDATE;
  }
  isMemberQueueFull = () =>
    this._MEMBER_QUEUE.length >= this.MAX_UPDATE_MEMBER_QUEUE;

  // Candidate queues
  get CANDIDATE_QUEUE(): string[] {
    return this._CANDIDATE_QUEUE;
  }
  set CANDIDATE_QUEUE(Q_UPDATE: string[]) {
    this._CANDIDATE_QUEUE = Q_UPDATE;
  }
  isCandidateQueueFull = () =>
    this._CANDIDATE_QUEUE.length >= this.MAX_UPDATE_CANDIDATE_QUEUE;
}

export const updateQueue = new UpdateQueue();
