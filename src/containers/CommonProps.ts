import React from 'react';

import { Size } from 'utils';

export type CommonProps = {
	size?: Size;
	title?: React.ReactNode;
	disabled?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	onClick?: () => void;
};
