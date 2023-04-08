import { IconType } from 'assets/icons';
import { Icon } from 'components/Icon';
import React from 'react';
import styled from 'styled-components';

import { media, useTheme, ColorTokens } from 'styles';

type Props<T extends string> = {
	query: T;
	setQuery: (query: T) => void;
	placeholder?: string;
	icon?: IconType;
};

export const Input = <T extends string>(props: Props<T>): JSX.Element => {
	const { colorTokens } = useTheme();
	const { icon, placeholder, query, setQuery } = props;

	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchQuery = event.target.value as T;
		setQuery(searchQuery);
	};

	return (
		<StyledInputWrapper colorTokens={colorTokens}>
			{icon && <Icon icon="Search" padding="0 12px 0 14px" />}
			<StyledInput
				type="text"
				placeholder={placeholder}
				onChange={onSearch}
				value={query}
				hasIcon={!!icon}
				colorTokens={colorTokens}
			/>
		</StyledInputWrapper>
	);
};

const StyledInputWrapper = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}cc;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border: 2px solid ${({ colorTokens }) => colorTokens['semantic-color--idle']};
	border-radius: 32px;
	overflow: hidden;
`;
const StyledInput = styled.input<{
	colorTokens: ColorTokens;
	hasIcon: boolean;
}>`
	flex: 1 1 auto;
	height: 44px;
	width: 300px;
	max-width: 300px;
	padding: 4px 12px;
	font-size: 1.2em;
	font-family: var(--font-raleway);
	background-color: transparent;
	border-top-right-radius: 32px;
	border-bottom-right-radius: 32px;
	border: none;
	border-left: ${({ hasIcon }) => (hasIcon ? '2px solid transparent' : 'none')};

	box-sizing: border-box;
	&:active,
	&:focus {
		border: none;
		border-left: ${({ colorTokens, hasIcon }) =>
			hasIcon ? `2px solid ${colorTokens['semantic-color--idle']}` : 'none'};
		color: ${({ colorTokens }) => colorTokens['core-primary-text']};
		outline: none;
	}
	&::placeholder {
		color: ${({ colorTokens }) => colorTokens['core-primary-text']}88;
	}
	@media (max-width: ${media.tablets}) {
		margin-bottom: 0;
	}
`;
