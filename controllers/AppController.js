import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  getStatus: async (req, res) => {
    res.status(200).send({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  },
  getStats: async (req, res) => {
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
      .then(([usersCount, filesCount]) => {
        res.status(200).json({ users: usersCount, files: filesCount });
      });
  },
};

export default AppController;
