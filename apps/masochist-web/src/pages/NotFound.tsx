import React from 'react';

import { Flex } from 'components';
import { SubPage } from 'containers';

export const NotFound = (): JSX.Element => {
	return (
		<SubPage>
			<Flex align justify width="100%">
				<img src="https://http.cat/404" alt="404" />
			</Flex>
		</SubPage>
	);
};
