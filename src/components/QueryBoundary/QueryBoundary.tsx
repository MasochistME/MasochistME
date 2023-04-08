import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import styled from 'styled-components';
import Collapse from '@mui/material/Collapse';

import { Button } from 'components/Button';
import { Modal } from 'components/Modal';
import { AxiosError } from 'axios';
import { Size } from 'components/__utils';

type Props = {
	fallback?: React.ReactNode;
	errorFallback?: React.ReactElement;
	displayError?: boolean;
	children?: React.ReactNode;
};

export const QueryBoundary = (props: Props) => {
	const {
		fallback = null,
		errorFallback = null,
		displayError = false,
		children,
	} = props;
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const getErrorFallback = () => {
		if (errorFallback) return errorFallback;
		if (displayError && error)
			return (
				<ErrorModal
					error={error}
					showErrorModal={showErrorModal}
					setShowErrorModal={setShowErrorModal}
				/>
			);
		return <></>;
	};

	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					fallback={getErrorFallback()}
					onReset={reset}
					onError={(e: Error) => {
						setShowErrorModal(true);
						setError(e);
					}}>
					<Suspense fallback={fallback}>{children}</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};

type ErrorModalProps = {
	error: Error | AxiosError;
	showErrorModal: boolean;
	setShowErrorModal: (showErrorModal: boolean) => void;
};
const ErrorModal = (props: ErrorModalProps) => {
	const { error, showErrorModal, setShowErrorModal } = props;
	const [showCollapse, setShowCollapse] = useState(false);

	const changeDetailsVisibility = () => {
		setShowCollapse(!showCollapse);
	};

	return (
		<Modal isModalOpen={showErrorModal} setIsModalOpen={setShowErrorModal}>
			<StyledContent>
				<h2>Something broke :c</h2>
				<div>Simply reloading the page might help.</div>
				<div>
					<Button
						size={Size.SMALL}
						label="Show details"
						onClick={changeDetailsVisibility}
					/>
				</div>
				<Collapse
					unmountOnExit={true}
					in={showCollapse}
					style={{ width: '100%' }}>
					<ErrorCode>
						<code>{error.message}</code>
						<code>{error.stack}</code>
						{error.name === 'AxiosError' && getAxiosError(error as AxiosError)}
					</ErrorCode>
				</Collapse>
			</StyledContent>
		</Modal>
	);
};

const getAxiosError = (error: AxiosError) => {
	const { method, url, data } = error.config ?? {};
	const endpoint = url?.slice(url.indexOf('/api'));

	return (
		<code>
			<div>
				{method?.toUpperCase()} {endpoint}
			</div>
			<div>Request body: {data}</div>
		</code>
	);
};

const StyledContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--size-16);
	padding: var(--size-16);

	h2,
	p {
		margin: 0;
	}
`;

const ErrorCode = styled.pre`
	background-color: #333;
	color: white;
	padding: var(--size-8);
	margin: 0;
	code {
		font-size: var(--size-14);
		text-align: left;
	}
`;
