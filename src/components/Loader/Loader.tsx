import React from 'react';
import { Flex, Spinner } from 'components';

export const Loader = () => {
	return (
		<Flex align justify boxSizing="border-box" padding={64}>
			<Spinner />
		</Flex>
	);
};
