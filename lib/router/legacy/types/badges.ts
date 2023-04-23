import { ObjectId } from 'mongodb';

export type TBadge = {
  _id: ObjectId;
  name: string;
  img: string;
  points: string | number;
  requirements: string;
  description: string;
  gameId: string;
  enabled: boolean;
  legacy: boolean;
};
