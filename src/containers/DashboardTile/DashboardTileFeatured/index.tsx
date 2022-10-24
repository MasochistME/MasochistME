import { FeaturedType } from '@masochistme/sdk/dist/v1/types';

import { useFeatured } from 'sdk/featured';
import { Section, SectionProps } from 'containers';

import { FeaturedVideo } from './FeaturedVideo';
import { FeaturedNews } from './FeaturedNews';

// const FEATURED = ['https://www.youtube.com/embed/9Lz7VeVDmV4'];

export const DashboardTileFeatured = (
	props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
	// const [activeFeatured, setActiveFeatured] = useState();
	const { featuredData, isLoading, isFetched, isError } = useFeatured();

	const featuredContent = featuredData.map(f => {
		if (f.type === FeaturedType.NEWS) return <FeaturedNews featured={f} />;
		if (f.type === FeaturedType.VIDEO) return <FeaturedVideo featured={f} />;
		return null;
	});

	return <Section title="Featured" content={featuredContent} {...props} />;
};
