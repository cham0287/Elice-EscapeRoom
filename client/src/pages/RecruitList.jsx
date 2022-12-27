import React, { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import {
  showRecruitPostAtom,
  maxPageNumAtom,
  showUserProfileModalAtom,
  currentPageAtom,
  currentRegionAtom,
} from '../recoil/recruit-list/index';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { get } from '../utils/api';

import RecuitPostContainer from '../components/recruit/RecruitPostContainer';
import PostModal from '../components/recruit/PostModal';
import PaginationButton from '../components/recruit/PageinationButton';
import UserProfileModal from '../components/recruit/UserProfileModal';
import Navigators from '../components/common/Navigators';
import Background from '../components/common/Background';
import { ApiUrl } from '../constants/ApiUrl';

document.title = '방가방가 모집글 리스트';

const RecruitList = () => {
  const [showRecruitPost, setShowRecruitPost] = useRecoilState(showRecruitPostAtom);
  const [currentRegion, setCurrentRegion] = useRecoilState(currentRegionAtom);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
  const setMaxPageNum = useSetRecoilState(maxPageNumAtom);
  const showUserProfileModal = useRecoilValue(showUserProfileModalAtom);

  const [fetchedData, setFetchedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nowRecruiting, setNowRecruiting] = useState(false);
  const [slicedData, setSlicedData] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);

  const REGION_DATA = ['전체', '홍대', '강남', '건대'];

  useEffect(() => {
    if (currentRegion === '전체') {
      const fetchRecruitData = (async () => {
        const data = await get('/api/matching-posts');
        const asendedData = data.reverse();

        setFetchedData(asendedData);
      })();
    } else {
      const fetchRecruitData = (async () => {
        const data = await get('http://34.64.127.117' + ApiUrl.MATCHING_POSTS, currentRegion);
        const asendedData = data.reverse();

        setFetchedData(asendedData);
      })();
    }
  }, [currentRegion]);

  useEffect(() => {
    if (nowRecruiting) {
      const nowRecruitingData = fetchedData.filter((data) => {
        return data.matchStatus === 0;
      });

      setFilteredData(nowRecruitingData);
    } else {
      setFilteredData(fetchedData);
    }
  }, [fetchedData, nowRecruiting]);

  useEffect(() => {
    const dataLength = filteredData.length;
    let dataArray = [];

    for (let i = 0; i < dataLength; i += 6) {
      dataArray.push(filteredData.slice(i, i + 6));
    }

    setCurrentPage(0);
    setSlicedData(dataArray);
    setMaxPageNum(dataArray.length - 1);
  }, [filteredData]);

  useEffect(() => {
    if (slicedData.length > 0) {
      setCurrentPageData(slicedData[currentPage]);
    } else if (slicedData.length === 1) {
      setCurrentPageData(slicedData[0]);
    }
  }, [slicedData, currentPage]);

  return (
    <Background img={'bg1'}>
      <Navigators />
      <div className='w-screen'>
        <MainContainer>
          <div className='flex justify-end'>
            <ul className='flex flex-row justify-center mx-auto'>
              {REGION_DATA.map((data, index) => (
                <li key={index}>
                  <button className='purpleButton mx-1' onClick={() => setCurrentRegion(data)} title={data}>
                    {data}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex justify-end drop-shadow-xl gap-[50px] mb-3 mr-[10vw]'>
            <FilterContainer>
              <label className='flex mb-1 text-gray-100 justify-around'>
                <input
                  className='required:border-red-500'
                  onClick={() => {
                    setNowRecruiting(!nowRecruiting);
                  }}
                  type='checkbox'
                />
                모집중만 보기
              </label>
            </FilterContainer>
            <button
              onClick={() => setShowRecruitPost(true)}
              className='h-10 border-solid border-[1px] p-1.5 border-gray-500 bg-white'>
              글쓰기
            </button>
          </div>
          <ListItemContainer>
            {currentPageData.map((post, index) => (
              <RecuitPostContainer postData={post} key={index} />
            ))}
            {showUserProfileModal && <UserProfileModal />}
            {showRecruitPost && <PostModal />}
          </ListItemContainer>

          <PaginationButton />
        </MainContainer>
      </div>
    </Background>
  );
};

export default RecruitList;

const MainContainer = tw.div`
mt-10
relative
`;

const FilterContainer = tw.div`
  flex flex-col
  flex flex-col
`;

const ListItemContainer = tw.div`
  grid grid-cols-3 grid-rows-2 gap-y-6 w-[1000px] mx-auto justify-items-center relative
`;