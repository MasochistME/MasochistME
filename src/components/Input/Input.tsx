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
			{icon && (
				<Icon icon="Search" padding="0 var(--size-12) 0 var(--size-14)" />
			)}
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
	border: var(--size-2) solid
		${({ colorTokens }) => colorTokens['semantic-color--idle']};
	border-radius: var(--size-32);
	overflow: hidden;
`;
const StyledInput = styled.input<{
	colorTokens: ColorTokens;
	hasIcon: boolean;
}>`
	flex: 1 1 auto;
	height: 4var (--size-4);
	width: 30rem;
	max-width: 30rem;
	padding: var(--size-4) var(--size-12);
	font-size: var(--size-12);
	font-family: var(--font-raleway);
	background-color: transparent;
	border-top-right-radius: var(--size-32);
	border-bottom-right-radius: var(--size-32);
	border: none;
	border-left: ${({ hasIcon }) =>
		hasIcon ? 'var(--size-2) solid transparent' : 'none'};

	box-sizing: border-box;
	&:active,
	&:focus {
		border: none;
		border-left: ${({ colorTokens, hasIcon }) =>
			hasIcon
				? `var(--size-2) solid ${colorTokens['semantic-color--idle']}`
				: 'none'};
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
