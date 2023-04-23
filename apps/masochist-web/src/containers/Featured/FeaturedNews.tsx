import React from 'react';
import { FeaturedNews as TFeaturedNews } from '@masochistme/sdk/dist/v1/types';

import { Markdown } from 'components';
import { useMixpanel } from 'hooks';

type Props = {
	featured: TFeaturedNews;
	isCompact?: boolean; // unused
};

const TRACK_LINK_CLASS = 'featured-link';

export const FeaturedNews = (props: Props) => {
	const { featured } = props;
	const { trackLink } = useMixpanel();

	trackLink(`.${TRACK_LINK_CLASS}`, `${TRACK_LINK_CLASS}.click`);

	if (!featured.description) return null;

	const markdown = featured.description.replace(
		/\\n/g,
		`
  `,
	);
	return <Markdown trackClass={TRACK_LINK_CLASS}>{markdown}</Markdown>;
};
