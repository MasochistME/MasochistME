import React from 'react';
import { Flex, Wrapper } from 'components';

export const NotFound = (): JSX.Element => {
	return (
		<Flex column>
			<Wrapper type="description">
				<div
					className="page-description"
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<img src="https://http.cat/404" alt="404" />
				</div>
			</Wrapper>
		</Flex>
	);
};
