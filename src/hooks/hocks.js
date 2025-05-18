const testEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email) ? undefined : 'Đây không phải Email';
};

const testPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*?&])(?=.*[0-9])[\w@$!%*?&]+$/;
    if (password.length < 8) {
        return 'Mật khẩu phải chứa ít nhất 8 ký tự';
    } else if (!regex.test(password)) {
        return 'Mật khẩu phải chứa ký tự đặc biệt, chữ viết hoa, chữ viết thường và số';
    }

    return false;
};

// hàm cho sắp xếp động
function compareValues(key, order = 'asc') {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // không tồn tại tính chất trên cả hai object
            return 0;
        }

        const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return order == 'desc' ? comparison * -1 : comparison;
    };
}

function findMax(arr, key) {
    let max = 0;
    if (arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i][key] > arr[max][key]) {
                max = i;
            }
        }

        return arr[max];
    }
}

const getlistBirdPeople = (arr) => {
    if (!!arr) {
        const newList = arr.filter((item) => item.Percentage === findMax(arr, 'Percentage').Percentage);
        return newList;
    } else {
        return null;
    }
};

export { testEmail, testPassword, compareValues, findMax, getlistBirdPeople };
