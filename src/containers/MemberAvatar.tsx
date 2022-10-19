import styled from 'styled-components';
import { Member } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { Size } from 'utils';
import { colors } from 'shared/theme';
import { Flex, Tooltip } from 'components';

type Props = {
	member?: Member;
	size?: Size;
	onClick?: () => void;
};

export const MemberAvatar = (props: Props) => {
	const {
		member = { name: 'UNKNOWN', avatar: logo },
		size = Size.MEDIUM,
		onClick,
	} = props;

	return (
		<Tooltip content={<Flex column>{member.name}</Flex>}>
			<StyledMemberAvatar
				onClick={onClick}
				size={size}
				src={member.avatar}
				alt="Member avatar"
			/>
		</Tooltip>
	);
};

const StyledMemberAvatar = styled.img.attrs((props: { size: Size }) => {
	const { size } = props;
	const style: React.CSSProperties = {
		minWidth: size,
		minHeight: size,
		maxWidth: size,
		maxHeight: size,
	};
	return { style };
})<{ size: Size }>`
	box-sizing: border-box;
	border: 2px solid ${colors.black};
	cursor: help;
`;
