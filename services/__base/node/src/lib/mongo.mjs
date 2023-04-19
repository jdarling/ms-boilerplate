import config from './config.mjs';
import logger from './logger.mjs';
import pkg from '../package.json' assert {type: json};
import getOrganizationName from './getorganizationname.mjs';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId || require('mongodb').ObjectID;
import EventEmitter from 'events';

const {
  mongoUser,
  mongoPassword,
  mongodbConnectionstring: DEFAULT_CONNECTION_STRING,
  dbName: DEFAULT_DB_NAME = getOrganizationName(),
  collectionName: DEFAULT_COLLECTION = pkg.name,
} = config;

const mongoAuth =
  mongoUser && mongoPassword
    ? {
        user: mongoUser,
        password: mongoPassword,
      }
    : undefined;

const DEFAULT_MONGO_OPTIONS = {
  useNewUrlParser: true,
  auth: mongoAuth,
};

class Mongo {
  constructor({
    dbName = DEFAULT_DB_NAME,
    collectionName = DEFAULT_COLLECTION,
    mongodbConnectionstring = DEFAULT_CONNECTION_STRING,
    mongoOptions = DEFAULT_MONGO_OPTIONS,
    indexes = [],
    capped = false,
    size = 100000,
  }) {
    this.emitter = new EventEmitter();
    this.dbName = dbName;
    this.collectionName = collectionName;

    MongoClient.connect(
      mongodbConnectionstring,
      mongoOptions,
      (err, client) => {
        if (err) {
          logger.error(err);
          process.exit(1);
        }
        this.client = client;
        try {
          if (capped) {
            this.db().createCollection(collectionName, { capped, size });
          }
        } catch (e) {
          logger.error(e);
        }
        if (Array.isArray(indexes) && indexes.length > 0) {
          return this.collection().createIndexes(indexes, {}, (err, r) => {
            if (err) {
              logger.error(err);
              process.exit(1);
            }
            logger.debug(r);
            this.emit('ready', this);
          });
        }

        this.emit('ready', this);
      }
    );
  }

  emit(...args) {
    this.emitter.emit(...args);
  }

  on(eventName, handler) {
    this.emitter.on(eventName, handler);
  }

  db() {
    return this.client.db(this.dbName);
  }

  collection(collectionName) {
    return this.client
      .db(this.dbName)
      .collection(collectionName || this.collectionName);
  }
}

Mongo.ObjectId = ObjectId;

export default Mongo;
