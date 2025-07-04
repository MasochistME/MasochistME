import { Featured, FeaturedType } from '@masochistme/sdk/dist/v1/types';
import { ErrorFallback, Flex, Loader, Pagination, Skeleton } from 'components';
import { Section, SectionProps } from 'containers';
import { FeaturedNews, FeaturedVideo } from 'containers/Featured';
import { t } from 'i18n';
import { useMemo } from 'react';
import styled from 'styled-components';

type Props = Omit<SectionProps, 'content' | 'title'> & {
  featuredData: Featured[];
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
  activeIndex: number;
  setActiveIndex: (activeIndex: number) => void;
};

export const DashboardTileFeatured = (props: Props): JSX.Element => {
  const {
    featuredData,
    isLoading,
    isFetched,
    isError,
    activeIndex,
    setActiveIndex,
  } = props;

  const featuredContent = useMemo(() => {
    const featured = featuredData?.[activeIndex];
    if (!featured || !isFetched || isError) return null;

    if (featured.type === FeaturedType.NEWS)
      return <FeaturedNews featured={featured} />;
    if (featured.type === FeaturedType.VIDEO)
      return <FeaturedVideo featured={featured} />;
  }, [featuredData, isFetched, isError, activeIndex]);

  return (
    <Section
      title={t('dashboard.featured.title')}
      content={
        <StyledContent column>
          {isLoading ? <Loader /> : featuredContent}
          <Pagination
            nrOfItems={featuredData.length}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </StyledContent>
      }
      {...props}
    />
  );
};

const StyledContent = styled(Flex)`
  gap: var(--size-12);
  justify-content: space-between;
  height: 100%;
`;

DashboardTileFeatured.Skeleton = (
  props: Omit<SectionProps, 'content' | 'title'>,
) => (
  <Section
    title="Featured"
    fullWidth
    content={
      <StyledContent column align>
        <Skeleton width="84rem" height="44rem" />
      </StyledContent>
    }
    {...props}
  />
);

DashboardTileFeatured.Error = (
  props: Omit<SectionProps, 'content' | 'title'>,
) => (
  <Section
    title="Featured"
    fullWidth
    content={
      <StyledContent column align>
        <ErrorFallback height="44rem" />
      </StyledContent>
    }
    {...props}
  />
);
