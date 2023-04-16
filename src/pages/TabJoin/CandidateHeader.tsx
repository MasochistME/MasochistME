import styled from 'styled-components';
import { Candidate } from '@masochistme/sdk/dist/v1/types';

import { Flex, Icon, Size } from 'components';
import { ColorTokens, media, useTheme } from 'styles';
import {
	getAvatarFromHash,
	getUserSteamUrl,
	getHumanReadableDate,
} from 'utils';

type Props = { candidate: Candidate };

export const CandidateHeader = ({ candidate }: Props) => {
	const { colorTokens, LOGO_URL_STATIC } = useTheme();
	const steamUrl = getUserSteamUrl(candidate.steamId);

	return (
		<StyledCandidateHeader row align>
			<Flex align gap={16}>
				<StyledCandidateAvatar
					src={
						getAvatarFromHash(candidate.avatarHash, 'full') ?? LOGO_URL_STATIC
					}
					size={Size.BIG}
					colorTokens={colorTokens}
					alt="Member avatar"
					loading="lazy"
				/>
				<a href={steamUrl} target="_blank" rel="noopener noreferrer">
					<StyledCandidateUsername>
						<Icon icon="Steam" marginRight="10px" />
						{candidate.name}
					</StyledCandidateUsername>
				</a>
			</Flex>
			<Flex align gap={8}>
				<Flex column alignItems="flex-end">
					<span>Last updated:</span>
					<span style={{ fontStyle: 'italic' }}>
						{getHumanReadableDate(candidate.updated)}
					</span>
				</Flex>
				<Icon
					icon="CircleInfo"
					hoverText="This profile info will be stored for a week. You will be able to update again after that time passes."
				/>
			</Flex>
		</StyledCandidateHeader>
	);
};

const StyledCandidateHeader = styled(Flex)`
	max-width: 100%;
	gap: 8px;
	justify-content: space-between;
	align-items: flex-start;
`;

const StyledCandidateAvatar = styled.img<{
	size: Size;
	colorTokens: ColorTokens;
}>`
	object-fit: contain;
	max-width: ${({ size }) => size}rem;
	max-height: ${({ size }) => size}rem;
	min-width: ${({ size }) => size}rem;
	min-height: ${({ size }) => size}rem;
	border: ${({ size, colorTokens }) =>
		`${size === Size.SMALL || size === Size.TINY ? 0.2 : 0.3}rem 
		solid ${colorTokens['core-primary-bg']}`};
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledCandidateUsername = styled.h2`
	display: flex;
	align-items: center;
	margin: 0;
	max-width: 600px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 24px;
`;
