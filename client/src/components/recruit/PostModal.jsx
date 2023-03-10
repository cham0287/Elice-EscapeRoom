import React, { useState, useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';
import { showRecruitPostAtom, showRecruitModalPageAtom, recruitPostDataAtom } from '../../recoil/recruit-list/index';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import { get, post } from '../../utils/api.js';
import { ApiUrl } from '../../constants/ApiUrl';
import jwt_decode from 'jwt-decode';
import { getCookieValue } from '../../utils/cookie';

const FirstModal = () => {
  const setRecruitPostData = useSetRecoilState(recruitPostDataAtom);
  const setShowRecruitPost = useSetRecoilState(showRecruitPostAtom);
  const setShowRecruitModalPage = useSetRecoilState(showRecruitModalPageAtom);
  const [showDateAlert, setShowDateAlert] = useState(false);
  const [showTitleAlert, setShowTitleAlert] = useState(false);
  const [selectedDate, selectedTitle, selectedMemberNum] = [useRef(), useRef(), useRef()];

  const checkPreviousDate = () => {
    const parsedDate = (dateValue, iso) => {
      if (iso === true) {
        dateValue = dateValue.slice(0, 16);
      }
      return parseInt(dateValue.toString().replace(/[^0-9]/g, ''));
    };
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;

    const dateOffset = new Date(today.getTime() - offset).toISOString();
    const selectedDateValue = selectedDate.current.value;
    const isPrevDate = parsedDate(selectedDateValue) - parsedDate(dateOffset, true) < 0;

    if (isPrevDate || selectedDateValue == '') {
      setShowDateAlert(true);
    } else {
      setShowRecruitModalPage(2);
      setShowTitleAlert(false);
      setShowDateAlert(false);
    }
  };

  const checkInputIsEmpty = () => {
    const selectedTitleValue = selectedTitle.current.value;
    const selectedMemberNumValue = selectedMemberNum.current.value;

    if (!selectedTitleValue || !selectedMemberNumValue) setShowTitleAlert(true);
    else checkPreviousDate();
  };

  return (
    <div className=' mt-10 ml-[40px]'>
      <div className='flex'>
        <div className='flex flex-col mr-[20px]'>
          <span>??????</span>
          <input
            onChange={(e) =>
              setRecruitPostData((prevState) => {
                return {
                  ...prevState,
                  title: e.target.value,
                };
              })
            }
            ref={selectedTitle}
            placeholder='????????? ???????????????'
            className='w-[300px] h-[45px] p-3 border border-solid border-gray-400'
          />
          <p className={showTitleAlert || 'invisible'}>????????? ????????? ??????????????????!</p>
        </div>
        <div className='flex flex-col'>
          <span>??????</span>
          <input
            onChange={(e) =>
              setRecruitPostData((prevState) => {
                return {
                  ...prevState,
                  peopleNum: parseInt(e.target.value),
                };
              })
            }
            ref={selectedMemberNum}
            type='number'
            min={2}
            max={8}
            className='w-[60px] h-[45px] p-3 border border-solid border-gray-400'
            onKeyDown={(event) => {
              event.preventDefault();
            }}
          />
        </div>
      </div>
      <div className='flex mt-5'>
        <div className='flex flex-col'>
          <span>?????? ??????</span>
          <input
            ref={selectedDate}
            onChange={(e) =>
              setRecruitPostData((prevState) => {
                return {
                  ...prevState,
                  matchingTime: e.target.value,
                };
              })
            }
            type='datetime-local'
            className='w-[300px] h-[45px] p-3 border border-solid border-gray-400'
          />
        </div>
      </div>
      {showDateAlert && <div className='ml-1 mt-1'>????????? ???????????? ????????????, ?????? ????????? ?????????????????????!</div>}

      <div>
        <button
          className='w-[60px] h-[35px] right-[100px] bottom-6 bg-gray-400 drop-shadow-lg rounded-lg align-middle absolute '
          onClick={() => setShowRecruitPost(false)}>
          ??????
        </button>
        <button
          className='w-[60px] h-[35px] right-8 bottom-6 bg-sky-500/50 drop-shadow-lg rounded-lg align-middle absolute'
          onClick={() => {
            checkInputIsEmpty();
          }}>
          ??????
        </button>
      </div>
    </div>
  );
};

const SecondModal = () => {
  const setShowRecruitPost = useSetRecoilState(showRecruitPostAtom);
  const setShowRecruitModalPage = useSetRecoilState(showRecruitModalPageAtom);
  const [recruitPostData, setRecruitPostData] = useRecoilState(recruitPostDataAtom);
  const [showCafeSelection, setShowCafeSelection] = useState('disabled');
  const [showThemeSelection, setShowThemeSelection] = useState('disabled');
  const [currentRegion, setCurrentRegion] = useState('');
  const [currentCafeDataArray, setCurrentCafeDataArray] = useState([]);
  const [currentThemeDataArray, setCurrentThemeDataArray] = useState([]);
  const [currentThemeData, setCurrentThemeData] = useState({});
  const [submitStatus, setSubmitStatus] = useState(false);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);

  const REGION_DATA = ['??????', '??????', '??????'];

  const loginToken = getCookieValue('token');
  const userId = jwt_decode(loginToken).userId;

  useEffect(() => {
    const getCafeData = (async () => {
      try {
        const cafeData = await get(ApiUrl.MATCHING_POST_CAFE_INFO, recruitPostData.matchingLocation);

        setCurrentCafeDataArray(cafeData);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [currentRegion]);

  const getThemeData = async (cafeId) => {
    try {
      const themeData = await get(ApiUrl.MATCHING_POST_THEME_INFO, cafeId);

      setCurrentThemeDataArray(themeData);
    } catch (err) {
      alert(err.message);
    }
  };

  const calcDifficulty = (num) => {
    const difficultArray = ['?????? ??????', '??????', '??????', '?????????', '??????????????? ??????'];

    return difficultArray[parseInt(num / 2)];
  };

  const submitMatchingPost = async () => {
    const dateValue = recruitPostData.matchingTime;
    const parsedDate = parseInt(
      dateValue
        .toString()
        .slice(1)
        .replace(/[^0-9]/g, ''),
    );

    setRecruitPostData((prevState) => {
      return {
        ...prevState,

        userId: userId,
        matchingTime: parsedDate,
      };
    });
    await post('/api/matching-posts', recruitPostData);
  };

  return (
    <div className='flex'>
      <div className='mt-10 ml-[40px] mr-[30px]'>
        <p>??????</p>
        <ul className='flex justify-between'>
          {REGION_DATA.map((region, index) => {
            return (
              <li key={index}>
                <label>
                  <input
                    onClick={(e) => {
                      setRecruitPostData((prevState) => {
                        return {
                          ...prevState,
                          matchingLocation: e.target.value,
                        };
                      });

                      setShowCafeSelection('');
                      setCurrentRegion(e.target.value);
                      setSubmitStatus(false);
                    }}
                    type='radio'
                    value={region}
                    name='region'
                    className='mr-2'
                    defaultChecked={recruitPostData.matchingLocation === region}
                  />
                  {region}
                </label>
              </li>
            );
          })}
        </ul>
        <PostSelection>
          <span>?????? ?????????</span>
          <select
            className='w-[300px] h-[45px] p-2 border border-solid border-gray-400'
            onChange={(e) => {
              getThemeData(e.target.value);
              setShowThemeSelection('');
              setSubmitStatus(false);

              setRecruitPostData((prevState) => {
                return {
                  ...prevState,

                  cafeId: parseInt(e.target.value),
                };
              });
            }}
            disabled={showCafeSelection}
            name='filter'
            id=''>
            <option value=''>
              {showCafeSelection === '' ? '---?????? ????????? ???????????? ??????????????????!' : '---?????? ????????? ?????? ??????????????????.'}
            </option>
            {currentCafeDataArray.map((cafe, index) => (
              <option value={cafe.cafeId} key={index}>
                {cafe.cafeName}
              </option>
            ))}
          </select>
        </PostSelection>
        <PostSelection className='mt-4'>
          <span>?????? ?????????</span>
          <select
            onChange={(e) => {
              const themeId = parseInt(e.target.value) + 1;
              setCurrentThemeData(currentThemeDataArray[themeId]);
              setSubmitStatus(true);

              setRecruitPostData((prevState) => {
                return {
                  ...prevState,

                  themeName: e.target[themeId].text,
                };
              });
            }}
            className='w-[300px] h-[45px] p-2 border border-solid border-gray-400'
            disabled={showThemeSelection}
            name='filter'
            id=''>
            <option value=''>
              {showThemeSelection === ''
                ? '---?????? ????????? ????????? ???????????? ??????????????????!'
                : '---?????? ????????? ????????? ?????? ??????????????????.'}
            </option>
            {currentThemeDataArray.map((theme, index) => (
              <option title={theme.theme} value={index} key={index}>
                {theme.theme}
              </option>
            ))}
          </select>
        </PostSelection>
        <div>
          <button
            className='w-[60px] h-[35px] right-[168px] bottom-6 bg-gray-400 drop-shadow-lg rounded-lg align-middle absolute '
            onClick={() => {
              setShowRecruitModalPage(1);
              setShowRecruitPost(false);
              setRecruitPostData({
                title: '',
                peopleNum: 2,
                themeName: '',
                matchStatus: false,
                matchingTime: 0,
                matchingLocation: '',
                cafeId: 0,
                userId: 1,
              });
            }}>
            ??????
          </button>
          <button
            className='w-[60px] h-[35px] right-[100px] bottom-6 bg-gray-400/50 drop-shadow-lg rounded-lg align-middle absolute'
            onClick={() => {
              setShowRecruitModalPage(1);
              setRecruitPostData((prevState) => {
                return {
                  ...prevState,
                };
              });
            }}>
            ??????
          </button>
          <button
            className='w-[60px] h-[35px] right-8 bottom-6 bg-sky-500/50 drop-shadow-lg rounded-lg align-middle absolute'
            onClick={async () => {
              if (submitStatus) {
                setShowSubmitAlert(true);
                await submitMatchingPost();
                setShowRecruitPost(false);
                window.location.replace('/recruit-list');
              }
            }}>
            ??????
          </button>
        </div>
        {showSubmitAlert && <span className='absolute right-2'>???????????? ?????? ??? ??? ??? ???????????????!</span>}
      </div>
      <div className='mt-[126px]'>
        <div className='flex flex-col text-sm'>
          <span>??????</span>
          <span>?????????</span>
          <span>?????????</span>
          <span>?????? ??????</span>
          <span>???????????????</span>
        </div>
      </div>
      <div className='ml-3 mt-[126px]'>
        <div className='flex flex-col text-sm pl-3 border-l border-solid border-gray-500/20'>
          <span className='text-blue-500 font-semibold'>{currentThemeData.genre}</span>
          <p>
            <span className='text-blue-500 font-semibold'>{calcDifficulty(currentThemeData.difficulty)}</span>
          </p>
          <ul className='flex gap-2'>
            <li className='text-blue-500 font-semibold'>{currentThemeData.activity}</li>
          </ul>
          <ul className='flex gap-1'>
            <li className='text-blue-500 font-semibold'>{currentThemeData.recommendedNum}</li>
          </ul>
          <span className='text-blue-500 font-semibold'>{currentThemeData.time}??? ??????</span>
        </div>
      </div>
    </div>
  );
};

const PostModal = () => {
  const showRecruitModalPage = useRecoilValue(showRecruitModalPageAtom);

  return (
    <div className='rounded-xl absolute top-[30%] w-[600px] h-[350px] bg-slate-100 drop-shadow-lg'>
      <div className={showRecruitModalPage === 1 ? '' : 'hidden'}>
        <FirstModal />
      </div>
      <div className={showRecruitModalPage === 2 ? '' : 'hidden'}>
        <SecondModal />
      </div>
    </div>
  );
};

const PostSelection = tw.div`
  flex flex-col mt-5
`;

export default PostModal;
