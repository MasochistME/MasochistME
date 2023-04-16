import React from 'react';
import styled from 'styled-components';

import { IconType } from 'assets/icons';
import { Icon } from 'components/Icon';
import { media, useTheme, ColorTokens } from 'styles';

type Props<T extends string> = {
	query: T;
	setQuery: (query: T) => void;
	placeholder?: string;
	icon?: IconType;
	error?: string;
	isFullWidth?: boolean;
	name?: string;
	onEnterPress?: () => void;
};

export const Input = <T extends string>(props: Props<T>): JSX.Element => {
	const { colorTokens } = useTheme();
	const {
		icon,
		placeholder,
		error,
		name,
		isFullWidth = false,
		query,
		setQuery,
		onEnterPress,
	} = props;

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (onEnterPress && event.key === 'Enter') onEnterPress();
	};
	const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const searchQuery = event.target.value as T;
		setQuery(searchQuery);
	};

	return (
		<StyledInputWrapperExternal isFullWidth={isFullWidth}>
			<StyledInputWrapperInternal colorTokens={colorTokens}>
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
					onKeyDown={onKeyDown}
					isError={!!error}
					{...(name ? { name } : {})}
				/>
			</StyledInputWrapperInternal>
			{!!error && (
				<StyledInputError colorTokens={colorTokens}>{error}</StyledInputError>
			)}
		</StyledInputWrapperExternal>
	);
};

const StyledInputWrapperExternal = styled.div<{ isFullWidth: boolean }>`
	display: flex;
	flex-direction: column;
	width: ${({ isFullWidth }) => (isFullWidth ? '100%' : '300px')};
	max-width: 100%;
`;
const StyledInputWrapperInternal = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}cc;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border: var(--size-2) solid
		${({ colorTokens }) => colorTokens['semantic-color--idle']};
	border-radius: var(--border-radius-32);
	overflow: hidden;
`;

const StyledInputError = styled.span<{
	colorTokens: ColorTokens;
}>`
	font-size: 0.8em;
	text-align: left;
	color: ${({ colorTokens }) => colorTokens['semantic-color--error-strong']};
`;

const StyledInput = styled.input<{
	colorTokens: ColorTokens;
	isError: boolean;
	hasIcon: boolean;
}>`
	flex: 1 1 auto;
	height: 3.5rem;
	width: 100%;
	max-width: 100%;
	padding: var(--size-4) var(--size-12);
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-size: var(--font-size-16);
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
		outline: none;
	}
	&::placeholder {
		color: ${({ colorTokens }) => colorTokens['core-primary-text']}88;
	}
	@media (max-width: ${media.tablets}) {
		margin-bottom: 0;
	}
`;
