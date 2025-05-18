import { IoIosLogOut } from 'react-icons/io';
import { FaCaretDown } from 'react-icons/fa';
import { privatePath, authPath } from '../../Router/paths';

const itemNavbarPath1 = [
    {
        ID: 1,
        title: 'kết quả bài đánh giá',
        path: `${privatePath.personalResults}?type=1`,
    },
    {
        title: 'làm bài đánh giá',
        icon: FaCaretDown,
        children: [
            {
                ID: '2a',
                title: 'Trác nghiệm tính cách - DISC',
                path: privatePath.personalityTest,
                type: 1,
            },
            {
                ID: '2b',
                title: 'Trắc nghiệm tâm lý - BECK',
                path: privatePath.psychologicalTest,
                type: 2,
            },
        ],
    },
    {
        ID: 3,
        title: 'tạo nhóm',
        path: privatePath.createGroup,
    },
];

const itemNavbarPath2 = [
    {
        ID: 4,
        title: 'thông tin cá nhân',
        path: privatePath.user,
    },
    {
        ID: 5,
        title: 'Trang quản trị',
        path: 'https://speciapi.fun/admin',
    },
    {
        ID: 6,
        title: 'Logout',
        path: null,
        icon: IoIosLogOut,
    },
];

const exams = [
    {
        id: 1,
        label: 'Trác nghiệm tính cách DISC',
        path: privatePath.personalityTest,
    },
    {
        id: 2,
        label: 'Trắc nghiệm tâm lý BECK',
        path: privatePath.psychologicalTest,
    },
];
// =============== DATA personality information ===================
const personalityInfos = [
    {
        birdType: 1,
        character: [
            ['Tự tin', 'Quyết đoán', 'Làm việc độc lập', 'Kiên quyết', 'Thực hiện nhiều việc'],
            ['Tính kỷ luật cao', 'Trực tiếp', 'Đầy sức thuyết phục', 'Sức cạnh tranh cao', 'Tính kiểm soát cao'],
        ],
        examples: [
            {
                title: 'Hành vi có thể thấy',
                des: 'Tự tin, quyết đoán, và thích mão hiểm.',
            },
            {
                title: 'Mục tiêu',
                des: 'Có thể thấy ngay kết quả, thích hành động, chấp nhận thử thách.',
            },
            {
                title: 'Nỗi lo sợ',
                des: 'Mất kiểm soát trong môi trường của bạn, bị lợi dụng.',
            },
            {
                title: 'Tác động bởi',
                des: 'Các thách thức, quyền lực, các câu trả lời trức tiếp.',
            },
            {
                title: 'Thế giới quan',
                des: 'Thiết lập môi trường bằng cách vượt qua thách thức và sự chống đối.',
            },
            {
                title: 'Xử lý mâu thuẫn và xung đột',
                des: 'Chọn hình thức đối đầu, thắng hoặc thua.',
            },
            {
                title: 'Hạn chế',
                des: ' Thiếu sự quan tâm người khác, thiếu kiên nhẫn.',
            },
        ],
    },
    {
        birdType: 2,
        character: [
            ['Bình tĩnh', 'Có hệ thống', 'Tự chủ, tự kiềm chế', 'Có đầu óc phân tích', 'Cầu toàn'],
            ['Luôn nghĩ tới hậu quả', 'Bảo thủ', 'Ngoại giao giỏi', 'Có óc tiên đoán', 'Siêng năng'],
        ],
        examples: [
            {
                title: 'Hành vi có thể thấy',
                des: 'Cẩn thận, chính xác, ngoại giao, hạn chế.',
            },
            {
                title: 'Mục tiêu',
                des: 'Coi trọng các chuẩn mực và chi tiết, tư duy phân tích.',
            },
            {
                title: 'Nỗi lo sợ',
                des: 'Phê bình về công việc của họ, các phương pháp làm viêc cẩu thả.',
            },
            {
                title: 'Tác động bởi',
                des: 'Các mong đợi được xác định rõ ràng, coi trọng chất lượng và sự chính sác.',
            },
            {
                title: 'Thế giới quan',
                des: 'làm việc trong mọi hoàn cảnh để đảm vảo chất lượng và sự chính sác.',
            },
            {
                title: 'Xử lý mâu thuẫn và xung đột',
                des: 'Hợp tác [Win - Win',
            },
            {
                title: 'Hạn chế',
                des: 'Bình phẩm thái qúa về mình và người khác, không quyết đoán và mong muốn thu thập và phân tích các kiểu.',
            },
        ],
    },
    {
        birdType: 3,
        character: [
            ['Tự tin', 'Thân mật, thoải mái', 'Nói nhiều', 'Cường tráng', 'Nhiệt tình'],
            ['Lạc quan', 'Vô tư', 'Thanh thoát', 'Tự nhiên', 'Người thích rủi ro'],
        ],
        examples: [
            {
                title: 'Hành vi có thể thấy',
                des: 'Nhiệt tình, hấp dẫn, hoạt bát',
            },
            {
                title: 'Mục tiêu',
                des: 'Thích kết nỗi với mọi người, thích tạo ấn tượng tốt với người khác.',
            },
            {
                title: 'Nỗi lo sợ',
                des: 'Bị đám đông từ chỗi, bị khướt từ các đề xuất, mất sức ảnh hưởng.',
            },
            {
                title: 'Tác động bởi',
                des: 'Tập thể ghi nhận, hoạt động nhóm, các mỗi quan hệ.',
            },
            {
                title: 'Thế giới quan',
                des: 'Thiệt lập môi trường bằng cách thuyết phục và tạo ảnh hưởng người khác.',
            },
            {
                title: 'Xử lý mâu thuẫn và xung đột',
                des: 'Làm trọng tài (Lose - Win) hay là thoả hịp Win - Win.',
            },
            {
                title: 'Hạn chế',
                des: 'Bốc đồng, tổ chức kém và thiếu sự theo dõi.',
            },
        ],
    },
    {
        birdType: 4,
        character: [
            ['Bình tĩnh', 'Trung thành', 'Sống phụ thuộc', 'Kiên nhẫn', 'Chuộng cuộc sống thanh bình'],
            ['Thực tế', 'Thân thiện', 'Thích sự ổn định cao', 'Thân thiện', 'Thụ động'],
        ],
        examples: [
            {
                title: 'Hành vi có thể thấy',
                des: 'Kiên nhẫn, tinh thần đồng đội, thích ổn định, làm việc có phương pháp, bình tĩnh.',
            },
            {
                title: 'Mục tiêu',
                des: 'Đạt được sự ổn định, hoàn thành công việc thông qua việc hợp tác với người khác.',
            },
            {
                title: 'Nỗi lo sợ',
                des: 'Mất sự ổn định, làm việc hoàn toàn mới, thay đổi, điều bất ngờ.',
            },
            {
                title: 'Tác động bởi',
                des: 'Ít thay đổi, sự ổn định, sự ghi nhận chân thành, sự hợp tác.',
            },
            {
                title: 'Thế giới quan',
                des: 'Đạt được sự ổn định, hoàn thành công việc thông qua việc hợp tác với người khác.',
            },
            {
                title: 'Xử lý mâu thuẫn và xung đột',
                des: 'Trốn tránh [Lose - Lose].',
            },
            {
                title: 'Hạn chế',
                des: 'Nhiệt tình và cho đi một cách thái quá, luôn đặt lợi ích của mình sau cùng.',
            },
        ],
    },
];

//===================== FAKE DATA =====================

const fakeResults = [
    {
        id: 0,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 1,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 2,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 3,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 4,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 5,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 6,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 7,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
    {
        id: 8,
        nameGrounp: null,
        time: '25/1/2024',
        totalYes: 30,
        totalNo: 50,
        eaglePercent: '90%',
        owlPercent: '10%',
        peacockPercent: '0%',
        dovePercent: '0%',
    },
];

const fakeResultsGroupsPeoPle = {
    result: [
        {
            bird: 0,
            percent: '40%',
        },
        {
            bird: 3,
            percent: '30%',
        },
    ],

    groupsPeoPle: [
        {
            id: 0,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '40%',
            owlPercent: '40%',
            peacockPercent: '20%',
            dovePercent: '0%',
        },
        {
            id: 1,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '30%',
            owlPercent: '30%',
            peacockPercent: '30%',
            dovePercent: '10%',
        },
        {
            id: 2,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '0%',
            owlPercent: '10%',
            peacockPercent: '0%',
            dovePercent: '90%',
        },
        {
            id: 3,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '90%',
            owlPercent: '10%',
            peacockPercent: '0%',
            dovePercent: '0%',
        },
        {
            id: 4,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '90%',
            owlPercent: '10%',
            peacockPercent: '0%',
            dovePercent: '0%',
        },
        {
            id: 5,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '90%',
            owlPercent: '10%',
            peacockPercent: '0%',
            dovePercent: '0%',
        },
        {
            id: 6,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '90%',
            owlPercent: '10%',
            peacockPercent: '0%',
            dovePercent: '0%',
        },
        {
            id: 7,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '90%',
            owlPercent: '10%',
            peacockPercent: '0%',
            dovePercent: '0%',
        },
        {
            id: 8,
            nameGrounp: null,
            time: '25/1/2024',
            eaglePercent: '90%',
            owlPercent: '10%',
            peacockPercent: '0%',
            dovePercent: '0%',
        },
    ],
};

const fakeResultGroups = [
    {
        nameGroup: 'nhóm số 1',
        totalComplete: 40,
        total: 70,
        dateCreate: '16/1/2024',
    },
    {
        nameGroup: 'nhóm số 2',
        totalComplete: 50,
        total: 80,
        dateCreate: '16/1/2024',
    },
    {
        nameGroup: 'nhóm số 3',
        totalComplete: 30,
        total: 90,
        dateCreate: '16/1/2024',
    },
    {
        nameGroup: 'nhóm số 4',
        totalComplete: 28,
        total: 65,
        dateCreate: '16/1/2024',
    },
    {
        nameGroup: 'nhóm số 5',
        totalComplete: 41,
        total: 68,
        dateCreate: '16/1/2024',
    },
    {
        nameGroup: 'nhóm số 6',
        totalComplete: 40,
        total: 88,
        dateCreate: '16/1/2024',
    },
];

const fakeQuestion = [
    {
        //sortOrder == id
        id: 8,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 7,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 3,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 6,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 5,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 10,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 12,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 9,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 1,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 2,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 0,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 13,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 4,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
    {
        id: 11,
        question: 'Tôi thích làm việc một mình hơn là làm việc với người',
    },
];

export {
    itemNavbarPath1,
    itemNavbarPath2,
    fakeResults,
    fakeResultGroups,
    fakeResultsGroupsPeoPle,
    exams,
    fakeQuestion,
    personalityInfos,
};

// {
//     idUser:
//     nameGroup:
//     testType:
//     emails: 'assdasd'
// }
