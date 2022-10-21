import styled from 'styled-components';
import { Member } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { Size } from 'utils';
import { colors } from 'shared/theme';
import { Flex, Skeleton, Tooltip } from 'components';

type Props = {
	member?: Member;
	patronTier?: number | null;
	size?: Size;
	title?: React.ReactNode;
	isLoading?: boolean;
	onClick?: () => void;
};

export const MemberAvatar = (props: Props) => {
	const {
		member = { name: 'Loading...', avatar: logo },
		patronTier,
		size = Size.MEDIUM,
		title,
		isLoading,
		onClick,
	} = props;

	// tier={Number(patron?.tier)}

	return (
		<Tooltip content={title ?? <Flex column>{member.name}</Flex>}>
			<StyledMemberAvatar
				onClick={onClick}
				size={size}
				patronTier={patronTier}
				isEmpty={!member.avatar}>
				{isLoading ? (
					<Skeleton size={size} />
				) : (
					<img src={member.avatar ?? logo} alt="Member avatar" />
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
		if (patronTier === 1) {
			style.border = `5px solid ${colors.tier1}`;
		}
		if (patronTier === 2) {
			style.border = `5px solid ${colors.tier2}`;
		}
		if (patronTier === 3) {
			style.border = `5px solid ${colors.tier3}`;
		}
		if (patronTier === 4) {
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
	background-color: ${({ isEmpty }) =>
		isEmpty ? colors.black : 'transparent'};
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? 4 : 8}px;
	border: ${({ size }) => (size === Size.SMALL || size === Size.TINY ? 2 : 3)}px
		solid ${colors.newDark};

	img {
		width: 100%;
		height: 100%;
		opacity: ${({ size }) =>
			size === Size.SMALL || size === Size.TINY ? '0.85' : '1'};
		&:hover {
			opacity: 1;
		}
	}
`;
