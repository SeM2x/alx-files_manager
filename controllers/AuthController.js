import sha1 from 'sha1';
import uuid from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AuthController = {
  getConnect: async (req, res) => {
    const basicAuthtoken = req.header('Authorization');
    if (!basicAuthtoken || !basicAuthtoken.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const credentials = Buffer.from(
      basicAuthtoken.split(' ')[1],
      'base64',
    ).toString('utf-8');
    const [email, password] = credentials.split(':');

    const user = await (await dbClient.usersCollection()).findOne({ email });

    if (!user || user.password !== sha1(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuid.v4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 86400);
    return res.status(200).json({ token });
  },
  getDisconnect: async (req, res) => {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(`auth_${token}`);
    return res.status(204).end();
  },
};

export default AuthController;
