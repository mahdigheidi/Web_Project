const date = new Date();
        let day = date.getDay()
        if (day == 0) {
            day = "Mon"
        } else if (day == 1) {
            day = "Tue"
        } else if (day == 2) {
            day = "Wen"
        } else if (day == 3) {
            day = "Thu"
        } else if (day == 4){
            day = "Fri"
        } else if (day == 5) {
            day = "Sat"
        } else if (day == 6) {
            day = "Sun"
        }
        let month = date.getMonth() + 1;
        if (month == 1) {
            monthName = "Jan"
        } else if (month == 2) {
            monthName = "Feb"
        } else if (month == 3) {
            monthName = "Mar"
        } else if (month == 4) {
            monthName = "Apr"
        } else if (month == 5) {
            monthName = "May"
        } else if (month == 6) {
            monthName = "Jun"
        } else if (month == 7) {
            monthName = "Jul"
        } else if (month == 8) {
            monthName = "Aug"
        } else if (month == 9) {
            monthName = "Sep"
        } else if (month == 10) {
            monthName = "Oct"
        } else if (month == 11) {
            monthName = "Nov"
        } else if (month == 12) {
            monthName = "Dec"
        }
        let year = date.getFullYear();
        let currentDate = `${day},${month} ${monthName} ${year}`;
        document.getElementById("currentDate").innerHTML = currentDate;