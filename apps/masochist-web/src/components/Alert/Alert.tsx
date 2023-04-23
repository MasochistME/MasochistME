import React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

type Props = {
	message: string;
	severity: AlertColor;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export const Alert = (props: Props) => {
	const { message, severity, isOpen, setIsOpen } = props;

	const handleClose = (
		_event: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === 'clickaway') return;
		setIsOpen(false);
	};

	return (
		<Snackbar
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isOpen}
			autoHideDuration={4000}
			onClose={handleClose}>
			<FixedAlert
				onClose={handleClose}
				severity={severity}
				sx={{ width: '100%' }}>
				{message}
			</FixedAlert>
		</Snackbar>
	);
};

const FixedAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
