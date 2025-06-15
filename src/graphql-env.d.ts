/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'DateTime': unknown;
    'Int': unknown;
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'createDraft': { name: 'createDraft'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'deletePost': { name: 'deletePost'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'incrementPostViewCount': { name: 'incrementPostViewCount'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'login': { name: 'login'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'signup': { name: 'signup'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'togglePublishPost': { name: 'togglePublishPost'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; }; };
    'Post': { kind: 'OBJECT'; name: 'Post'; fields: { 'author': { name: 'author'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'content': { name: 'content'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'createdAt': { name: 'createdAt'; type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'published': { name: 'published'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'title': { name: 'title'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'updatedAt': { name: 'updatedAt'; type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; } }; 'viewCount': { name: 'viewCount'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; }; };
    'PostCreateInput': { kind: 'INPUT_OBJECT'; name: 'PostCreateInput'; isOneOf: false; inputFields: [{ name: 'content'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'title'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }]; };
    'PostOrderByUpdatedAtInput': { kind: 'INPUT_OBJECT'; name: 'PostOrderByUpdatedAtInput'; isOneOf: false; inputFields: [{ name: 'updatedAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'SortOrder'; ofType: null; }; }; defaultValue: null }]; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'allUsers': { name: 'allUsers'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; }; } }; 'draftsByUser': { name: 'draftsByUser'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Post'; ofType: null; }; }; } }; 'feed': { name: 'feed'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Post'; ofType: null; }; }; } }; 'me': { name: 'me'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'postById': { name: 'postById'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; }; };
    'SortOrder': { name: 'SortOrder'; enumValues: 'asc' | 'desc'; };
    'String': unknown;
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'email': { name: 'email'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'posts': { name: 'posts'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Post'; ofType: null; }; }; } }; }; };
    'UserUniqueInput': { kind: 'INPUT_OBJECT'; name: 'UserUniqueInput'; isOneOf: false; inputFields: [{ name: 'email'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'id'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; defaultValue: null }]; };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: 'Mutation';
  subscription: never;
  types: introspection_types;
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}