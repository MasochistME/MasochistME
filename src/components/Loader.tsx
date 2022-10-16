import React from 'react';

type Props = {
	isActive: boolean;
};

export const Loader = (props: Props): JSX.Element | null => {
	const { isActive } = props;
	return isActive ? (
		<div>
			<i className="fas fa-hourglass"></i>
		</div>
	) : null;
};
