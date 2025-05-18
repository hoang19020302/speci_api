import { useState, useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from '../styles/authStyles.module.scss';

import { BgrMain, ModalComp } from '../../../conponents';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { InputCpn, ButtonCpn, Header, Line, LoaderIcon } from '../../../conponents';

import { testEmail, testPassword } from '../../../hooks/hocks';
import { authPath } from '../../../Router/paths';

import { useNavigate } from 'react-router-dom';
import { useUserRegisterMutation } from '../../../store/api';
import { iconImg } from '../../../acset/images';

const cx = classNames.bind(styles);

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [emailLogin, setEmailLogin] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const [userRegister, userRegisterResponse] = useUserRegisterMutation();

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

    useEffect(() => {
        if (userRegisterResponse.isError) {
            setErrors({ server: 'Đăng ký không thành công, vui lòng thử lại.' });
        }
    }, [userRegisterResponse.isError]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = {};
        if (!formData.username.trim()) {
            validationErrors.username = 'Vui lòng nhập tên của bạn';
        }

        if (!formData.email.trim()) {
            validationErrors.email = 'Vui lòng nhập Email';
        } else if (testEmail(formData.email)) {
            validationErrors.email = testEmail(formData.email);
        }

        if (!formData.password.trim()) {
            validationErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (testPassword(formData.password)) {
            validationErrors.password = testPassword(formData.password);
        }

        if (formData.confirmPassword !== formData.password) {
            validationErrors.confirmPassword = 'Mật khẩu không trùng khớp';
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            userRegister({
                userName: formData.email,
                password: formData.password,
                fullName: formData.username,
            }).then((data) => {
                if (data.data.status === 1) {
                    setOpenModal(true);
                    setEmailLogin(data?.data?.data.UserName);
                } else {
                    setTimeout(() => {
                        setFormData({
                            email: '',
                            username: '',
                            password: '',
                            confirmPassword: '',
                        });
                        alert(`${data.data.message}. Vui lòng thay đổi email đăng ký`);
                    }, [1000]);
                }
            })
            .catch(() => {
                setErrors({ server: 'Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!' });
            });
        }
    };

    const handleOk = () => {
        navigate(authPath.login, { state: { email: emailLogin } });
    };

    return (
        <BgrMain isVerticalAlignment onSubmit={handleSubmit} className={cx('formRegister')}>
            <Header title={'đăng ký'} />
            <Line width={'25rem'} styles={{ marginBottom: '3rem' }} />
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
                    name="email"
                    input1
                    placeholder={'Vui lòng nhập Email của bạn!'}
                    onChange={(e) => handleChange(e)}
                    value={formData.email}
                    errMes={errors.email}
                />
            </div>
            <div className={cx('formGroup')}>
                <label for="username">Tên người dùng</label>
                <InputCpn
                    name="username"
                    input1
                    placeholder={'Vui lòng nhập tên của bạn!'}
                    onChange={(e) => handleChange(e)}
                    value={formData.username}
                    errMes={errors.username}
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
            <div className={cx('formGroup')}>
                <label for="confirmPassword">Nhập lại mật khẩu</label>
                <InputCpn
                    name="confirmPassword"
                    typeInput="password"
                    isPassword
                    input1
                    placeholder={'Vui lòng nhập lại mật khẩu!'}
                    onChange={(e) => handleChange(e)}
                    value={formData.confirmPassword}
                    errMes={errors.confirmPassword}
                />
            </div>
            <ButtonCpn
                type="submit"
                button2
                style={{ marginTop: '2rem', width: '18rem' }}
                disabled={userRegisterResponse.isLoading}
            >
                {userRegisterResponse.isLoading && <LoaderIcon className={cx('loaderIcon')} />}
                <span>đăng ký</span>
            </ButtonCpn>

            {errors.server && <p className={cx('server-error')}>{errors.server}</p>}

            <div className={cx('authItem')}>
                <p>Bạn đã có tài khoản?</p>
                <Link to={authPath.login} className={cx('link')}>
                    Đăng nhập
                </Link>
            </div>

            <ModalComp
                className={cx('boxModal')}
                isOpen={openModal}
                setOpenModal={setOpenModal}
                onOk={handleOk}
                textBtnOk={'Đăng nhập'}
            >
                <img src={iconImg.success} alt="errSuccessImg" className={cx('imgSuc')} />
                <h3>Đăng ký thành công</h3>
                <p>
                    Bạn có muốn đến màn hình <span>Đăng nhập</span>?
                </p>
            </ModalComp>
        </BgrMain>
    );
}

export default Register;
