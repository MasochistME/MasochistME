import { Flex } from 'components';

import { GameAddLog } from './GameAddLog';
import { GameRemoveLog } from './GameRemoveLog';
import { MemberJoinLog } from './MemberJoinLog';
import { MemberLeaveLog } from './MemberLeaveLog';
import { GameCompleteLog } from './GameCompleteLog';
import { BadgeCreateLog } from './BadgeCreateLog';
import { BadgeGrantLog } from './BadgeGrantLog';
import { AchievementNumberChangeLog } from './AchievementNumberChangeLog';
import { TierChangeLog } from './TierChangeLog';
import { CustomLog } from './CustomLog';

type Props = {
	children: React.ReactNode;
	onClick?: () => void;
};
export const HistoryLog = (props: Pick<Props, 'children'>) => {
	const { children } = props;
	return (
		<Flex align justifyContent="space-between" width="100%" gap={6}>
			{children}
		</Flex>
	);
};

/**
 * Types of logs
 */
HistoryLog.GameAdd = GameAddLog;
HistoryLog.GameRemove = GameRemoveLog;
HistoryLog.MemberJoin = MemberJoinLog;
HistoryLog.MemberLeave = MemberLeaveLog;
HistoryLog.GameComplete = GameCompleteLog;
HistoryLog.BadgeCreate = BadgeCreateLog;
HistoryLog.BadgeGrant = BadgeGrantLog;
HistoryLog.AchievementNumberChange = AchievementNumberChangeLog;
HistoryLog.TierChange = TierChangeLog;
HistoryLog.Custom = CustomLog;

import {
	Description,
	Icons,
	Image,
	Link,
	Icon,
	Logo,
	Summary,
} from './components';

/**
 * Log sub-components
 */

HistoryLog.Description = Description;
HistoryLog.Icons = Icons;
HistoryLog.Image = Image;
HistoryLog.Link = Link;
HistoryLog.Icon = Icon;
HistoryLog.Logo = Logo;
HistoryLog.Summary = Summary;
