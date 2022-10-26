import React from 'react';

import { Size } from 'components';

export type CommonProps = {
	size?: Size;
	title?: React.ReactNode;
	isDisabled?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	onClick?: () => void;
};
