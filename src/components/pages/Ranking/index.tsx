import React from 'react';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import SearchBar from '../../../shared/components/SearchBar';
import Member from './Member';

export default function PageRanking(): JSX.Element {
  const searchMember = useSelector((state: any) => state.searchMember);
  const members = useSelector((state: any) => state.members);
  const rating = useSelector((state: any) => state.rating);
  const games = useSelector((state: any) => state.games);
  const patrons = useSelector((state: any) => state.patrons);
  const badges = useSelector((state: any) => state.badges);

  const ranking = orderBy(
    members.filter((member: any) => member.member),
    [member => (member.points ? member.points : 0)],
    ['desc'],
  ); //change names here

  const createRankingList = () => {
    if (ranking.length <= 0) {
      return;
    }
    return ranking.map((member: any, memberIndex: number) =>
      member.name.toLowerCase().indexOf(searchMember.toLowerCase()) !== -1 ? (
        <Member
          member={member}
          index={memberIndex}
          rating={rating}
          games={games}
          badges={badges}
          patron={patrons.find((tier: any) =>
            tier.list.find((p: any) => p.steamid === member.id)
              ? { tier: tier.tier, description: tier.description }
              : false,
          )}
          key={`member-${member.id}`}
        />
      ) : null,
    );
  };

  return (
    <div className="flex-column">
      <div className="wrapper-description">
        <div className="page-description">
          <p>
            Ranking system utilizes the games&lsquo; score system. Depending on
            the game&lsquo;s individual difficulty level, it is given one of{' '}
            {rating.length} possible marks:
          </p>
          <ul>
            {rating.map((r: any, rIndex: number) => (
              <li key={`r-${rIndex}`}>
                <i className={r.icon} /> - worth {r.score} pts - {r.description}{' '}
              </li>
            ))}
          </ul>
          <p>
            Completing a game might mean earning its most demanding achievement,
            or getting the in-game 100%; but for the sake of simplicity the
            ranking system present here assumes that completing a game means
            earning 100% of its Steam achievements. You are awarded points
            depending on the completed game's difficulty level, which are later
            summarized and used to determine your placement on the ranking
            ladder.
          </p>
        </div>
        <SearchBar />
      </div>
      <div className="wrapper-ranking">
        <ul className="ranking-list">
          {ranking.length > 0 ? (
            createRankingList()
          ) : (
            <div className="flex-column">
              <i className="fas fa-spinner"></i>
              <span style={{ fontSize: '0.9em', marginTop: '10px' }}>
                If you see no ranking here, reload the website.
              </span>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
