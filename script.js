window.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem("food-notes", JSON.stringify())
    
    // Date setup
    const dateElement = document.getElementById('date');

    //const realToday = new Date();
    //const today = new Date(realToday);
    //today.setDate(realToday.getDate() + 1);

    const today = new Date();
    const dateKey = today.toISOString().split('T')[0]; // e.g. "2025-05-26"
    const dayIndex = today.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDayId = days[dayIndex].toLowerCase(); // 'monday', 'tuesday', etc.
    dateElement.textContent = days[dayIndex];

    // Protein counter elements
    const proteincounterEl = document.getElementById('protein-counter');
    const proteinincrementBtn = document.getElementById('proteinincrement');
    const proteinincrementbytenBtn = document.getElementById('proteinincrementbyten');
    const proteindecrementBtn = document.getElementById('proteindecrement');
    const proteindecrementbytenBtn = document.getElementById('proteindecrementbyten');

    // Load protein saved counts
    const savedProtein = JSON.parse(localStorage.getItem("protein-counter")) || {};
    let proteincount = savedProtein[dateKey] || 0;
    proteincounterEl.textContent = proteincount;

    function saveProteinCount() {
        savedProtein[dateKey] = proteincount;
        localStorage.setItem("protein-counter", JSON.stringify(savedProtein));
    }

    proteinincrementBtn.addEventListener('click', () => {
        proteincount++;
        proteincounterEl.textContent = proteincount;
        saveProteinCount();
    });
    proteindecrementBtn.addEventListener('click', () => {
        proteincount--;
        proteincounterEl.textContent = proteincount;
        saveProteinCount();
    });
    proteinincrementbytenBtn.addEventListener('click', () => {
        proteincount += 10;
        proteincounterEl.textContent = proteincount;
        saveProteinCount();
    });
    proteindecrementbytenBtn.addEventListener('click', () => {
        proteincount -= 10;
        proteincounterEl.textContent = proteincount;
        saveProteinCount();
    });

    // Calorie counter elements
    const caloriecounterEl = document.getElementById('calorie-counter');
    const calorieincrementbytenBtn = document.getElementById('calorieincrementbyten');
    const calorieincrementbyhundredBtn = document.getElementById('calorieincrementbyhundred');
    const caloriedecrementbytenBtn = document.getElementById('caloriedecrementbyten');
    const caloriedecrementbyhundredBtn = document.getElementById('caloriedecrementbyhundred');

    // Fix case sensitivity here: savedCalorie (not savedcalorie)
    const savedCalorie = JSON.parse(localStorage.getItem("calorie-counter")) || {};
    let caloriecount = savedCalorie[dateKey] || 0;
    caloriecounterEl.textContent = caloriecount;

    function saveCalorieCount() {
        savedCalorie[dateKey] = caloriecount;
        localStorage.setItem("calorie-counter", JSON.stringify(savedCalorie));
    }

    // Add event listeners with correct button variables
    calorieincrementbytenBtn.addEventListener('click', () => {
        caloriecount += 10;
        caloriecounterEl.textContent = caloriecount;
        saveCalorieCount();
    });
    caloriedecrementbytenBtn.addEventListener('click', () => {
        caloriecount -= 10;
        caloriecounterEl.textContent = caloriecount;
        saveCalorieCount();
    });
    calorieincrementbyhundredBtn.addEventListener('click', () => {
        caloriecount += 100;
        caloriecounterEl.textContent = caloriecount;
        saveCalorieCount();
    });
    caloriedecrementbyhundredBtn.addEventListener('click', () => {
        caloriecount -= 100;
        caloriecounterEl.textContent = caloriecount;
        saveCalorieCount();
    });

    // Stats inputs
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');

    // Get yesterday's date key
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    // Load all stats from localStorage
    const allStats = JSON.parse(localStorage.getItem("user-stats")) || {};

    // If today’s stats missing or empty, fill with yesterday’s
    if (!allStats[dateKey] || Object.keys(allStats[dateKey]).length === 0) {
        if (allStats[yesterdayKey]) {
            allStats[dateKey] = { ...allStats[yesterdayKey] };
            localStorage.setItem("user-stats", JSON.stringify(allStats));
        } else {
            allStats[dateKey] = {};
        }
    }

    const todayStats = allStats[dateKey];

    // Populate inputs
    if (todayStats.age !== undefined) ageInput.value = todayStats.age;
    if (todayStats.weight !== undefined) weightInput.value = todayStats.weight;
    if (todayStats.height !== undefined) heightInput.value = todayStats.height;
    
    const lbconversion = document.getElementById('pounds');
    lbconversion.textContent = Math.round(todayStats.weight * 2.205)

    const feetInchesEl = document.getElementById('feet-inches');
    if (!isNaN(todayStats.height)) {
        const totalInches = todayStats.height / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        feetInchesEl.textContent = `${feet}'${inches}`;
    } else {
        feetInchesEl.textContent = 0;
    }

    // Save function
    function saveStats() {
        const weight = parseFloat(weightInput.value);
        const age = parseInt(ageInput.value);
        const height = parseFloat(heightInput.value); // in centimeters

        allStats[dateKey] = {
            age: isNaN(age) ? "" : age,
            weight: isNaN(weight) ? "" : weight,
            height: isNaN(height) ? "" : height
        };
        localStorage.setItem("user-stats", JSON.stringify(allStats));

        // Update pounds conversion if weight is valid
        const lbconversion = document.getElementById('pounds');
        if (!isNaN(weight)) {
            lbconversion.textContent = (weight * 2.205).toFixed(1);
        } else {
            lbconversion.textContent = 0;
        }

        // feet/inches conversion
        const feetInchesEl = document.getElementById('feet-inches');
        if (!isNaN(height)) {
            const totalInches = height / 2.54;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            feetInchesEl.textContent = `${feet}'${inches}`;
        } else {
            feetInchesEl.textContent = 0;
        }
    }


    ageInput.addEventListener('input', saveStats);
    weightInput.addEventListener('input', saveStats);
    heightInput.addEventListener('input', saveStats);

    // ----- NEW: Copy today's stats to tomorrow every load -----
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowKey = tomorrow.toISOString().split('T')[0];

    // Overwrite tomorrow's stats with today's stats
    allStats[tomorrowKey] = { ...allStats[dateKey] };
    localStorage.setItem("user-stats", JSON.stringify(allStats));

    // Food notes
    const foodNotes = JSON.parse(localStorage.getItem("food-notes")) || {};
    const foodNoteEl = document.getElementById('food-note');

    foodNoteEl.value = foodNotes[dateKey];

    foodNoteEl.addEventListener('input', saveFoodNote);

    function saveFoodNote() {
        foodNotes[dateKey] = foodNoteEl.value;
        localStorage.setItem("food-notes", JSON.stringify(foodNotes));
    }
    
    // Modals
    const activities = JSON.parse(localStorage.getItem("activities")) || {};

    const mondayActivities = document.getElementById('monday-activities-edit');
    const tuesdayActivities = document.getElementById('tuesday-activities-edit');
    const wednesdayActivities = document.getElementById('wednesday-activities-edit');
    const thursdayActivities = document.getElementById('thursday-activities-edit');
    const fridayActivities = document.getElementById('friday-activities-edit');
    const saturdayActivities = document.getElementById('saturday-activities-edit');
    const sundayActivities = document.getElementById('sunday-activities-edit');

    mondayActivities.value = activities["monday"];
    tuesdayActivities.value = activities["tuesday"];
    wednesdayActivities.value = activities["wednesday"];
    thursdayActivities.value = activities["thursdday"];
    fridayActivities.value = activities["friday"];
    saturdayActivities.value = activities["saturday"];
    sundayActivities.value = activities["sunday"];

    function saveMondayActivities(day) {
        activities["monday"] = mondayActivities.value;
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    function saveTuesdayActivities(day) {
        activities["tuesday"] = tuesdayActivities.value;
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    function saveWednesdayActivities(day) {
        activities["wednesday"] = wednesdayActivities.value;
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    function saveThursdayActivities(day) {
        activities["thursday"] = thursdayActivities.value;
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    function saveFridayActivities(day) {
        activities["friday"] = fridayActivities.value;
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    function saveSaturdayActivities(day) {
        activities["saturday"] = saturdayActivities.value;
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    function saveSundayActivities(day) {
        activities["sunday"] = sundayActivities.value;
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    mondayActivities.addEventListener('input', saveMondayActivities);
    tuesdayActivities.addEventListener('input', saveTuesdayActivities);
    wednesdayActivities.addEventListener('input', saveWednesdayActivities);
    thursdayActivities.addEventListener('input', saveThursdayActivities);
    fridayActivities.addEventListener('input', saveFridayActivities);
    saturdayActivities.addEventListener('input', saveSaturdayActivities);
    sundayActivities.addEventListener('input', saveSundayActivities);

    // Today's activities
    todaysActivities = document.getElementById("todaysactivity");
    if (todayDayId === "monday") {
        todaysActivities.textContent = activities["monday"];
    }

    if (todayDayId === "tuesday") {
        todaysActivities.textContent = activities["tuesday"];
    }

    if (todayDayId === "wednesday") {
        todaysActivities.textContent = activities["wednesday"];
    }

    if (todayDayId === "thursday") {
        todaysActivities.textContent = activities["thursday"];
    }

    if (todayDayId === "friday") {
        todaysActivities.textContent = activities["friday"];
    }

    if (todayDayId === "saturday") {
        todaysActivities.textContent = activities["saturday"];
    }

    if (todayDayId === "sunday") {
        todaysActivities.textContent = activities["sunday"];
    }

    // Schedule
    const schedule = JSON.parse(localStorage.getItem("schedule")) || {};

    // Reference each input element
    const scheduleInputs = {
        monday: document.getElementById('monday'),
        tuesday: document.getElementById('tuesday'),
        wednesday: document.getElementById('wednesday'),
        thursday: document.getElementById('thursday'),
        friday: document.getElementById('friday'),
        saturday: document.getElementById('saturday'),
        sunday: document.getElementById('sunday')
    };

    // Load saved schedule into inputs
    Object.keys(scheduleInputs).forEach(day => {
        scheduleInputs[day].value = schedule[day] || '';
        // Highlight today’s schedule input
        const todayInput = scheduleInputs[todayDayId];
        if (todayInput) {
            todayInput.classList.add('bg-success-subtle');
        }

        scheduleInputs[day].addEventListener('input', () => {
            schedule[day] = scheduleInputs[day].value;
            localStorage.setItem("schedule", JSON.stringify(schedule));
        });
    });
    
    const dayIndicatorEl = document.getElementById("day-indicator");
    dayIndicatorEl.textContent = scheduleInputs[todayDayId].value || '';

    // Finished check box
    const statuses = JSON.parse(localStorage.getItem("statuses")) || {};
    const statusEl = document.getElementById("status");

    function saveStatus() {
        statuses[dateKey] = statusEl.checked;
        localStorage.setItem("statuses", JSON.stringify(statuses));
    }

    statusEl.addEventListener('input', saveStatus);
});
