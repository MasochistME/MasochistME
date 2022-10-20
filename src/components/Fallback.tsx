import React from 'react';
import { Flex, Spinner } from 'components';

export const Fallback = () => {
	return (
		<Flex align justify padding={16}>
			<Spinner />
		</Flex>
	);
};
