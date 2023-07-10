import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";





type EagerFeedback = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Feedback, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly Description?: string | null;
  readonly Email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFeedback = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Feedback, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly Description?: string | null;
  readonly Email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Feedback = LazyLoading extends LazyLoadingDisabled ? EagerFeedback : LazyFeedback

export declare const Feedback: (new (init: ModelInit<Feedback>) => Feedback) & {
  copyOf(source: Feedback, mutator: (draft: MutableModel<Feedback>) => MutableModel<Feedback> | void): Feedback;
}

type EagerPet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Pet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly familiesID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Pet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly familiesID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Pet = LazyLoading extends LazyLoadingDisabled ? EagerPet : LazyPet

export declare const Pet: (new (init: ModelInit<Pet>) => Pet) & {
  copyOf(source: Pet, mutator: (draft: MutableModel<Pet>) => MutableModel<Pet> | void): Pet;
}

type EagerEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Event, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Num1?: boolean | null;
  readonly Num2?: boolean | null;
  readonly Description?: string | null;
  readonly Pet?: Pet | null;
  readonly familiesID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly eventPetId?: string | null;
}

type LazyEvent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Event, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Num1?: boolean | null;
  readonly Num2?: boolean | null;
  readonly Description?: string | null;
  readonly Pet: AsyncItem<Pet | undefined>;
  readonly familiesID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly eventPetId?: string | null;
}

export declare type Event = LazyLoading extends LazyLoadingDisabled ? EagerEvent : LazyEvent

export declare const Event: (new (init: ModelInit<Event>) => Event) & {
  copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly familiesID: string;
  readonly Email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly familiesID: string;
  readonly Email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerFamilies = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Families, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Family_Name?: string | null;
  readonly Users?: (User | null)[] | null;
  readonly Pets?: (Pet | null)[] | null;
  readonly Events?: (Event | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFamilies = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Families, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Family_Name?: string | null;
  readonly Users: AsyncCollection<User>;
  readonly Pets: AsyncCollection<Pet>;
  readonly Events: AsyncCollection<Event>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Families = LazyLoading extends LazyLoadingDisabled ? EagerFamilies : LazyFamilies

export declare const Families: (new (init: ModelInit<Families>) => Families) & {
  copyOf(source: Families, mutator: (draft: MutableModel<Families>) => MutableModel<Families> | void): Families;
}