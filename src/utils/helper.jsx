import icons from "./icons";
const { AiOutlineStar, AiFillStar } = icons;


export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-');
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString();

export function formatNumberWithDotSeparator(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const emailRegex = /^[a-zA-Z0-9\+\.\_\%\-\+]{1,256}\@[a-zA-Z0-9][a-zA-Z0-9\-]{0,62}(\.[a-zA-Z0-9][a-zA-Z0-9\-]{0,25})+$/;
export const validateEmail = email => emailRegex.test(email);

export function extractIdSlug(inputString) {
    const regex = /-(\d+)$/; // Match a hyphen followed by one or more digits at the end of the string
    const match = inputString.match(regex);

    if (match) {
        return match[1]; // Return the extracted number
    } else {
        return null; // Return null if no match is found
    }
}
export function htmlToJsx(htmlString) {
    // Regular expression to match class and style attributes in HTML
    const classRegex = /class\s*=\s*["']([^"']+)["']/g;
    const styleRegex = /style\s*=\s*["']([^"']+)["']/g;

    // Convert class attribute to className
    const jsxStringWithClassName = htmlString.replace(classRegex, 'className={{ $1 }}');

    // Convert style attribute to style object
    const jsxStringWithStyle = jsxStringWithClassName.replace(styleRegex, 'style={{ $1 }}');

    return jsxStringWithStyle;
}
export function calcRating(ratings) {
    if (ratings) {
        let totalRating = 0;
        let totalRatings = 0;
        let ratingCounts = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };
        ratings.forEach(rating => {
            totalRating += rating.rate;
            ratingCounts[rating.rate]++;
            totalRatings++;
        });
        const averageRating = (ratings.length > 0 ? totalRating / ratings.length : 0).toFixed(1);
        const result = {
            average: averageRating,
            totalRatings: totalRatings,
        };
        for (let i = 1; i <= 5; i++) {
            result[i] = ratingCounts[i];
        }
        console.log("RATING CALC: ", result);
        return result;
    }
}
export function extractVideoGoogleGDriveUrlId(videoUrl) {
    const match = videoUrl.match(/\/file\/d\/(.+?)\//);
    return match ? match[1] : null;
}
export function formatTimeStampTo_DDMMYYY(timeStamp, buildTime) {
    // Create a new Date object using the timestamp
    var date = new Date(timeStamp);

    // Extract the components of the date
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero-based
    var year = date.getFullYear();
    var hours = '';
    var minutes = '';
    if (buildTime) {
        hours = date.getHours();
        minutes = date.getMinutes();
    }

    // Pad single-digit day and month with leading zeros
    var formattedDay = (day < 10) ? '0' + day : day;
    var formattedMonth = (month < 10) ? '0' + month : month;

    // Format the date as 'DD/MM/YYYY HH:mm'
    var formattedDate = formattedDay + '/' + formattedMonth + '/' + year + (buildTime ? (" " + hours + ":" + minutes) : '');

    // Return the formatted date
    return formattedDate;
}
export const renderStarFromNumber = (number, size) => {
    //4=>[1,1,1,1,0]
    const starts = [];
    number = Math.round(number);
    for (let i = 0; i < +number; i++) starts.push(<AiFillStar className="text-amber-400" size={size || 16} />);
    for (let i = 5; i > +number; i--) starts.push(<AiOutlineStar className="text-amber-400" size={size || 16} />);

    return starts;
};
export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++;
            setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Require this field .' }]);
        }
    }
    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
                if (!arr[1].match(regex)) {
                    invalids++;
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Email invalid.' }]);
                }
                break;
            case 'password':
                if (arr[1].lenght < 6) {
                    invalids++;
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Password minimum 6 characters.' }]);
                }
                break;
            default:
                break;
        }
    }
    return invalids;
};
export const formatPrice = number => Math.round(number / 1000) * 1000;

export const generateRange = (start, end) => {
    const length = end + 1 - start;
    return Array.from({ length }, (_, index) => start + index);
};
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}