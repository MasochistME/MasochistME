import { Button, Input, Size } from 'components';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { ColorTokens, media, useTheme } from 'styles';
import { validateSteamUrl } from './utils';

type Props = {
  setSteamUrl: (steamUrl: string) => void;
};
export const SteamNameInput = (props: Props) => {
  const { setSteamUrl } = props;
  const { colorTokens } = useTheme();

  const [searchParams] = useSearchParams();
  const route = searchParams.get('url');
  const [inputUrl, setInputUrl] = useState<string>(route ?? '');

  const { hasError, error } = validateSteamUrl(inputUrl);

  const onGo = () => {
    setSteamUrl(inputUrl);
    if (route) setInputUrl(decodeURIComponent(route));
  };

  useEffect(() => {
    if (route) onGo();
  }, [route]);

  return (
    <StyledInputWrapper colorTokens={colorTokens}>
      <Input
        query={inputUrl}
        setQuery={setInputUrl}
        placeholder="Steam profile URL"
        error={hasError ? error : undefined}
        onEnterPress={onGo}
        name="candidate_input"
        isFullWidth
      />
      <div className="steam-url__button-go">
        <Button
          onClick={onGo}
          icon="Bolt"
          label="GO"
          disabled={hasError || !inputUrl?.length}
          size={Size.BIG}
        />
      </div>
    </StyledInputWrapper>
  );
};

const StyledInputWrapper = styled.div<{ colorTokens: ColorTokens }>`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
  padding: 16px 32px;
  background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
  border-radius: 64px;
  width: 100%;

  @media (max-width: ${media.tablets}) {
    /* flex-wrap: wrap; */
    padding: var(--size-8) var(--size-12);
  }

  .steam-url__button-go {
    display: flex;
    height: 42px;
    align-items: center;
  }
`;
