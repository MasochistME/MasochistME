import { Game, Tier } from '@masochistme/sdk/dist/v1/types';
import { Icon, IconType, Spinner } from 'components';
import { Section, SectionProps } from 'containers';
import { t } from 'i18n';
import { useCuratedGames, useCuratorMembers, useTiers } from 'sdk';

export const DashboardTileTrivia = (
  props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
  const { tiersData, isLoading: isTiersLoading } = useTiers();
  const { membersData, isLoading: isMembersLoading } = useCuratorMembers();
  const { gamesData: games } = useCuratedGames();

  const isLoading = isMembersLoading && isTiersLoading;

  const mapCurated = () => {
    if (!games || !tiersData) return [];

    return tiersData.map((tier: Tier) => (
      <li
        style={{ marginLeft: '3rem' }}
        key={`tier-${tier.score}-${String(tier._id)}`}>
        <Icon icon={tier.icon as IconType} />
        <span>{` : ${
          games.filter((game: Game) => game.tier === tier.id).length
        }`}</span>
      </li>
    ));
  };

  return (
    <Section
      title={t('dashboard.trivia.title')}
      content={
        <>
          {isLoading && <Spinner />}
          {!isLoading && (
            <>
              <p>
                {t('dashboard.trivia.users_total')}:{' '}
                <span>{membersData.length}</span>
              </p>
              <p>{t('dashboard.trivia.curated_games')}:</p>
              <ul>
                <li style={{ marginLeft: '3rem' }}>
                  {t('dashboard.trivia.total')}: <span>{games.length}</span>
                </li>
                <ul>{mapCurated()}</ul>
              </ul>
            </>
          )}
        </>
      }
      {...props}
    />
  );
};
