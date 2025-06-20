/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
  AuthResponse: {
    kind: 'OBJECT'
    name: 'AuthResponse'
    fields: {
      token: {
        name: 'token'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
    }
  }
  AuthTokens: {
    kind: 'OBJECT'
    name: 'AuthTokens'
    fields: {
      accessToken: {
        name: 'accessToken'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      refreshToken: {
        name: 'refreshToken'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
    }
  }
  AuthenticationError: {
    kind: 'OBJECT'
    name: 'AuthenticationError'
    fields: {
      code: {
        name: 'code'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      message: {
        name: 'message'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      statusCode: {
        name: 'statusCode'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
    }
  }
  AuthorizationError: {
    kind: 'OBJECT'
    name: 'AuthorizationError'
    fields: {
      code: {
        name: 'code'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      message: {
        name: 'message'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      statusCode: {
        name: 'statusCode'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
    }
  }
  Boolean: unknown
  BooleanFilter: {
    kind: 'INPUT_OBJECT'
    name: 'BooleanFilter'
    isOneOf: false
    inputFields: [
      {
        name: 'equals'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
        defaultValue: null
      },
      {
        name: 'not'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
        defaultValue: null
      },
    ]
  }
  ConflictError: {
    kind: 'OBJECT'
    name: 'ConflictError'
    fields: {
      code: {
        name: 'code'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      message: {
        name: 'message'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      statusCode: {
        name: 'statusCode'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
    }
  }
  CreatePostInput: {
    kind: 'INPUT_OBJECT'
    name: 'CreatePostInput'
    isOneOf: false
    inputFields: [
      {
        name: 'content'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'published'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
        defaultValue: 'false'
      },
      {
        name: 'title'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        defaultValue: null
      },
    ]
  }
  DID: unknown
  DateTime: unknown
  DateTimeFilter: {
    kind: 'INPUT_OBJECT'
    name: 'DateTimeFilter'
    isOneOf: false
    inputFields: [
      {
        name: 'equals'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
        defaultValue: null
      },
      {
        name: 'gt'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
        defaultValue: null
      },
      {
        name: 'gte'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
        defaultValue: null
      },
      {
        name: 'lt'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
        defaultValue: null
      },
      {
        name: 'lte'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
        defaultValue: null
      },
    ]
  }
  ID: unknown
  Int: unknown
  IntFilter: {
    kind: 'INPUT_OBJECT'
    name: 'IntFilter'
    isOneOf: false
    inputFields: [
      {
        name: 'equals'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        defaultValue: null
      },
      {
        name: 'gt'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        defaultValue: null
      },
      {
        name: 'gte'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        defaultValue: null
      },
      {
        name: 'in'
        type: {
          kind: 'LIST'
          name: never
          ofType: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
          }
        }
        defaultValue: null
      },
      {
        name: 'lt'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        defaultValue: null
      },
      {
        name: 'lte'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        defaultValue: null
      },
      {
        name: 'notIn'
        type: {
          kind: 'LIST'
          name: never
          ofType: {
            kind: 'NON_NULL'
            name: never
            ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
          }
        }
        defaultValue: null
      },
    ]
  }
  JSON: unknown
  Mutation: {
    kind: 'OBJECT'
    name: 'Mutation'
    fields: {
      createComment: {
        name: 'createComment'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      createPost: {
        name: 'createPost'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
      deletePost: {
        name: 'deletePost'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
      }
      incrementPostViewCount: {
        name: 'incrementPostViewCount'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
      login: {
        name: 'login'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      loginWithTokens: {
        name: 'loginWithTokens'
        type: { kind: 'OBJECT'; name: 'AuthTokens'; ofType: null }
      }
      logout: {
        name: 'logout'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
      }
      moderatePost: {
        name: 'moderatePost'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
      }
      refreshToken: {
        name: 'refreshToken'
        type: { kind: 'OBJECT'; name: 'AuthTokens'; ofType: null }
      }
      signup: {
        name: 'signup'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      togglePublishPost: {
        name: 'togglePublishPost'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
      updatePost: {
        name: 'updatePost'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
      updateUserProfile: {
        name: 'updateUserProfile'
        type: { kind: 'OBJECT'; name: 'User'; ofType: null }
      }
    }
  }
  Node: {
    kind: 'INTERFACE'
    name: 'Node'
    fields: {
      id: {
        name: 'id'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null }
        }
      }
    }
    possibleTypes: 'Post' | 'User'
  }
  NotFoundError: {
    kind: 'OBJECT'
    name: 'NotFoundError'
    fields: {
      code: {
        name: 'code'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      message: {
        name: 'message'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      statusCode: {
        name: 'statusCode'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
    }
  }
  ObjectID: unknown
  PageInfo: {
    kind: 'OBJECT'
    name: 'PageInfo'
    fields: {
      endCursor: {
        name: 'endCursor'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      hasNextPage: {
        name: 'hasNextPage'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
        }
      }
      hasPreviousPage: {
        name: 'hasPreviousPage'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
        }
      }
      startCursor: {
        name: 'startCursor'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
    }
  }
  Post: {
    kind: 'OBJECT'
    name: 'Post'
    fields: {
      author: {
        name: 'author'
        type: { kind: 'OBJECT'; name: 'User'; ofType: null }
      }
      content: {
        name: 'content'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      createdAt: {
        name: 'createdAt'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
      }
      excerpt: {
        name: 'excerpt'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      id: {
        name: 'id'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null }
        }
      }
      isOwner: {
        name: 'isOwner'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
      }
      published: {
        name: 'published'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
      }
      readingTimeMinutes: {
        name: 'readingTimeMinutes'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
      title: {
        name: 'title'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      updatedAt: {
        name: 'updatedAt'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
      }
      viewCount: {
        name: 'viewCount'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
      wordCount: {
        name: 'wordCount'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
    }
  }
  PostCreateInput: {
    kind: 'INPUT_OBJECT'
    name: 'PostCreateInput'
    isOneOf: false
    inputFields: [
      {
        name: 'content'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'title'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
        defaultValue: null
      },
    ]
  }
  PostOrderByInput: {
    kind: 'INPUT_OBJECT'
    name: 'PostOrderByInput'
    isOneOf: false
    inputFields: [
      {
        name: 'createdAt'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
      {
        name: 'id'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
      {
        name: 'published'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
      {
        name: 'title'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
      {
        name: 'updatedAt'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
      {
        name: 'viewCount'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
    ]
  }
  PostOrderByUpdatedAtInput: {
    kind: 'INPUT_OBJECT'
    name: 'PostOrderByUpdatedAtInput'
    isOneOf: false
    inputFields: [
      {
        name: 'updatedAt'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        }
        defaultValue: null
      },
    ]
  }
  PostUpdateInput: {
    kind: 'INPUT_OBJECT'
    name: 'PostUpdateInput'
    isOneOf: false
    inputFields: [
      {
        name: 'content'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'published'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
        defaultValue: null
      },
      {
        name: 'title'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
    ]
  }
  PostWhereInput: {
    kind: 'INPUT_OBJECT'
    name: 'PostWhereInput'
    isOneOf: false
    inputFields: [
      {
        name: 'authorId'
        type: { kind: 'INPUT_OBJECT'; name: 'IntFilter'; ofType: null }
        defaultValue: null
      },
      {
        name: 'content'
        type: { kind: 'INPUT_OBJECT'; name: 'StringFilter'; ofType: null }
        defaultValue: null
      },
      {
        name: 'createdAt'
        type: { kind: 'INPUT_OBJECT'; name: 'DateTimeFilter'; ofType: null }
        defaultValue: null
      },
      {
        name: 'published'
        type: { kind: 'INPUT_OBJECT'; name: 'BooleanFilter'; ofType: null }
        defaultValue: null
      },
      {
        name: 'title'
        type: { kind: 'INPUT_OBJECT'; name: 'StringFilter'; ofType: null }
        defaultValue: null
      },
      {
        name: 'updatedAt'
        type: { kind: 'INPUT_OBJECT'; name: 'DateTimeFilter'; ofType: null }
        defaultValue: null
      },
      {
        name: 'viewCount'
        type: { kind: 'INPUT_OBJECT'; name: 'IntFilter'; ofType: null }
        defaultValue: null
      },
    ]
  }
  Query: {
    kind: 'OBJECT'
    name: 'Query'
    fields: {
      drafts: {
        name: 'drafts'
        type: { kind: 'OBJECT'; name: 'QueryDraftsConnection'; ofType: null }
      }
      feed: {
        name: 'feed'
        type: { kind: 'OBJECT'; name: 'QueryFeedConnection'; ofType: null }
      }
      me: { name: 'me'; type: { kind: 'OBJECT'; name: 'User'; ofType: null } }
      post: {
        name: 'post'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
      searchUsers: {
        name: 'searchUsers'
        type: {
          kind: 'OBJECT'
          name: 'QuerySearchUsersConnection'
          ofType: null
        }
      }
      user: {
        name: 'user'
        type: { kind: 'OBJECT'; name: 'User'; ofType: null }
      }
      users: {
        name: 'users'
        type: { kind: 'OBJECT'; name: 'QueryUsersConnection'; ofType: null }
      }
    }
  }
  QueryDraftsConnection: {
    kind: 'OBJECT'
    name: 'QueryDraftsConnection'
    fields: {
      edges: {
        name: 'edges'
        type: {
          kind: 'LIST'
          name: never
          ofType: {
            kind: 'OBJECT'
            name: 'QueryDraftsConnectionEdge'
            ofType: null
          }
        }
      }
      pageInfo: {
        name: 'pageInfo'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null }
        }
      }
      totalCount: {
        name: 'totalCount'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        }
      }
    }
  }
  QueryDraftsConnectionEdge: {
    kind: 'OBJECT'
    name: 'QueryDraftsConnectionEdge'
    fields: {
      cursor: {
        name: 'cursor'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
      }
      node: {
        name: 'node'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
    }
  }
  QueryFeedConnection: {
    kind: 'OBJECT'
    name: 'QueryFeedConnection'
    fields: {
      edges: {
        name: 'edges'
        type: {
          kind: 'LIST'
          name: never
          ofType: {
            kind: 'OBJECT'
            name: 'QueryFeedConnectionEdge'
            ofType: null
          }
        }
      }
      pageInfo: {
        name: 'pageInfo'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null }
        }
      }
      totalCount: {
        name: 'totalCount'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        }
      }
    }
  }
  QueryFeedConnectionEdge: {
    kind: 'OBJECT'
    name: 'QueryFeedConnectionEdge'
    fields: {
      cursor: {
        name: 'cursor'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
      }
      node: {
        name: 'node'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
    }
  }
  QuerySearchUsersConnection: {
    kind: 'OBJECT'
    name: 'QuerySearchUsersConnection'
    fields: {
      edges: {
        name: 'edges'
        type: {
          kind: 'LIST'
          name: never
          ofType: {
            kind: 'OBJECT'
            name: 'QuerySearchUsersConnectionEdge'
            ofType: null
          }
        }
      }
      pageInfo: {
        name: 'pageInfo'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null }
        }
      }
      totalCount: {
        name: 'totalCount'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        }
      }
    }
  }
  QuerySearchUsersConnectionEdge: {
    kind: 'OBJECT'
    name: 'QuerySearchUsersConnectionEdge'
    fields: {
      cursor: {
        name: 'cursor'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
      }
      node: {
        name: 'node'
        type: { kind: 'OBJECT'; name: 'User'; ofType: null }
      }
    }
  }
  QueryUsersConnection: {
    kind: 'OBJECT'
    name: 'QueryUsersConnection'
    fields: {
      edges: {
        name: 'edges'
        type: {
          kind: 'LIST'
          name: never
          ofType: {
            kind: 'OBJECT'
            name: 'QueryUsersConnectionEdge'
            ofType: null
          }
        }
      }
      pageInfo: {
        name: 'pageInfo'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null }
        }
      }
      totalCount: {
        name: 'totalCount'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        }
      }
    }
  }
  QueryUsersConnectionEdge: {
    kind: 'OBJECT'
    name: 'QueryUsersConnectionEdge'
    fields: {
      cursor: {
        name: 'cursor'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
      }
      node: {
        name: 'node'
        type: { kind: 'OBJECT'; name: 'User'; ofType: null }
      }
    }
  }
  RateLimitError: {
    kind: 'OBJECT'
    name: 'RateLimitError'
    fields: {
      code: {
        name: 'code'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      message: {
        name: 'message'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      retryAfter: {
        name: 'retryAfter'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
      statusCode: {
        name: 'statusCode'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
    }
  }
  SortOrder: { name: 'SortOrder'; enumValues: 'asc' | 'desc' }
  String: unknown
  StringFilter: {
    kind: 'INPUT_OBJECT'
    name: 'StringFilter'
    isOneOf: false
    inputFields: [
      {
        name: 'contains'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'endsWith'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'equals'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'not'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'startsWith'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
    ]
  }
  UUID: unknown
  UpdatePostInput: {
    kind: 'INPUT_OBJECT'
    name: 'UpdatePostInput'
    isOneOf: false
    inputFields: [
      {
        name: 'content'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'published'
        type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null }
        defaultValue: null
      },
      {
        name: 'title'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
    ]
  }
  UpdateUserInput: {
    kind: 'INPUT_OBJECT'
    name: 'UpdateUserInput'
    isOneOf: false
    inputFields: [
      {
        name: 'email'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'name'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
    ]
  }
  User: {
    kind: 'OBJECT'
    name: 'User'
    fields: {
      createdAt: {
        name: 'createdAt'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
      }
      draftsCount: {
        name: 'draftsCount'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
      email: {
        name: 'email'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      id: {
        name: 'id'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null }
        }
      }
      name: {
        name: 'name'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      postCount: {
        name: 'postCount'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
      posts: {
        name: 'posts'
        type: { kind: 'OBJECT'; name: 'UserPostsConnection'; ofType: null }
      }
      publishedPostCount: {
        name: 'publishedPostCount'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
      publishedPostsCount: {
        name: 'publishedPostsCount'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
      updatedAt: {
        name: 'updatedAt'
        type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null }
      }
    }
  }
  UserOrderByInput: {
    kind: 'INPUT_OBJECT'
    name: 'UserOrderByInput'
    isOneOf: false
    inputFields: [
      {
        name: 'email'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
      {
        name: 'id'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: 'asc'
      },
      {
        name: 'name'
        type: { kind: 'ENUM'; name: 'SortOrder'; ofType: null }
        defaultValue: null
      },
    ]
  }
  UserPostsConnection: {
    kind: 'OBJECT'
    name: 'UserPostsConnection'
    fields: {
      edges: {
        name: 'edges'
        type: {
          kind: 'LIST'
          name: never
          ofType: {
            kind: 'OBJECT'
            name: 'UserPostsConnectionEdge'
            ofType: null
          }
        }
      }
      pageInfo: {
        name: 'pageInfo'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null }
        }
      }
      totalCount: {
        name: 'totalCount'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        }
      }
    }
  }
  UserPostsConnectionEdge: {
    kind: 'OBJECT'
    name: 'UserPostsConnectionEdge'
    fields: {
      cursor: {
        name: 'cursor'
        type: {
          kind: 'NON_NULL'
          name: never
          ofType: { kind: 'SCALAR'; name: 'String'; ofType: null }
        }
      }
      node: {
        name: 'node'
        type: { kind: 'OBJECT'; name: 'Post'; ofType: null }
      }
    }
  }
  UserSearchInput: {
    kind: 'INPUT_OBJECT'
    name: 'UserSearchInput'
    isOneOf: false
    inputFields: [
      {
        name: 'query'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
    ]
  }
  UserUniqueInput: {
    kind: 'INPUT_OBJECT'
    name: 'UserUniqueInput'
    isOneOf: false
    inputFields: [
      {
        name: 'email'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
        defaultValue: null
      },
      {
        name: 'id'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
        defaultValue: null
      },
    ]
  }
  UserWhereInput: {
    kind: 'INPUT_OBJECT'
    name: 'UserWhereInput'
    isOneOf: false
    inputFields: [
      {
        name: 'email'
        type: { kind: 'INPUT_OBJECT'; name: 'StringFilter'; ofType: null }
        defaultValue: null
      },
      {
        name: 'name'
        type: { kind: 'INPUT_OBJECT'; name: 'StringFilter'; ofType: null }
        defaultValue: null
      },
    ]
  }
  ValidationError: {
    kind: 'OBJECT'
    name: 'ValidationError'
    fields: {
      code: {
        name: 'code'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      message: {
        name: 'message'
        type: { kind: 'SCALAR'; name: 'String'; ofType: null }
      }
      statusCode: {
        name: 'statusCode'
        type: { kind: 'SCALAR'; name: 'Int'; ofType: null }
      }
    }
  }
}

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never
  query: 'Query'
  mutation: 'Mutation'
  subscription: never
  types: introspection_types
}

// import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}
