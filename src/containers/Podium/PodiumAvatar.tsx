import { useMemo } from 'react';
import styled from 'styled-components';
import { Member } from '@masochistme/sdk/dist/v1/types';

import { Size } from 'components';
import { useTheme, ColorTokens } from 'styles';
import { CommonProps } from 'containers';
import { BrokenImage, Flex, Skeleton, Tooltip } from 'components';
import { usePodiumColor } from './hooks';

type Props = CommonProps & {
	member?: Partial<Member>;
	place: 1 | 2 | 3;
};

export const PodiumAvatar = (props: Props) => {
	const { colorTokens, LOGO_URL_STATIC } = useTheme();
	const {
		member = { name: 'Loading...' },
		place,
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

	const podiumColor = usePodiumColor(place) ?? 'common-color--shadow';

	return (
		<Tooltip content={title ?? <Flex column>{member.name}</Flex>}>
			<StyledMemberAvatar
				onClick={onClick}
				size={size}
				place={place}
				podiumColor={podiumColor}
				colorTokens={colorTokens}
				isEmpty={!avatarUrl}>
				{isLoading && <Skeleton size={size} />}
				{!isLoading && (isError || !avatarUrl) && (
					<BrokenImage size={size} title="Could not load the avatar." />
				)}
				{!isLoading && !isError && avatarUrl && (
					<img
						src={avatarUrl ?? LOGO_URL_STATIC}
						alt="Member avatar"
						loading="lazy"
					/>
				)}
			</StyledMemberAvatar>
		</Tooltip>
	);
};

const StyledMemberAvatar = styled.div.attrs(
	(
		props: Pick<Props, 'size' | 'onClick'> & {
			isEmpty: boolean;
			podiumColor: string;
			colorTokens: ColorTokens;
		},
	) => {
		const { size, podiumColor, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: size,
			minHeight: size,
			maxWidth: size,
			maxHeight: size,
			cursor: onClick ? 'pointer' : 'help',
		};
		style.border = `5px solid ${podiumColor}`;
		return { style };
	},
)<
	Pick<Props, 'size' | 'place' | 'onClick'> & {
		isEmpty: boolean;
		podiumColor: string;
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
