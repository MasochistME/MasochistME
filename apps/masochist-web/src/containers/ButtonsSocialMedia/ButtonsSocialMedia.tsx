import { Button, Flex, Size } from 'components';
import { Variant } from 'components/Button/types';
import { t } from 'i18n';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { media } from 'styles';
import { curatorURL } from 'utils';

type Props = {
  size?: Size;
  withJoinButton?: boolean;
};

export const ButtonsSocialMedia = (props: Props): JSX.Element => {
  const { size = Size.BIG, withJoinButton = false } = props;
  const navigate = useNavigate();

  const onButtonCuratorClick = () => {
    window.open(curatorURL, '_blank');
  };
  const onButtonPatreonClick = () => {
    window.open('https://www.patreon.com/pointonepercent', '_blank');
  };
  const onButtonDiscordClick = () => {
    window.open('https://discord.gg/NjAeT53kVb', '_blank');
  };
  const onJoinUsClick = () => {
    navigate('/join');
  };

  return (
    <StyledButtonsSocialMedia>
      {withJoinButton && (
        <Button
          size={Size.SMALL}
          label={t('button.social.join')}
          variant={Variant.PRIMARY}
          onClick={onJoinUsClick}
        />
      )}
      <Button
        size={size}
        icon="Steam"
        tooltip={t('button.social.steam')}
        onClick={onButtonCuratorClick}
      />
      <Button
        size={size}
        icon="Discord"
        tooltip={t('button.social.discord')}
        onClick={onButtonDiscordClick}
      />
      <Button
        size={size}
        icon="Patreon"
        tooltip={t('button.social.support')}
        onClick={onButtonPatreonClick}
      />
    </StyledButtonsSocialMedia>
  );
};

const StyledButtonsSocialMedia = styled(Flex)`
  @media (min-width: ${media.bigPhones}) {
    gap: var(--size-4);
  }
`;
