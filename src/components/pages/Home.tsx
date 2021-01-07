import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { colors, fonts } from 'shared/theme';
import { TBlog } from 'shared/types/blog';
import Spinner from 'shared/components/Spinner';

const Blog = styled.div`
  div {
    margin-bottom: 10px;
  }
`;

const Entry = styled.div`
  box-sizing: border-box;
  padding: 10px;
  background-color: ${colors.darkBlueTransparent};
  box-shadow: 0 0 20px ${colors.newDark};
  h1 {
    margin: 0;
    font-size: 1.8em;
    font-family: ${fonts.Cinzel};
  }
  h2 {
    margin: 0;
    font-size: 1.2em;
    text-align: right;
    font-family: ${fonts.Cinzel};
    border-bottom: 1px solid ${colors.newMediumGrey};
    margin-bottom: 10px;
  }
  p {
    font-size: 1em;
    padding: 0 1em;
  }
`;

export default function PageHome(): JSX.Element {
  const blog = useSelector((state: any) => state.blog || []);

  return (
    <div>
      <div className="wrapper-description fancy">
        <h3>A dedicated group for dedicated gamers</h3>
        <div className="page-description fancy">
          <p>
            Is being top 1% too casual for you? Then this is your home. This
            group&lsquo;s aim is to band together the most determined gamers out
            there that aim to do the impossible! The ones that forget to sleep,
            neglect their beloved ones, need a minute to adjust to sunlight,
            will only eat to survive.... OK, exaggerated, but you get the point.
          </p>
        </div>
      </div>

      <Blog>
        {blog?.length ? (
          blog.map((entry: TBlog, entryIndex: number) => (
            <Entry key={`entry-${entryIndex}`}>
              <h1>{entry.title}</h1>
              <h2>
                ~{entry.author}, {new Date(entry.date).toLocaleDateString()}
              </h2>
              <div dangerouslySetInnerHTML={{ __html: entry.content }}></div>
            </Entry>
          ))
        ) : (
          <Spinner />
        )}
      </Blog>
    </div>
  );
}
