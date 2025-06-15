import type { ResultOf, VariablesOf } from 'gql.tada'
import type {
    CreateDraftMutation,
    DeletePostMutation,
    IncrementPostViewCountMutation,
    LoginMutation,
    SignupMutation,
    TogglePublishPostMutation
} from './mutations'
import type {
    GetAllUsersQuery,
    GetDraftsByUserQuery,
    GetFeedQuery,
    GetMeQuery,
    GetPostByIdQuery
} from './queries'

// =============================================================================
// TYPE EXPORTS (gql.tada generated types)
// =============================================================================

// Query Types
export type GetMeResult = ResultOf<typeof GetMeQuery>
export type GetAllUsersResult = ResultOf<typeof GetAllUsersQuery>
export type GetPostByIdResult = ResultOf<typeof GetPostByIdQuery>
export type GetPostByIdVariables = VariablesOf<typeof GetPostByIdQuery>
export type GetFeedResult = ResultOf<typeof GetFeedQuery>
export type GetFeedVariables = VariablesOf<typeof GetFeedQuery>
export type GetDraftsByUserResult = ResultOf<typeof GetDraftsByUserQuery>
export type GetDraftsByUserVariables = VariablesOf<typeof GetDraftsByUserQuery>

// Mutation Types
export type LoginResult = ResultOf<typeof LoginMutation>
export type LoginVariables = VariablesOf<typeof LoginMutation>
export type SignupResult = ResultOf<typeof SignupMutation>
export type SignupVariables = VariablesOf<typeof SignupMutation>
export type CreateDraftResult = ResultOf<typeof CreateDraftMutation>
export type CreateDraftVariables = VariablesOf<typeof CreateDraftMutation>
export type DeletePostResult = ResultOf<typeof DeletePostMutation>
export type DeletePostVariables = VariablesOf<typeof DeletePostMutation>
export type TogglePublishPostResult = ResultOf<typeof TogglePublishPostMutation>
export type TogglePublishPostVariables = VariablesOf<typeof TogglePublishPostMutation>
export type IncrementPostViewCountResult = ResultOf<typeof IncrementPostViewCountMutation>
export type IncrementPostViewCountVariables = VariablesOf<typeof IncrementPostViewCountMutation> 