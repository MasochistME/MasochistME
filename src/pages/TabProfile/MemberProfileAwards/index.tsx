import React from 'react';
import styled from 'styled-components';

import { useAwards, useMemberAwards } from 'sdk';
import { Button, Flex } from 'components';
import { useNavigate } from 'react-router';
import { AwardThumbnail } from 'containers';

type Props = { memberId: string };

export const MemberProfileAwards = (props: Props) => {
	const { memberId } = props;
	const navigate = useNavigate();

	const awardCategories = useAwardCategoriesForMember(memberId);

	const jumpToAnchor = (e: any, id: string) => {
		e.preventDefault();
		e.stopPropagation();
		navigate(`#${id}`);
	};

	return (
		<StyledMemberProfileAwards>
			{awardCategories.map(category => (
				<Flex column>
					<CategoryTitle id={category.humanReadableId}>
						<Button
							icon="Link"
							onClick={e => jumpToAnchor(e, category.humanReadableId)}
						/>
						<h1>{category.name}</h1>
					</CategoryTitle>
					<Flex gap={16}>
						{category.awards?.map(award => (
							<AwardThumbnail award={award} isUnlocked={award.hasAward} />
						))}
					</Flex>
				</Flex>
			))}
		</StyledMemberProfileAwards>
	);
};

const useAwardCategoriesForMember = (memberId: string) => {
	const { awardsData } = useAwards({ sort: { category: 'desc' } });
	const { memberAwardsData = [] } = useMemberAwards(memberId);

	const awardCategories = awardsData.map(category => {
		const categoryAwards = category.awards.map(award => {
			const hasAward = memberAwardsData.some(
				memberAward => memberAward.awardId === String(award._id),
			);
			return {
				...award,
				hasAward,
			};
		});
		return {
			...category,
			awards: categoryAwards,
		};
	});
	return awardCategories;
};

const StyledMemberProfileAwards = styled(Flex)`
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	flex-wrap: wrap;
	gap: 16px;
`;

const CategoryTitle = styled(Flex)`
	align-items: center;
	gap: 4px;

	h1 {
		all: unset;
		font-family: var(--font-dosis);
		font-size: 2em;
	}
`;
