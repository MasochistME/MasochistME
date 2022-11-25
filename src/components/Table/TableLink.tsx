import styled from 'styled-components';
import { ColorTokens } from 'styles';

export const TableLink = styled.span<{ colorTokens: ColorTokens }>`
	font-weight: bold;
	cursor: pointer;
	&:hover {
		text-decoration: underline dotted;
		color: ${({ colorTokens }) => colorTokens['semantic-color--link-hover']};
	}
`;
