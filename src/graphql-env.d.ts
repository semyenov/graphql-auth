/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'DID': unknown;
    'DateTime': unknown;
    'ID': unknown;
    'Int': unknown;
    'JSON': unknown;
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'createDraft': { name: 'createDraft'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'deletePost': { name: 'deletePost'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'incrementPostViewCount': { name: 'incrementPostViewCount'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'login': { name: 'login'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'signup': { name: 'signup'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'togglePublishPost': { name: 'togglePublishPost'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; }; };
    'Node': { kind: 'INTERFACE'; name: 'Node'; fields: { 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; }; possibleTypes: 'Post' | 'User'; };
    'ObjectID': unknown;
    'PageInfo': { kind: 'OBJECT'; name: 'PageInfo'; fields: { 'endCursor': { name: 'endCursor'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'hasNextPage': { name: 'hasNextPage'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'hasPreviousPage': { name: 'hasPreviousPage'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'startCursor': { name: 'startCursor'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
    'Post': { kind: 'OBJECT'; name: 'Post'; fields: { 'author': { name: 'author'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'content': { name: 'content'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'createdAt': { name: 'createdAt'; type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'published': { name: 'published'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'title': { name: 'title'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'updatedAt': { name: 'updatedAt'; type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; } }; 'viewCount': { name: 'viewCount'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; }; };
    'PostCreateInput': { kind: 'INPUT_OBJECT'; name: 'PostCreateInput'; isOneOf: false; inputFields: [{ name: 'content'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'title'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }]; };
    'PostOrderByUpdatedAtInput': { kind: 'INPUT_OBJECT'; name: 'PostOrderByUpdatedAtInput'; isOneOf: false; inputFields: [{ name: 'updatedAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'SortOrder'; ofType: null; }; }; defaultValue: null }]; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'drafts': { name: 'drafts'; type: { kind: 'OBJECT'; name: 'QueryDraftsConnection'; ofType: null; } }; 'feed': { name: 'feed'; type: { kind: 'OBJECT'; name: 'QueryFeedConnection'; ofType: null; } }; 'me': { name: 'me'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'node': { name: 'node'; type: { kind: 'INTERFACE'; name: 'Node'; ofType: null; } }; 'nodes': { name: 'nodes'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'INTERFACE'; name: 'Node'; ofType: null; }; }; } }; 'post': { name: 'post'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; 'user': { name: 'user'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; 'users': { name: 'users'; type: { kind: 'OBJECT'; name: 'QueryUsersConnection'; ofType: null; } }; }; };
    'QueryDraftsConnection': { kind: 'OBJECT'; name: 'QueryDraftsConnection'; fields: { 'edges': { name: 'edges'; type: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'QueryDraftsConnectionEdge'; ofType: null; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; }; };
    'QueryDraftsConnectionEdge': { kind: 'OBJECT'; name: 'QueryDraftsConnectionEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; }; };
    'QueryFeedConnection': { kind: 'OBJECT'; name: 'QueryFeedConnection'; fields: { 'edges': { name: 'edges'; type: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'QueryFeedConnectionEdge'; ofType: null; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; 'totalCount': { name: 'totalCount'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; }; };
    'QueryFeedConnectionEdge': { kind: 'OBJECT'; name: 'QueryFeedConnectionEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'OBJECT'; name: 'Post'; ofType: null; } }; }; };
    'QueryUsersConnection': { kind: 'OBJECT'; name: 'QueryUsersConnection'; fields: { 'edges': { name: 'edges'; type: { kind: 'LIST'; name: never; ofType: { kind: 'OBJECT'; name: 'QueryUsersConnectionEdge'; ofType: null; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; 'totalCount': { name: 'totalCount'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; }; };
    'QueryUsersConnectionEdge': { kind: 'OBJECT'; name: 'QueryUsersConnectionEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'OBJECT'; name: 'User'; ofType: null; } }; }; };
    'SortOrder': { name: 'SortOrder'; enumValues: 'asc' | 'desc'; };
    'String': unknown;
    'UUID': unknown;
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'email': { name: 'email'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'posts': { name: 'posts'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Post'; ofType: null; }; }; } }; }; };
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