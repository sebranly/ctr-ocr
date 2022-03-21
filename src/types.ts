export enum Category {
  Position = 'position',
  Time = 'time',
  Username = 'username',
  All = 'all'
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
