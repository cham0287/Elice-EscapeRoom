import React from 'react';
import LevelImage from '../common/LevelImage';
import MannerImage from '../common/MannerImage';
import tw from 'tailwind-styled-components';

const UserScore = ({ userData }) => {
  const mannerScore = userData.mannerScore;
  const escapeScore = userData.escapeScore;
  const mannerProgressWith = 700 * (mannerScore / 100);
  const escapeProgressWith = 700 * (escapeScore / 100);

  return (
    <>
      <section>
        <h3>λ§€λμ μπ</h3>
        <Wrapper style={{ whiteSpace: 'nowrap' }}>
          <MannerProgress style={{ width: mannerProgressWith }}>
            <span>{mannerScore}μ </span>
            <MannerImage score={mannerScore} size={20} />
          </MannerProgress>
        </Wrapper>
        <div style={{ paddingLeft: mannerProgressWith - 15 }}>{mannerScore}μ </div>
      </section>

      <section>
        <h3>νμΆλ λ²¨π</h3>
        <Wrapper style={{ whiteSpace: 'nowrap' }}>
          <EscapeProgress style={{ width: escapeProgressWith }}>
            <span>{userData.tier}</span>
            <LevelImage score={escapeScore} size={20} />
          </EscapeProgress>
        </Wrapper>
        <div style={{ paddingLeft: escapeProgressWith - 15 }}>{escapeScore}μ </div>
      </section>
    </>
  );
};

export default UserScore;

const Wrapper = tw.div`
  w-[700px]
  bg-gray-200
  rounded-[20px]
`;

const MannerProgress = tw.div`
  bg-pink-400
  font-medium
  text-lg
  text-white
  text-center
  p-[3px]
  leading-none
  rounded-[20px]
  shadow-lg
  shadow-pink-500/50
`;

const EscapeProgress = tw.div`
  bg-blue-500
  font-medium
  text-lg
  text-white
  text-center
  p-[3px]
  leading-none
  rounded-[20px]
  shadow-lg
  shadow-blue-500/50
`;
