import { useDispatch, useSelector } from 'react-redux';

import { selectUserId } from '../../../store/apiSlice';
import { useGetPersonalResultsQuery, usePrefetch } from '../../../store/api';

import { BoxResult, LoaderIcon, PersonalInfos } from '../../../conponents';
import { useEffect } from 'react';

function DiscResults({ currentPage, postsPerPage, setTotalResult }) {
    const IdUser = useSelector(selectUserId);
    console.log(IdUser);
    const prefetchGetPersonalResults = usePrefetch('getPersonalResults', {
        ifOlderThan: 1,
    });
    const { data, isLoading } = useGetPersonalResultsQuery({
        id: IdUser,
        pageNum: currentPage,
        pageSize: postsPerPage,
        questionBankType: 1,
    });

    useEffect(() => {
        if (data?.status === 1) {
            setTotalResult(data?.data.Total);
        }
    }, [data?.data.Total]);
    useEffect(() => {
        prefetchGetPersonalResults({ id: IdUser, pageNum: currentPage, pageSize: postsPerPage, questionBankType: 1 });
    }, []);

    if (isLoading) {
        return <LoaderIcon title={'Đang tải dữ liệu'} center sizeBig />;
    }

    return (
        <>
            {data?.data?.Result.map((item, index) => {
                const dataRender = {
                    id: item.PersonalResultID,
                    nameGroup: item.GroupName,
                    time: item.CreatedDate,
                    totalTrueAnswer: item.TotalTrueAnswer,
                    totalFalseAnswer: item.TotalFalseAnswer,
                    result: item.Percentage,
                };
                return <BoxResult key={index} item={dataRender} />;
            })}

            <PersonalInfos />
        </>
    );
}

export default DiscResults;
