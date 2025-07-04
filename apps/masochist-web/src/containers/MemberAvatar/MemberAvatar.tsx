import { Member, PatronTier } from '@masochistme/sdk/dist/v1/types';
import { BrokenImage, Flex, Size, Skeleton, Tooltip } from 'components';
import { CommonProps } from 'containers';
import { t } from 'i18n';
import { useMemo } from 'react';
import styled from 'styled-components';
import { ColorTokens, useTheme } from 'styles';
import { getAvatarFromHash } from 'utils';

type Props = CommonProps & {
  member?: Partial<Member>;
  patronTier?: PatronTier | null;
};

export const MemberAvatar = (props: Props) => {
  const { colorTokens, LOGO_URL_STATIC } = useTheme();
  const {
    member = { name: t('loading') },
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
      return getAvatarFromHash(member.avatarHash, avatarSize);
  }, [member]);

  if (isLoading) return <Skeleton size={size} />;
  return (
    <Tooltip content={title ?? <Flex column>{member.name}</Flex>}>
      <StyledMemberAvatar
        onClick={onClick}
        size={size}
        patronTier={patronTier}
        isEmpty={!avatarUrl}
        colorTokens={colorTokens}>
        {(isError || !avatarUrl) && (
          <BrokenImage size={size} title={t('error.could_not_load_avatar')} />
        )}
        {!isError && avatarUrl && (
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
    props: Pick<Props, 'size' | 'patronTier' | 'onClick'> & {
      isEmpty: boolean;
      colorTokens: ColorTokens;
    },
  ) => {
    const { size, patronTier, colorTokens, onClick } = props;
    const style: React.CSSProperties = {
      minWidth: `${size}rem`,
      minHeight: `${size}rem`,
      maxWidth: `${size}rem`,
      maxHeight: `${size}rem`,
      cursor: onClick ? 'pointer' : 'help',
    };
    if (patronTier === PatronTier.TIER1) {
      style.border = `var(--size-5) solid ${colorTokens['semantic-color--tier-1']}`;
    }
    if (patronTier === PatronTier.TIER2) {
      style.border = `var(--size-5) solid ${colorTokens['semantic-color--tier-2']}`;
    }
    if (patronTier === PatronTier.TIER3) {
      style.border = `var(--size-5) solid ${colorTokens['semantic-color--tier-3']}`;
    }
    if (patronTier === PatronTier.TIER4) {
      style.border = `var(--size-5) solid ${colorTokens['semantic-color--tier-4']}`;
    }
    return { style };
  },
)<
  Pick<Props, 'patronTier' | 'onClick'> & {
    size: Size;
    isEmpty: boolean;
    colorTokens: ColorTokens;
  }
>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  background-color: ${({ isEmpty, colorTokens }) =>
    isEmpty ? colorTokens['core-tertiary-bg'] : 'transparent'};
  padding: ${({ size }) =>
    size === Size.BIG || size === Size.LARGE ? 0.1 : 0}rem;
  border-radius: ${({ size }) =>
    size === Size.SMALL || size === Size.TINY
      ? `var(--border-radius-4)`
      : `var(--border-radius-8)`};
  border: ${({ size, colorTokens }) =>
    `${size === Size.SMALL || size === Size.TINY ? 0.2 : 0.3}rem 
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
