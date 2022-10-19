import styled from 'styled-components';
import { Member } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { Size } from 'utils';
import { colors } from 'shared/theme';
import { Flex, Tooltip } from 'components';

type Props = {
	member?: Member;
	size?: Size;
	patronTier?: number | null;
	onClick?: () => void;
};

export const MemberAvatar = (props: Props) => {
	const {
		member = { name: 'UNKNOWN', avatar: logo },
		size = Size.MEDIUM,
		patronTier,
		onClick,
	} = props;

	// tier={Number(patron?.tier)}

	return (
		<Tooltip content={<Flex column>{member.name}</Flex>}>
			<StyledMemberAvatar
				onClick={onClick}
				size={size}
				patronTier={patronTier}
				src={member.avatar}
				alt="Member avatar"
			/>
		</Tooltip>
	);
};

const StyledMemberAvatar = styled.img.attrs(
	(props: { size: Size; patronTier?: number | null }) => {
		const { size, patronTier } = props;
		const style: React.CSSProperties = {
			minWidth: size,
			minHeight: size,
			maxWidth: size,
			maxHeight: size,
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
)<{ size: Size; patronTier?: number | null }>`
	box-sizing: border-box;
	border: 2px solid ${colors.black};
	border-radius: 8px;
	padding: 2px;
	cursor: help;
`;
