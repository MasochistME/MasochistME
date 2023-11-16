import styled from 'styled-components';
import { getHumanReadableDate } from '@masochistme/utils';
import { Award } from '@masochistme/sdk/dist/v1/types';

import { Button, Size } from 'components';
import { AwardThumbnail } from 'containers/AwardThumbnail';
import { useMemberAward } from 'hooks';
import { ColorTokens, useTheme } from 'styles';

type Props = {
  award: Award;
  memberId: string;
};

export const ModalAwardChild = (props: Props) => {
  const { award, memberId } = props;
  const { colorTokens } = useTheme();

  const awardId = String(award._id);
  const { isUnlocked, timesUnlocked, allMemberAwards } = useMemberAward(
    awardId,
    memberId,
  );
  const lastUnlocked = getHumanReadableDate(allMemberAwards.pop()?.unlocked);
  const awardName = isUnlocked ? award?.name : '???';

  const onExpand = () => {
    alert('At some point I will code this button, but now is not that time.');
  };

  return (
    <StyledModalAwardChild colorTokens={colorTokens}>
      <AwardThumbnail
        award={award}
        isUnlocked={isUnlocked}
        hasTooltip={false}
        size={Size.BIG}
      />
      <StyledAwardDetails>
        <h3>{awardName}</h3>
        <div style={{ fontStyle: 'italic' }}>{award?.description}</div>
        <div style={{ fontWeight: 600 }}>Last unlocked: {lastUnlocked}</div>
        <div style={{ fontWeight: 600 }}>Owned: {timesUnlocked}</div>
      </StyledAwardDetails>
      <StyledAwardExpand>
        <Button icon="ChevronDown" size={Size.BIG} onClick={onExpand} />
      </StyledAwardExpand>
    </StyledModalAwardChild>
  );
};

const StyledModalAwardChild = styled.div<{ colorTokens: ColorTokens }>`
  display: flex;
  gap: var(--size-16);
  padding: var(--size-16) var(--size-8);
  &:not(:last-child) {
    border-bottom: var(--size-1) solid
      ${({ colorTokens }) => colorTokens['element-color--button-border']};
  }
`;
const StyledAwardDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  align-items: flex-start;
  gap: var(--size-4);

  h3 {
    margin: 0;
    font-size: var(--font-size-18);
  }
`;

const StyledAwardExpand = styled.div`
  display: flex;
  margin: 0 auto;
`;
