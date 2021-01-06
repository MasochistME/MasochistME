type TUpdatedUser = {
  user: number;
  progress: number;
};

const cache = {
  updating: Array<TUpdatedUser>(),
};

export default cache;
