import { useMemo } from 'react';
import styled from 'styled-components';
import { Member, PatronTier } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { Size } from 'utils';
import { colors } from 'shared/theme';
import { BrokenImage, Flex, Skeleton, Tooltip } from 'components';

type Props = {
	member?: Partial<Member>;
	patronTier?: PatronTier | null;
	size?: Size;
	title?: React.ReactNode;
	isLoading?: boolean;
	isError?: boolean;
	onClick?: () => void;
};

export const MemberAvatar = (props: Props) => {
	const {
		member = { name: 'Loading...' },
		patronTier,
		size = Size.MEDIUM,
		title,
		isLoading,
		isError,
		onClick,
	} = props;

	const avatarSize = useMemo(() => {
		if (size === Size.BIG || size === Size.LARGE) return '_full';
		if (size === Size.MEDIUM) return '_medium';
		return '';
	}, [size]);
	const avatarUrl = `https://avatars.akamai.steamstatic.com/${member.avatarHash}${avatarSize}.jpg`;

	return (
		<Tooltip content={title ?? <Flex column>{member.name}</Flex>}>
			<StyledMemberAvatar
				onClick={onClick}
				size={size}
				patronTier={patronTier}
				isEmpty={!member.avatarHash}>
				{isLoading && <Skeleton size={size} />}
				{isError && (
					<BrokenImage size={size} title="Could not load the avatar." />
				)}
				{!isLoading && !isError && (
					<img src={avatarUrl ?? logo} alt="Member avatar" />
				)}
			</StyledMemberAvatar>
		</Tooltip>
	);
};

const StyledMemberAvatar = styled.div.attrs(
	(
		props: Pick<Props, 'size' | 'patronTier' | 'onClick'> & {
			isEmpty: boolean;
		},
	) => {
		const { size, patronTier, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: size,
			minHeight: size,
			maxWidth: size,
			maxHeight: size,
			cursor: onClick ? 'pointer' : 'help',
		};
		if (patronTier === PatronTier.TIER1) {
			style.border = `5px solid ${colors.tier1}`;
		}
		if (patronTier === PatronTier.TIER2) {
			style.border = `5px solid ${colors.tier2}`;
		}
		if (patronTier === PatronTier.TIER3) {
			style.border = `5px solid ${colors.tier3}`;
		}
		if (patronTier === PatronTier.TIER4) {
			style.border = `5px solid ${colors.tier4}`;
		}
		return { style };
	},
)<
	Pick<Props, 'size' | 'patronTier' | 'onClick'> & {
		isEmpty: boolean;
	}
>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: 2px;
	overflow: hidden;
	background-color: ${({ isEmpty }) =>
		isEmpty ? colors.black : 'transparent'};
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? 4 : 8}px;
	border: ${({ size }) => (size === Size.SMALL || size === Size.TINY ? 2 : 3)}px
		solid ${colors.newDark};

	& > * {
		width: 100%;
		height: 100%;
		opacity: ${({ size }) =>
			size === Size.SMALL || size === Size.TINY ? '0.85' : '1'};
		&:hover {
			opacity: 1;
		}
	}
`;
