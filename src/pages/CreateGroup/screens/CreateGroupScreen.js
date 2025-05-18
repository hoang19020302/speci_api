import { useState, useRef, useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from '../styles/createGroupStyles.module.scss';

import { compareValues, testEmail } from '../../../hooks/hocks';
import { BackBtn, BgrMain, ButtonCpn, InputCheckbox, ModalComp, LoaderIcon } from '../../../conponents';
import InfoItem from '../component/InfoItem';
import BoxMail from '../component/BoxMail';
import { useUserCreateGroupMutation } from '../../../store/api';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../../store/apiSlice';
import { useNavigate } from 'react-router-dom';
import { privatePath } from '../../../Router/paths';
import { VscError } from 'react-icons/vsc';

import { iconImg } from '../../../acset/images';

const cx = classNames.bind(styles);

function CreateGroupScreen() {
    const navigate = useNavigate();
    //email input tex
    const [emailString, setEmailString] = useState('');
    //email when converted to array
    const [listEmail, setListMail] = useState([]);
    //list email error when converted to array
    const [errEmails, setErrEmails] = useState([]);
    //name group
    const [nameGroup, setNameGroup] = useState('');
    //exam test type
    const [testType, setTestType] = useState([1]);
    //console.log(999, testType);

    //============== err mes ============
    //rule err name group
    const [errorFormSubmit, setErrorFormSubmit] = useState({});
    //rule err email group
    const [errorEmail, setErrorEmail] = useState('');

    //active tow btn
    const [activeBtn, setActiveBtn] = useState(0);

    const refElement = useRef(null);
    const refNameGroupElement = useRef(null);

    //open modal
    const [openModal, setOpenModal] = useState(false);
    const [mesRespone, setMesRespone] = useState();
    //api
    const userID = useSelector(selectUserId);
    const [userCreateGroup, userCreateGroupLoad] = useUserCreateGroupMutation();

    // console.log(userCreateGroupLoad.isLoading);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errMes = {};
        if (nameGroup.length === 0) {
            errMes.errNameGroup = 'Vui lòng nhập tên nhóm';
            refNameGroupElement.current.focus();
        }

        if (testType.length === 0) {
            errMes.errTypeQuestion = 'Vui lòng chọn loại bài đánh giá';
        }
        setErrorFormSubmit(errMes);
        if (Object.keys(errMes).length === 0) {
            userCreateGroup({
                userID: userID,
                invitedEmails: emailString.split(';').reduce((prev, curr) => {
                    return prev + ';' + curr.trim();
                }, ''),
                groupName: nameGroup,
                type: testType,
            })
                .then((data) => {
                    setOpenModal(true);
                    setMesRespone(data?.data);
                })
                .catch(() => {
                    console.log(3333);
                    alert('Có lỗi xảy ra, vui lòng thử lại sau');
                });
        }
    };

    const handleTest = () => {
        if (!refElement.current.value) {
            setErrorEmail('Vui lòng nhập email');
        } else {
            const newListEmail = refElement.current.value
                .split(';')
                .reduce((newList, email, index) => {
                    return [...newList, { id: index, email: email.trim() }];
                }, [])
                .filter((item) => item.email.length > 0);

            const errEmails = newListEmail.reduce((newErrEmails, item) => {
                if (typeof testEmail(item.email) === 'string') {
                    return [item.id, ...newErrEmails];
                } else {
                    return [...newErrEmails];
                }
            }, []);

            setListMail(newListEmail);
            setErrEmails(errEmails);
        }

        refElement.current.focus();
    };

    const handleChangeInput = (e, index) => {
        if (typeof testEmail(e.target.value) === 'undefined') {
            setErrEmails(errEmails.filter((id) => id !== index));
        } else {
            setErrEmails([index, ...errEmails]);
        }
        const newListEmail = [
            {
                id: index,
                email: e.target.value,
            },
            ...listEmail.filter((item) => item.id !== index),
        ].sort(compareValues('id'));

        setEmailString(
            newListEmail
                .reduce((newList, email) => {
                    return [...newList, email.email];
                }, [])
                .join('; '),
        );

        setListMail(newListEmail);
    };

    const handleChangeTex = (e) => {
        setErrEmails('');

        setEmailString(e.target.value);
        setActiveBtn(0);
    };

    useEffect(() => {
        if (listEmail.length === 0) {
            setActiveBtn(0);
        } else if (errEmails.length > 0) {
            setActiveBtn(0);
        } else {
            setActiveBtn(1);
        }
    }, [errEmails, listEmail]);

    const handleCheckQuestionBankType = (type) => {
        setTestType((prev) => {
            if (prev.includes(type)) {
                return prev.filter((item) => item !== type);
            } else {
                return [...prev, type].sort();
            }
        });
    };

    const handleOk = (status) => {
        if (status === 1) {
            navigate(privatePath.groupResults);
        } else {
            setOpenModal(false);
        }
    };

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('is_login'))) {
            navigate(privatePath.home);
        }
    }, []);

    return (
        <BgrMain className={'mainContainer'} isHomeScreen isAlignCenter>
            <BackBtn />

            <div className={cx('container')}>
                <InfoItem title="tạo nhóm" errorMes={errorFormSubmit.errNameGroup}>
                    <input
                        ref={refNameGroupElement}
                        className={cx('inputBody')}
                        type="text"
                        onChange={(e) => setNameGroup(e.target.value)}
                        value={nameGroup}
                    />
                </InfoItem>
                <InfoItem
                    title="loại bài test"
                    errorMes={errorFormSubmit.errTypeQuestion}
                    styles={{ marginBottom: '5rem' }}
                >
                    <InputCheckbox
                        label={'Test tính cách'}
                        onChange={() => handleCheckQuestionBankType(1)}
                        idCheck={testType}
                        idCheckbox={1}
                    />
                    <div style={{ width: '5rem' }}></div>
                    <InputCheckbox
                        label={'Test tâm lý'}
                        onChange={() => handleCheckQuestionBankType(2)}
                        idCheck={testType}
                        idCheckbox={2}
                    />
                </InfoItem>
                <BoxMail title={'Vui lòng nhâp Email thành viên'} errorMes={errorEmail}>
                    <textarea
                        ref={refElement}
                        value={emailString}
                        className={cx('textarea')}
                        placeholder="Môi email cách nhau bởi 1 dấu chấm phẩy (...; ...)"
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setErrorEmail('');
                            }
                            handleChangeTex(e);
                        }}
                    />
                </BoxMail>
                {listEmail.length > 0 ? (
                    <BoxMail
                        title={'Email thành viên'}
                        total={{ err: listEmail.length - errEmails.length, total: listEmail.length }}
                    >
                        <ol className={cx('listMail')}>
                            {listEmail.map((email) => {
                                return (
                                    <li key={email.id}>
                                        <p>{email.id + 1}.</p>
                                        <input
                                            className={cx(errEmails.includes(email.id) ? 'errEmail' : null)}
                                            value={email.email}
                                            onChange={(e) => handleChangeInput(e, email.id)}
                                        />
                                    </li>
                                );
                            })}
                        </ol>
                    </BoxMail>
                ) : null}
                {activeBtn === 0 && (
                    <ButtonCpn button1 className={cx('btn', 'btnTest')} onClick={handleTest}>
                        Kiểm tra email
                    </ButtonCpn>
                )}
                {activeBtn === 1 && (
                    <ButtonCpn
                        button1
                        className={cx('btn')}
                        onClick={(e) => handleSubmit(e)}
                        disabled={userCreateGroupLoad.isLoading}
                    >
                        {userCreateGroupLoad.isLoading && <LoaderIcon className={cx('loaderIcon')} />}
                        Tao nhom
                    </ButtonCpn>
                )}
            </div>
            {mesRespone && (
                <ModalComp
                    className={cx('boxModal', mesRespone.status !== 1 && 'boxModalErr')}
                    isOpen={openModal}
                    setOpenModal={setOpenModal}
                    onOk={() => handleOk(mesRespone.status)}
                    textBtnOk={mesRespone.status === 1 ? 'Xem kết quả' : 'Kiểm tra'}
                    isBtnCancel={mesRespone.status === 1}
                    isBtnOk
                >
                    {mesRespone.status === 1 ? (
                        <>
                            <img src={iconImg.success} alt="errSuccessImg" className={cx('imgSuc')} />
                            <h3>{mesRespone.message}</h3>
                            <p>Xem danh sách nhóm mà bạn đã tạo?</p>
                        </>
                    ) : (
                        <>
                            <VscError className={cx('iconErr')} />
                            <h3>{mesRespone.message}</h3>
                            <p>Vui lòng kiểm tra lại thông tin!!!</p>
                        </>
                    )}
                </ModalComp>
            )}
        </BgrMain>
    );
}

export default CreateGroupScreen;
