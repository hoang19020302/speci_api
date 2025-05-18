import { useSelector } from 'react-redux';

import { selectUserId } from '../../../store/apiSlice';
import { useGetPersonalResultsQuery, usePrefetch } from '../../../store/api';

import { BoxResultBeck, LoaderIcon } from '../../../conponents';
import { useEffect } from 'react';

function BeckResults({ currentPage, postsPerPage, setTotalResult }) {
    const IdUser = useSelector(selectUserId);
    console.log(IdUser);
    const prefetchGetPersonalResults = usePrefetch('getPersonalResults', {
        ifOlderThan: 1,
    });
    const { data, isLoading } = useGetPersonalResultsQuery({
        id: IdUser,
        pageNum: currentPage,
        pageSize: postsPerPage,
        questionBankType: 2,
    });

    useEffect(() => {
        if (data?.status === 1) {
            setTotalResult(data?.data.Total);
        }
    }, [data?.data.Total]);
    useEffect(() => {
        prefetchGetPersonalResults({ id: IdUser, pageNum: currentPage, pageSize: postsPerPage, questionBankType: 2 });
    }, []);

    if (isLoading) {
        return <LoaderIcon title={'Đang tải dữ liệu'} center sizeBig />;
    }

    return (
        <>
            {data?.data.Result.map((item, index) => {
                return <BoxResultBeck key={index} item={item} />;
            })}
        </>
    );
}

export default BeckResults;
