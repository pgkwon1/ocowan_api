export const EXPINFO = {
  OCOWAN_EXP: 10,
  PR_EXP: 20,
  ISSUE_EXP: 10,
  COMMIT_EXP: 1,
};

export type levelInfo = {
  expMin: number;
  expMax: number;
  level: number;
};
type levelList = levelInfo[];
export const levelList: levelList = [
  {
    level: 1,
    expMin: 0,
    expMax: 99,
  },
  {
    level: 2,
    expMin: 100,
    expMax: 299,
  },
  {
    level: 3,
    expMin: 300,
    expMax: 599,
  },
  {
    level: 4,
    expMin: 600,
    expMax: 999,
  },
  {
    level: 5,
    expMin: 1000,
    expMax: 1499,
  },
  {
    level: 6,
    expMin: 1500,
    expMax: 2099,
  },
  {
    level: 7,
    expMin: 210,
    expMax: 2799,
  },

  {
    level: 8,
    expMin: 2800,
    expMax: 3599,
  },

  {
    level: 9,
    expMin: 3600,
    expMax: 4499,
  },

  {
    level: 10,
    expMin: 4499,
    expMax: Infinity,
  },
];
