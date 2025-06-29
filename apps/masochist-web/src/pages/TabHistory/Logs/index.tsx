import { Flex } from 'components';
import { AchievementNumberChangeLog } from './AchievementNumberChangeLog';
import { BadgeCreateLog } from './BadgeCreateLog';
import { BadgeGrantLog } from './BadgeGrantLog';
import { CustomLog } from './CustomLog';
import { GameAddLog } from './GameAddLog';
import { GameCompleteLog } from './GameCompleteLog';
import { GameRemoveLog } from './GameRemoveLog';
import { MemberJoinLog } from './MemberJoinLog';
import { MemberLeaveLog } from './MemberLeaveLog';
import { TierChangeLog } from './TierChangeLog';
import {
  Description,
  Icon,
  Icons,
  Image,
  Link,
  Logo,
  Summary,
} from './components';

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
