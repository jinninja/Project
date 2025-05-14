// calendar.js
window.addEventListener('DOMContentLoaded', async () => {
    const outputContainer = document.getElementById('calendar-output');
    const select = document.getElementById('month-select');
    const linkForm = document.getElementById('link-form');
    const linkInput = document.getElementById('link-input');
    const saveLinkButton = document.getElementById('save-link');

    // Асинхронная загрузка JSON файла
    const response = await fetch('calendar.json');
    const data = await response.json();

    // Обработчик смены месяца
    select.addEventListener('change', () => {
        const selectedMonth = select.value;
        if (selectedMonth !== '') {
            const monthData = data.months.find(m => m.month === selectedMonth);
            renderMonth(monthData);
        } else {
            outputContainer.innerHTML = ''; // Очищаем контейнер, если ничего не выбрано
        }
    });

    // Изначально покажем январь
    const januaryData = data.months.find(m => m.month === 'Январь');
    renderMonth(januaryData);
    outputContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'TD') {
            const day = event.target.textContent;
            const month = select.value;
            const year = '2025';
            const date = `${year}-${monthToNumber(month)}-${day}`;

            // Показываем форму для ввода ссылки
            linkForm.style.display = 'block';
            linkInput.value = '';

            // Сохраняем выбранную дату
            saveLinkButton.addEventListener('click', () => {
                const link = linkInput.value;
                if (link) {
                    event.target.innerHTML = `<a href="${link}" target="_blank" class="link">${day}</a>`;
                    linkForm.style.display = 'none';
                }
            });
            document.getElementById("mytext").value = event;
        }
    });
});

// Рендеринг календаря конкретного месяца
function renderMonth(monthData) {
    const outputContainer = document.getElementById('calendar-output');
    outputContainer.innerHTML = ''; // очищаем предыдущую версию календаря

    const monthHeader = `<h2>${monthData.month}</h2>`;
    outputContainer.innerHTML += monthHeader;

    // Создание таблицы
    const tableHtml = generateMonthTable(monthData);
    outputContainer.innerHTML += tableHtml;
}

// Генерация таблицы конкретного месяца
function generateMonthTable(monthData) {
    const totalDays = new Date(`${monthData.month}, 2025`).getLastDayOfMonth();
    const firstDay = new Date(`2025-${monthToNumber(monthData.month)}-01`).getDay(); // Здесь возвращаемся к стандартной схеме расчета дня недели

    // Шаблон для календаря
    let table = '<table>';
    table += '<thead><tr>' +
              '<th>Пон.</th>' +
              '<th>Вт.</th>' +
              '<th>Срд.</th>' +
              '<th>Чтв.</th>' +
              '<th>Птн.</th>' +
              '<th>Суб.</th>' +
              '<th>Вос.</th></tr></thead>';

    table += '<tbody>';

    // Массив рабочих дней и праздников
    const workDays = monthData.days.split(',');
    const holidays = monthData.holidays.split(',');

    // Начало заполнения календаря
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
                if ([5, 6].includes(i)) classes += 'weekend '; // Суббота и воскресенье считаются выходными!

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

// Преобразование имени месяца в числовой эквивалент
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

// Расширяем объект Date методом для определения последнего дня месяца
Date.prototype.getLastDayOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth()+1, 0).getDate();
};