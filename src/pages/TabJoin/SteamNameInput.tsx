import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Input, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';
import { validateSteamUrl } from 'pages/TabJoin/utils';

type Props = {
	setSteamUrl: (steamUrl: string) => void;
	setIsServerError: (isServerError: boolean) => void;
};
export const SteamNameInput = (props: Props) => {
	const { setSteamUrl, setIsServerError } = props;
	const { colorTokens } = useTheme();

	const [inputValue, setInputValue] = useState<string>('');
	const { hasError, error } = validateSteamUrl(inputValue);

	const onGo = () => {
		setSteamUrl(inputValue);
		setIsServerError(false);
	};

	return (
		<StyledInputWrapper colorTokens={colorTokens}>
			<Input
				query={inputValue}
				setQuery={setInputValue}
				placeholder="Steam profile URL"
				error={hasError ? error : undefined}
				onEnterPress={onGo}
				isFullWidth
			/>
			<div className="steam-url__button-go">
				<Button
					onClick={onGo}
					icon="Bolt"
					label="GO"
					disabled={hasError || !inputValue?.length}
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
	flex-wrap: wrap;
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
