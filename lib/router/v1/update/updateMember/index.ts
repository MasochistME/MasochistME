export { updateMember } from './updateMember';
export * from './types';

class QueueMember {
  public MAX_UPDATE_QUEUE = 4;
  private _QUEUE: string[];

  constructor() {
    this._QUEUE = [];
  }

  get QUEUE(): string[] {
    return this._QUEUE;
  }

  set QUEUE(Q_UPDATE: string[]) {
    this._QUEUE = Q_UPDATE;
  }
}

export const queueMember = new QueueMember();
