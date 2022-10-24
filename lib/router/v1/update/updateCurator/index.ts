export { getUpdateCuratorStatus } from './getUpdateCuratorStatus';
export { updateCurator } from './updateCurator';

export enum UpdateStatus {
  IDLE = 'idle',
  ONGOING = 'ongoing',
  ERROR = 'error',
}

class StatusCurator {
  public curatorId = 41289936;
  public isUpdating: boolean;
  public updateDelay: number = 1000 * 60 * 60 * 24;
  private _updateProgress: number;
  private _updateStatus: UpdateStatus;

  constructor() {
    this.isUpdating = false;
    this._updateProgress = 0;
    this._updateStatus = UpdateStatus.IDLE;
  }

  get updateStatus(): UpdateStatus {
    return this._updateStatus;
  }
  set updateStatus(newStatus: UpdateStatus) {
    this._updateStatus = newStatus;
  }

  get updateProgress(): number {
    return this._updateProgress;
  }
  set updateProgress(newProgress: number) {
    this._updateProgress = newProgress;
  }
}

export const statusCurator = new StatusCurator();
