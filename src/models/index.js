// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Feedback, Pet, Event, User, Families } = initSchema(schema);

export {
  Feedback,
  Pet,
  Event,
  User,
  Families
};