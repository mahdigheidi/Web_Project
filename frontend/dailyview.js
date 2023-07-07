function showDate() {
    const date = new Date();
    let dayInMonth = date.getDate()
    let day = date.getDay()
    if (day == 1) {
        dayName = "Mon"
    } else if (day == 2) {
        dayName = "Tue"
    } else if (day == 3) {
        dayName = "Wen"
    } else if (day == 4) {
        dayName = "Thu"
    } else if (day == 5){
        dayName = "Fri"
    } else if (day == 6) {
        dayName = "Sat"
    } else if (day == 0) {
        dayName = "Sun"
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
    let currentDate = `${dayName},${dayInMonth} ${monthName} ${year}`;
    return currentDate
}
var currentDate = showDate()
document.getElementById("currentDate").innerHTML = currentDate;


function show_next() {
    cur = document.getElementById("currentDate").innerHTML
    const myArray = cur.split(" ");
    let d = []
    d[0] = myArray[0].split(",")[1]
    d[1] = myArray[1]
    d[2] = myArray[2]
    if (d[1] == 'Jan') {
        d[1] = 01
    } else if (d[1] == 'Feb') {
        d[1] = 02
    } else if (d[1] == 'Mar') {
        d[1] = 03
    } else if (d[1] == 'Apr') {
        d[1] = 04
    } else if (d[1] == 'May') {
        d[1] = 05
    } else if (d[1] == 'Jun') {
        d[1] = 06
    } else if (d[1] == 'Jul') {
        d[1] = 07
    } else if (d[1] == 'Aug') {
        d[1] = 08
    } else if (d[1] == 'Sep') {
        d[1] = 09
    } else if (d[1] == 'Oct') {
        d[1] = 10
    } else if (d[1] == 'Nov') {
        d[1] = 11
    } else if (d[1] == 'Dec') {
        d[1] = 12
    }
    curDate = d[2].concat("-")
    curDate = curDate.concat(d[1])
    curDate = curDate.concat("-")
    curDate = curDate.concat(d[0])
    var date = new Date(curDate);
    date.setDate(date.getDate()+1);
    let dayInMonth = date.getDate()
        let day = date.getDay() 
        if (day == 1) {
            dayName = "Mon"
        } else if (day == 2) {
            dayName = "Tue"
        } else if (day == 3) {
            dayName = "Wen"
        } else if (day == 4) {
            dayName = "Thu"
        } else if (day == 5){
            dayName = "Fri"
        } else if (day == 6) {
            dayName = "Sat"
        } else if (day == 0) {
            dayName = "Sun"
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
        let currentDate = `${dayName},${dayInMonth} ${monthName} ${year}`;
        document.getElementById("currentDate").innerHTML = currentDate;
}
var next = document.getElementById("next");
next.onclick = show_next;

function show_prev() {
    cur = document.getElementById("currentDate").innerHTML
    const myArray = cur.split(" ");
    let d = []
    d[0] = myArray[0].split(",")[1]
    d[1] = myArray[1]
    d[2] = myArray[2]
    if (d[1] == 'Jan') {
        d[1] = 01
    } else if (d[1] == 'Feb') {
        d[1] = 02
    } else if (d[1] == 'Mar') {
        d[1] = 03
    } else if (d[1] == 'Apr') {
        d[1] = 04
    } else if (d[1] == 'May') {
        d[1] = 05
    } else if (d[1] == 'Jun') {
        d[1] = 06
    } else if (d[1] == 'Jul') {
        d[1] = 07
    } else if (d[1] == 'Aug') {
        d[1] = 08
    } else if (d[1] == 'Sep') {
        d[1] = 09
    } else if (d[1] == 'Oct') {
        d[1] = 10
    } else if (d[1] == 'Nov') {
        d[1] = 11
    } else if (d[1] == 'Dec') {
        d[1] = 12
    }
    curDate = d[2].concat("-")
    curDate = curDate.concat(d[1])
    curDate = curDate.concat("-")
    curDate = curDate.concat(d[0])
    var date = new Date(curDate);
    date.setDate(date.getDate()-1);
    let dayInMonth = date.getDate()
        let day = date.getDay() 
        if (day == 1) {
            dayName = "Mon"
        } else if (day == 2) {
            dayName = "Tue"
        } else if (day == 3) {
            dayName = "Wen"
        } else if (day == 4) {
            dayName = "Thu"
        } else if (day == 5){
            dayName = "Fri"
        } else if (day == 6) {
            dayName = "Sat"
        } else if (day == 0) {
            dayName = "Sun"
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
        let currentDate = `${dayName},${dayInMonth} ${monthName} ${year}`;
        document.getElementById("currentDate").innerHTML = currentDate;
}
var next = document.getElementById("prev");
next.onclick = show_prev;

function openForm(cell) {
    // Show the form popup
    document.getElementById("formPopup").style.display = "block";
    
    // Store the clicked cell reference for later use
    document.getElementById("formPopup").cellRef = cell;
  }
  
  // Function to submit the form and update the table cell
  function submitForm(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get start time and end time values from inputs
    var title = document.getElementById("title").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    
    // Update the related table cell with entered data
    var cell = document.getElementById("formPopup").cellRef;
    // cell.innerHTML = "Start: " + startTime + "<br>End: " + endTime;
    cell.innerHTML.style.color = ""
    
    // Hide the form popup
    document.getElementById("formPopup").style.display = "none";
    
    // Reset form inputs
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
  }

  function addTask(cell) {
    // Prompt the user for task details
    var title = prompt("Enter The Meeting Title:");
    if (!title) return;
  
    var startTime = prompt("Enter the start time (in 24-hour format, e.g., 9:00):");
    if (!startTime) return;
  
    var endTime = prompt("Enter the end time (in 24-hour format, e.g., 10:00):");
    if (!endTime) return;
  
    // Get the index of the selected cell
    var cellIndex = cell.cellIndex;
  
    // Get the index of the parent row
    var rowIndex = cell.parentNode.rowIndex;
  
    // Get the table element
    var table = document.querySelector("table");
  
    // Calculate the start and end hour
    var startHour = parseInt(startTime.split(":")[0]);
    var endHour = parseInt(endTime.split(":")[0]);
  
    // Create a task element and set its title
    var taskElement = document.createElement("div");
    taskElement.innerHTML = title;
  
    // Generate a random color
    var randomColor = getRandomColor();
  
    // Iterate over the relevant cells and append the task element and apply the random color
    for (var i = startHour - startHour + rowIndex; i <= endHour - startHour + rowIndex; i++) {
      var row = table.rows[i];
      var taskCell = row.cells[cellIndex];
      taskCell.classList.add("task");
      taskCell.style.backgroundColor = randomColor;
  
      if (i === startHour - startHour + rowIndex) {
        taskCell.appendChild(taskElement);
      }
    }
  }
  
  // Generate a random color in hexadecimal format
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
