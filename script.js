// calendar.js
window.addEventListener('DOMContentLoaded', async () => {
    const outputContainer = document.getElementById('calendar-output');
    const select = document.getElementById('month-select');
    const linkForm = document.getElementById('link-form');
    const linkInput = document.getElementById('link-input');
    const saveLinkButton = document.getElementById('save-link');

    const response = await fetch('calendar.json');
    const data = await response.json();


    select.addEventListener('change', () => {
        const selectedMonth = select.value;
        if (selectedMonth !== '') {
            const monthData = data.months.find(m => m.month === selectedMonth);
            renderMonth(monthData);
        } else {
            outputContainer.innerHTML = ''; 
        }
    });

    const januaryData = data.months.find(m => m.month === 'Январь');
    renderMonth(januaryData);

    outputContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD') {
            const day = event.target.textContent;
            const month = select.value;
            const year = '2025';
            const date = `${year}-${monthToNumber(month)}-${day}`;

            linkForm.style.display = 'block';

            //let s = event;
            document.getElementById("mytext").textContent +=`${event}`;
            
            linkForm.style.display = 'block';
            linkInput.value = '';

            saveLinkButton.addEventListener('click', () => {
                const link = linkInput.value;
                if (link) {
                    const textUrl = event.target.innerHTML = `<a href="${link}" target="_blank" class="link">${day}</a>`;
                    linkForm.style.display = 'none';
                }
            });
        }
    });
});

function renderMonth(monthData) {
    const outputContainer = document.getElementById('calendar-output');
    outputContainer.innerHTML = ''; 

    const monthHeader = `<h2>${monthData.month}</h2>`;
    outputContainer.innerHTML += monthHeader;

    const tableHtml = generateMonthTable(monthData);
    outputContainer.innerHTML += tableHtml;
}

function generateMonthTable(monthData) {
    const totalDays = new Date(`${monthData.month}, 2025`).getLastDayOfMonth();
    const firstDay = new Date(`2025-${monthToNumber(monthData.month)}-01`).getDay();

    let table = '<table>';
    table += '<thead><tr>' +
              '<th>Пн.</th>' +
              '<th>Вт.</th>' +
              '<th>Ср.</th>' +
              '<th>Чт.</th>' +
              '<th>Пн.</th>' +
              '<th>Сб.</th>' +
              '<th>Вс.</th></tr></thead>';

    table += '<tbody>';

    const workDays = monthData.days.split(',');
    const holidays = monthData.holidays.split(',');

    let currentDay = 1;
    let weekNum = 0;

    while (currentDay <= totalDays) {
        table += '<tr>';
        for (let i = 0; i < 7; i++) {
            if (weekNum === 0 && i < firstDay) {
                table += '<td> </td>';
            } else if (currentDay > totalDays) {
                break;
            } else {
                const isHoliday = holidays.includes(String(currentDay));
                const isWorkDay = workDays.includes(String(currentDay));

                let classes = '';
                if (isHoliday) classes += 'holiday ';
                if (isWorkDay) classes += 'work-day ';
                if ([5, 6].includes(i)) classes += 'weekend ';

                table += `<td class="${classes.trim()}">${currentDay}</td>`;
                currentDay++;
            }
        }
        table += '</tr>';
        weekNum++;
    }

    table += '</tbody></table>';
    return table;
}

const monthToNumber = (monthName) => {
    switch (monthName.toLowerCase()) {
        case 'январь': return '01'; break;
        case 'февраль': return '02'; break;
        case 'март': return '03'; break;
        case 'апрель': return '04'; break;
        case 'май': return '05'; break;
        case 'июнь': return '06'; break;
        case 'июль': return '07'; break;
        case 'август': return '08'; break;
        case 'сентябрь': return '09'; break;
        case 'октябрь': return '10'; break;
        case 'ноябрь': return '11'; break;
        case 'декабрь': return '12'; break;
        default: throw new Error('Недопустимый месяц.');
    }
};

Date.prototype.getLastDayOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth()+1, 0).getDate();
};