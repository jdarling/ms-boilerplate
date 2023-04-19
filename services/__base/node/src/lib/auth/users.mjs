const bcrypt = require('bcryptjs');

const Mongo = require('../mongo');
const ObjectID = require('mongodb').ObjectId;

const mongo = new Mongo({
  collectionName: 'users',
  indexes: [
    { key: { email: 1, username: 1 }, unique: true, name: 'usernname-email' }
  ]
});

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

const getRecords = (collection, { filter, skip, limit }) => {
  let recs = collection.find(filter);
  if (isNumeric(skip)) {
    recs = recs.skip(skip);
  }
  if (isNumeric(limit)) {
    recs = recs.limit(limit);
  }
  return recs;
};

const trimIfString = (s) => {
  if (typeof s === 'string') {
    return s.trim();
  }
  return s;
};

class User {
  constructor(profile) {
    this.profile = profile;
    if (this.profile && typeof this.profile._id === 'string') {
      try {
        this.profile._id = ObjectID(this.profile._id);
      } catch (e) {}
    }
  }

  static profileFrom(profile) {
    const { isOAuth, username, email, ...updateProfile } = profile;
    const trimmedUser = trimIfString(username);
    const trimmedEmail = trimIfString(email);
    if (trimmedUser) {
      return {
        username: trimmedUser,
        ...updateProfile
      };
    }
    if (trimmedEmail) {
      return {
        email: trimmedEmail,
        ...updateProfile
      };
    }
    return updateProfile;
  }
  static async list(options) {
    const recs = getRecords(mongo.collection(), options);
    return await recs.toArray();
  }

  static async getUser(creds) {
    const { username, password, email } = User.profileFrom(creds);
    if (username && !password) {
      throw new Error(
        `Username but no password passed to getUser for ${username}`
      );
    }
    if (!email && !username && !password) {
      throw new Error('Nothing passed to getUser');
    }
    if (email) {
      const emailUser = await mongo
        .collection()
        .findOne({ email: new RegExp(`^${email.trim()}$`, 'i') });
      return new User(emailUser);
    }
    const user = await mongo
      .collection()
      .findOne({ username: new RegExp(`^${username.trim()}$`, 'i') });
    const checkUser = new User(user);
    if (checkUser.checkPassword(password)) {
      return new User(user);
    }
    throw new Error(`Invalid password for username ${username}`);
  }

  static async findOne(query) {
    const findQuery = User.profileFrom(query);
    const user = await mongo.collection().findOne(findQuery);
    return new User(user);
  }

  checkPassword(inputPassword) {
    const profile = this.profile;
    return bcrypt.compareSync(inputPassword, profile.password);
  }

  hashPassword(plainTextPassword) {
    return bcrypt.hashSync(plainTextPassword, 10);
  }

  async update(profile) {
    if (typeof profile === 'undefined') {
      const { password: _, isOAuth, ..._profile } = this.profile;
      profile = _profile;
    }

    if (profile.password) {
      profile.password = this.hashPassword(profile.password);
    }
    const _id = this.profile._id;

    const { _id: _, isOAuth, ...updateProfile } = User.profileFrom(profile);
    return await mongo
      .collection()
      .updateOne({ _id }, { $set: updateProfile }, (err, updateResult) => {
        if (err) {
          throw new Error(err);
        }
        this.profile = updateProfile;
        return this;
      });
  }

  async save() {
    const profile = this.profile || {};
    if (profile.password) {
      profile.password = this.hashPassword(profile.password);
    }

    const inserted = await mongo
      .collection()
      .insertOne(User.profileFrom(profile));
    const { insertedId } = inserted;
    this.profile = Object.assign({}, profile, { _id: insertedId });
    return this;
  }

  async delete() {
    const profile = this.profile || {};

    const res = await mongo.collection().deleteOne({ _id: profile._id });
    this.profile = {};
    return res;
  }

  isInGroup(group) {
    return (
      this.profile &&
      Array.isArray(this.profile.groups) &&
      this.profile.groups.includes(group)
    );
  }

  isAdmin() {
    return this.isInGroup('systems/admin');
  }

  isAccount(accountId) {
    if (this.isAdmin()) {
      return true;
    }
    const group = `client/${accountId}`;
    return this.isInGroup(group);
  }
}

module.exports = User;
