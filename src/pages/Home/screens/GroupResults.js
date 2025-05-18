import { useState, useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from '../styles/resultScreenStyles.module.scss';

import { Pagination, LoaderIcon, ButtonCpn } from '../../../conponents';

import { useSelector } from 'react-redux';
import { useGetGroupInfomationQuery, usePrefetch } from '../../../store/api';
import { selectUserId } from '../../../store/apiSlice';
import { useNavigate } from 'react-router-dom';
import { privatePath } from '../../../Router/paths';
const cx = classNames.bind(styles);

function GroupResults() {
    const idUser = useSelector(selectUserId);
    console.log(idUser);
    const navigate = useNavigate();
    const [totalResult, setTotalResult] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const prefetchGetGroupInfomation = usePrefetch('getGroupInfomation', {
        ifOlderThan: 1,
    });
    const { data, isLoading } = useGetGroupInfomationQuery({
        id: idUser,
        pageNum: currentPage,
        pageSize: postsPerPage,
    });

    useEffect(() => {
        if (data?.status === 1) {
            setTotalResult(data?.data.Total);
        }
    }, [data?.data.Total]);

    useEffect(() => {
        prefetchGetGroupInfomation({ id: idUser, pageNum: currentPage, pageSize: postsPerPage });
    }, []);

    if (isLoading) {
        return <LoaderIcon title={'Đang tải dữ liệu'} center sizeBig />;
    }

    if (!JSON.parse(localStorage.getItem('is_login'))) {
        return <div className={cx('boxNotLogin')}>Vui long đăng nhập để xem kết quả của bạn !!!</div>;
    }

    return (
        <>
            <div className={cx('container', 'groupContainer')}>
                {data?.data?.Result.map((item, index) => {
                    return (
                        <ButtonCpn
                            key={index}
                            to={`/group-results/${item.GroupInformationID}`}
                            button1
                            className={cx('itemBody')}
                        >
                            <h3>{item.GroupName}</h3>
                            <div className={cx('boxInfo')}>
                                <p className={cx('completePeople')}>
                                    số người làm: <span>{`${item.PersonalResultCount}/${item.EmailCount}`}</span>
                                </p>
                                <p className={cx('date')}>{item.CreatedDate.split(' ')[0]}</p>
                            </div>
                        </ButtonCpn>
                    );
                })}
            </div>
            <Pagination
                totalPosts={totalResult}
                postsPerPage={postsPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
            />
        </>
    );
}

export default GroupResults;
