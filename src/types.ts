export enum Category {
  Position = 'position',
  Time = 'time',
  Username = 'username',
  All = 'all'
}

export enum Progress {
  NotStarted = 'not_started',
  Started = 'started',
  Done = 'done'
}

export type Validation = {
  correct: boolean;
  errMsg: string;
};

export type Coord = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type Result = {
  username: string;
  position: number;
};
