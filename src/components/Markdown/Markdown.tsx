import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import { Flex } from 'components';

type Props = {
	children: string;
};
export const Markdown = (props: Props) => {
	const { children } = props;
	return (
		<StyledMarkdown column>
			<ReactMarkdown>{children}</ReactMarkdown>
		</StyledMarkdown>
	);
};

const StyledMarkdown = styled(Flex)`
	gap: 22.6px;
	& > * {
		margin: 0;
	}
`;
