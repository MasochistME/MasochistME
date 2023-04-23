import React from 'react';
import { Flex, Spinner } from 'components';

type Props = { title?: React.ReactNode };
export const Loader = ({ title }: Props) => {
	return (
		<Flex column gap={16} align justify boxSizing="border-box" padding={64}>
			<Spinner />
			{title && <div>{title}</div>}
		</Flex>
	);
};
