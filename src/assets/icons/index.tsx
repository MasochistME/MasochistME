import { default as Badge } from './Badge';
import { default as Bolt } from './Bolt';
import { default as Checklist } from './Checklist';
import { default as Clock } from './Clock';
import { default as Discord } from './Discord';
import { default as Donation } from './Donation';
import { default as Finish } from './Finish';
import { default as Gamepad } from './Gamepad';
import { default as Grid } from './Grid';
import { default as Heart } from './Heart';
import { default as History } from './History';
import { default as Home } from './Home';
import { default as IDCard } from './IDCard';
import { default as Medal } from './Medal';
import { default as Patreon } from './Patreon';
import { default as Percent } from './Percent';
import { default as Puzzle } from './Puzzle';
import { default as QuestionCircle } from './QuestionCircle';
import { default as SquareMinus } from './SquareMinus';
import { default as SquarePlus } from './SquarePlus';
import { default as StarBlack } from './StarBlack';
import { default as StarCheck } from './StarCheck';
import { default as StarEmpty } from './StarEmpty';
import { default as StarHalf } from './StarHalf';
import { default as StarHalfAlt } from './StarHalfAlt';
import { default as StarSmall } from './StarSmall';
import { default as Steam } from './Steam';
import { default as Table } from './Table';
import { default as Trophy } from './Trophy';
import { default as UserMinus } from './UserMinus';
import { default as UserPlus } from './UserPlus';
import { default as WarningCircle } from './WarningCircle';
import { default as WarningTriangle } from './WarningTriangle';

const icons = {
	Badge,
	Bolt,
	Checklist,
	Clock,
	Discord,
	Donation,
	Finish,
	Gamepad,
	Grid,
	Heart,
	History,
	Home,
	IDCard,
	Medal,
	Patreon,
	Percent,
	Puzzle,
	QuestionCircle,
	SquareMinus,
	SquarePlus,
	StarBlack,
	StarCheck,
	StarEmpty,
	StarHalf,
	StarHalfAlt,
	StarSmall,
	Steam,
	Table,
	Trophy,
	UserMinus,
	UserPlus,
	WarningCircle,
	WarningTriangle,
};

export type IconType = keyof typeof icons;

export default icons;
