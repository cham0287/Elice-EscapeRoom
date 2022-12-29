import React from 'react';
import tw from 'tailwind-styled-components';

const UserInfo = ({ userData }) => {
  const { gender, age, mbti, preferenceTheme, nonPreferenceTheme, preferenceLocation } = userData;
  const USER_INFO = [
    { name: '성별', value: gender },
    { name: '나이', value: age },
    { name: 'MBTI', value: mbti },
    { name: '선호 테마', value: preferenceTheme },
    { name: '비선호 테마', value: nonPreferenceTheme },
    { name: '선호 지역', value: preferenceLocation },
  ];

  return (
    <div className='w-[900px] bg-white bg-opacity-50 rounded-[15px] mx-auto flex justify-center items-center '>
      <Container>
        {USER_INFO.map((info) => (
          <Information key={info.name}>
            <Title>{info.name}</Title>
            <Body>{info.value}</Body>
          </Information>
        ))}
      </Container>
    </div>
  );
};

export default UserInfo;

const Container = tw.table`
  w-[700px]
  h-[300px]
`;

const Information = tw.tr`
  border-b-2
  border-b-slate-300
`;

const Title = tw.th`
  p-[10px]
  text-xl
`;

const Body = tw.td`
  p-[10px]
  text-xl
`;
