import classNames from 'classnames/bind';
import Header from './Header/Header';
import Navbar from './Navbar/Navbar';
import Bgr from '../Background/BgrMain';

import styles from './layoutStyle.module.scss';
import { ModalComp } from '..';
import { useState, useEffect } from 'react';
import { useUserLogoutMutation } from '../../store/api';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/apiSlice';
import { useNavigate } from 'react-router-dom';
import { authPath } from '../../Router/paths';

const cx = classNames.bind(styles);

function Layout({ children }) {
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userLogout] = useUserLogoutMutation();

    const handleOk = async () => {
        try {
            const data = await userLogout();
            console.log(data);
            if (data?.data?.status === 1) {
                // Xóa thông tin người dùng khỏi localStorage và cookies
                localStorage.removeItem('user_profile');
                localStorage.removeItem('id_user');
                localStorage.removeItem('is_login');
                document.cookie = "user_info=; Path=/; Domain=.speciapi.fun; Max-Age=0; SameSite=None; Secure";

                // Cập nhật Redux store
                dispatch(logout());

                // Chuyển hướng về trang login
                navigate(authPath.login, { replace: true });
            }
        } catch (error) {
            console.error(error);
            navigate(authPath.login, { replace: true });
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('main')}>
                <Header />
                <Bgr className={cx('content')} isOverflow isHomeScreen>
                    {children}
                </Bgr>
            </div>
            <Navbar setOpenLogout={setLogoutModalOpen} />
            {isLogoutModalOpen && (
                <ModalComp isOpen={isLogoutModalOpen} setOpenModal={setLogoutModalOpen} onOk={handleOk} textBtnOk="Logout">
                    <p className={cx('titleLogoutModal')}>
                        <span>Đăng xuất</span> khỏi ứng dụng?
                    </p>
                </ModalComp>
            )}
        </div>
    );
}

export default Layout;
