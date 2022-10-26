import { useMemo } from 'react';
import styled from 'styled-components';
import { Member, PatronTier } from '@masochistme/sdk/dist/v1/types';

import { Size } from 'utils';
import { colors } from 'shared/theme';
import { CommonProps } from 'containers';
import { BrokenImage, Flex, Skeleton, Tooltip } from 'components';
import { useTheme, ColorTokens } from 'styles';

type Props = CommonProps & {
	member?: Partial<Member>;
	patronTier?: PatronTier | null;
};

export const MemberAvatar = (props: Props) => {
	const { colorTokens, LOGO_URL } = useTheme();
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

	const avatarUrl = useMemo(() => {
		if (member.avatarHash)
			return `https://avatars.akamai.steamstatic.com/${member.avatarHash}${avatarSize}.jpg`;
		if (member.avatar) return member.avatar;
		return null;
	}, [member]);

	return (
		<Tooltip content={title ?? <Flex column>{member.name}</Flex>}>
			<StyledMemberAvatar
				onClick={onClick}
				size={size}
				patronTier={patronTier}
				isEmpty={!avatarUrl}
				colorTokens={colorTokens}>
				{isLoading && <Skeleton size={size} />}
				{!isLoading && (isError || !avatarUrl) && (
					<BrokenImage size={size} title="Could not load the avatar." />
				)}
				{!isLoading && !isError && avatarUrl && (
					<img src={avatarUrl ?? LOGO_URL} alt="Member avatar" loading="lazy" />
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
		colorTokens: ColorTokens;
	}
>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: 2px;
	overflow: hidden;
	background-color: ${({ isEmpty, colorTokens }) =>
		isEmpty ? colorTokens['core-tertiary-bg'] : 'transparent'};
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? 4 : 8}px;
	border: ${({ size, colorTokens }) =>
		`${size === Size.SMALL || size === Size.TINY ? 2 : 3}px
		solid ${colorTokens['core-primary-bg']}`};

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
