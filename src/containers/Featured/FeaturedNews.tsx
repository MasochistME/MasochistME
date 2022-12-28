import React from 'react';
import { FeaturedNews as TFeaturedNews } from '@masochistme/sdk/dist/v1/types';

import { Markdown } from 'components';

type Props = { featured: TFeaturedNews; isCompact?: boolean };

export const FeaturedNews = (props: Props) => {
	const { featured, isCompact = false } = props;

	if (!featured.description) return null;

	const markdown = featured.description.replace(
		/\\n/g,
		`
  `,
	);
	return <Markdown>{markdown}</Markdown>;
};
