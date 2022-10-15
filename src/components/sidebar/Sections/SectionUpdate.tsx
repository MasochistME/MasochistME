import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ProgressBar } from 'shared/components';
import { SectionTitle, Section } from 'components/sidebar';

const StyledSection = styled(props => <Section {...props} />)`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default function SectionUpdate(): JSX.Element {
	const status = useSelector((state: any) => state.status);
	const nextUpdate = status?.lastUpdated
		? new Date(status.lastUpdated + 43200000).toLocaleString()
		: 'loading...';

	return (
		<StyledSection>
			{!status.percentage || status.percentage === 100 ? (
				<SectionTitle
					style={{
						height: '100%',
					}}>{`Next update: ${nextUpdate}`}</SectionTitle>
			) : (
				<ProgressBar
					percentage={status?.percentage ?? 100}
					style={{ height: '30px', width: '100%' }}
					invert
				/>
			)}
		</StyledSection>
	);
}
