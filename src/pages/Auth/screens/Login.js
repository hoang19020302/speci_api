import { useState, useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from '../styles/authStyles.module.scss';

import { BgrMain } from '../../../conponents';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { InputCpn, ButtonCpn, Header, Line, LoaderIcon } from '../../../conponents';

import { testEmail, testPassword } from '../../../hooks/hocks';
import { authPath } from '../../../Router/paths';

import { useGetUserProfileSocialQuery, useUserLoginMutation } from '../../../store/api';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserProfile, updateUserInfo, logout } from '../../../store/apiSlice';

import { privatePath } from '../../../Router/paths';

import { getTokenFromCookie, decodeToken } from '../../../pages/Auth/Helper/Helper';

const cx = classNames.bind(styles);
function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        userName: location.state?.email ? location.state?.email : '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [userLogin, userLoginResponse] = useUserLoginMutation();
    const auth = useSelector(selectUserProfile);

    // Xử lý thay đổi dữ liệu form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    // Xử lý thành công login
    const handleLoginSuccess = (token) => {
        const userInfo = decodeToken(token);
        if (userInfo?.UserID) {
            localStorage.setItem("user_profile", JSON.stringify(userInfo));
            localStorage.setItem("id_user", userInfo?.UserID);
            localStorage.setItem("is_login", true);

            dispatch(
                updateUserInfo({
                    idUser: userInfo?.UserID,
                    userProfile: userInfo,
                })
            );
            navigate(`${privatePath.personalResults}?type=1`);
        }
    };

    // Xử lý submit form login thông thường
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.userName.trim()) {
            validationErrors.email = 'Vui lòng nhập Email';
        } else if (testEmail(formData.userName)) {
            validationErrors.email = testEmail(formData.email);
        }

        if (!formData.password.trim()) {
            validationErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (testPassword(formData.password)) {
            validationErrors.password = testPassword(formData.password);
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const data = await userLogin(formData).unwrap();
                if (data?.status !== 1) {
                    setErrors({ server: data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!' });
                }
            } catch (error) {
                setErrors({ server: 'Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!' });
            }
        }
    };

    // Xử lý login qua Google (nếu token có sẵn trong cookie)
    useEffect(() => {
        if (auth && Object.keys(auth).length > 0) {
            console.log(auth);
            navigate(`${privatePath.personalResults}?type=1`);
        } else {
            const token = getTokenFromCookie('user_info');
            if (token) {
                console.log(token);
                handleLoginSuccess(token);
            }
        }
    }, [auth]);

    return (
        <BgrMain isVerticalAlignment onSubmit={handleSubmit}>
            <Header title={'đăng nhập'} />
            <Line width={'25rem'} styles={{ marginBottom: '4rem' }} />
            <ButtonCpn button1 to={process.env.REACT_APP_GOOGLE_LOGIN}>
                <FcGoogle className={cx('icon')} />
                đăng nhập với google
            </ButtonCpn>
            <ButtonCpn button1 to={process.env.REACT_APP_FACEBOOK_LOGIN}>
                <FaFacebook className={cx('icon', 'facebook-icon')} />
                đăng nhập với facebook
            </ButtonCpn>
            <p className={cx('text')}>Mẹo: Đăng nhập nhanh hơn với Google và Facebook</p>
            <div className={cx('separation')}>
                <Line width={'13rem'} isLine1 />
                <p>hoặc</p>
                <Line width={'13rem'} isLine1 />
            </div>
            <div className={cx('formGroup')}>
                <label for="email">Email</label>
                <InputCpn
                    name="userName"
                    input1
                    placeholder={'Vui lòng nhập Email của bạn!'}
                    onChange={(e) => handleChange(e)}
                    value={formData.userName}
                    errMes={errors.email}
                />
            </div>
            <div className={cx('formGroup')}>
                <label for="password">Mật khẩu</label>
                <InputCpn
                    name="password"
                    typeInput="password"
                    isPassword
                    input1
                    placeholder={'Vui lòng nhập mật khẩu!'}
                    onChange={(e) => handleChange(e)}
                    value={formData.password}
                    errMes={errors.password}
                />
            </div>
            <ButtonCpn
                type="submit"
                button2
                style={{ marginTop: '2rem', width: '18rem' }}
                disabled={userLoginResponse.isLoading}
            >
                {userLoginResponse.isLoading && <LoaderIcon className={cx('loaderIcon')} />}
                <span>đăng nhập</span>
            </ButtonCpn>

            {errors.server && <p className={cx('server-error')}>{errors.server}</p>}

            <div className={cx('authItem')}>
                <p>Bạn chưa có tài khoản?</p>
                <Link to={authPath.register} className={cx('link')}>
                    Đăng ký
                </Link>
            </div>
            <div className={cx('authItem')}>
                <a href="https://speciapi.fun/reset-password" className={cx('link')}>Quên mật khẩu?</a>
            </div>
        </BgrMain>
    );
}

export default Login;
