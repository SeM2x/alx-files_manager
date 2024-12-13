import sha1 from 'sha1';
import dbClient from '../utils/db';

const AppController = {
  postNew: async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }
    const user = await (await dbClient.usersCollection()).findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const insertedUser = dbClient.usersCollection().insertOne({
      email,
      password: sha1(password),
    });

    return res.status(201).json({
      id: insertedUser.insertedId.toString(),
      email,
    });
  },
};

export default AppController;
