import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Input, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';
import { validateSteamUrl } from 'pages/TabJoin/utils';
import { useSearchParams } from 'react-router-dom';

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

	.steam-url__button-go {
		display: flex;
		height: 42px;
		align-items: center;
	}
`;
