import classNames from 'classnames/bind';
import styles from '../styles/homeStyles.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { privatePath } from '../../../Router/paths';
const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('is_login'))) navigate(`${privatePath.personalResults}?type=1`);
    }, []);

    return <div className={cx('homeContainer')}>chào mừng bạn đến với speci app </div>;
}

export default Home;
