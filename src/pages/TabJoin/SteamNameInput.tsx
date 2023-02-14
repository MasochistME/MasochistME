import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Input, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';
import { validateSteamName } from 'pages/TabJoin/utils';

type Props = {
	setSteamName: (steamName: string) => void;
	setIsServerError: (isServerError: boolean) => void;
};
export const SteamNameInput = (props: Props) => {
	const { setSteamName, setIsServerError } = props;
	const { colorTokens } = useTheme();

	const [inputValue, setInputValue] = useState<string>('');
	const { hasError, error } = validateSteamName(inputValue);

	const onGo = () => {
		setSteamName(inputValue);
		setIsServerError(false);
	};

	return (
		<StyledInputWrapper colorTokens={colorTokens}>
			<div className="steam-name__helper-url">
				https://steamcommunity.com/id/
			</div>
			<Input
				query={inputValue}
				setQuery={setInputValue}
				placeholder="username"
				error={hasError ? error : undefined}
				onEnterPress={onGo}
			/>
			<div className="steam-name__button-go">
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

	.steam-name__helper-url {
		display: flex;
		height: 42px;
		align-items: center;
		color: ${({ colorTokens }) => colorTokens['core-secondary-text']}88;
		font-size: 1.3em;
	}

	.steam-name__button-go {
		display: flex;
		height: 42px;
		align-items: center;
	}
`;
