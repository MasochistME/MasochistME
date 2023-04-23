/**
 * @module Members
 */

// Basic member methods
export { getMembersList, MembersListParams } from './getMembersList';
export { getMemberById } from './getMemberById';
export { updateMemberById } from './updateMemberById';

// Game related member endpoints
export { getMemberGameList, MemberGameListParams } from './getMemberGameList';
export {
	getMemberAchievementList,
	MemberAchievementListParams,
} from './getMemberAchievementList';

// Badges related member endpoints
export {
	getMemberBadgeList,
	MemberBadgeListParams,
} from './getMemberBadgeList';
export { giveBadgeToMemberById } from './giveBadgeToMemberById';
export { revokeBadgeFromMemberById } from './revokeBadgeFromMemberById';

// Awards related member endpoints
export {
	getMemberAwardList,
	MemberAwardListParams,
} from './getMemberAwardList';
export { giveAwardToMemberById } from './giveAwardToMemberById';
export { revokeAwardFromMemberById } from './revokeAwardFromMemberById';
