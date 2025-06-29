import { Flex } from 'components';
import { ButtonsSocialMedia, Logo } from 'containers';
import { t } from 'i18n';
import styled from 'styled-components';
import { ColorTokens, media, useTheme } from 'styles';

export const Header = (): JSX.Element => {
  const { colorTokens } = useTheme();
  return (
    <StyledHeader align colorTokens={colorTokens}>
      <Logo />
      <StyledHeaderTitle>
        <span className="title__desktop">{t('header.title_desktop')}</span>
        <span className="title__mobile">{t('header.title_mobile')}</span>
        <StyledHeaderSubTitle> - {t('header.subtitle')}</StyledHeaderSubTitle>
      </StyledHeaderTitle>
      <ButtonsSocialMedia withJoinButton />
    </StyledHeader>
  );
};

const StyledHeader = styled(Flex)<{ colorTokens: ColorTokens }>`
  min-width: 100%;
  max-width: 100%;
  height: var(--size-60);
  justify-content: space-between;
  background-color: ${({ colorTokens }) =>
    colorTokens['element-color--header-bg']};
  color: ${({ colorTokens }) => colorTokens['element-color--header-text']};
  font-family: var(--font-raleway);
  padding: var(--size-12) var(--size-32);
  @media (max-width: ${media.tablets}) {
    padding: var(--size-8) var(--size-12);
  }
`;

const StyledHeaderTitle = styled.h1`
  /* font-weight: 600; */
  font-size: var(--font-size-16);
  letter-spacing: var(--size-4);
  margin: 0 var(--size-10);
  text-align: center;
  text-transform: uppercase;

  & .title__mobile {
    @media (min-width: ${media.smallTablets}) {
      display: none;
    }
  }
  & .title__desktop {
    @media (max-width: ${media.smallTablets}) {
      display: none;
    }
  }

  @media (max-width: ${media.tablets}) {
    letter-spacing: 0em;
  }
`;

const StyledHeaderSubTitle = styled.span`
  @media (max-width: ${media.tablets}) {
    display: none;
  }
`;
