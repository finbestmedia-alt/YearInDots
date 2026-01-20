document.addEventListener('DOMContentLoaded', () => {
    init();
});

const elements = {
    grid: document.getElementById('year-grid'),
    daysRemaining: document.getElementById('days-remaining'),
    percentCompleted: document.getElementById('percent-completed'),
    settingsTrigger: document.getElementById('settings-trigger'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettings: document.getElementById('close-settings'),
    radioButtons: document.querySelectorAll('input[name="today-style"]')
};

let currentState = {
    todayStyle: localStorage.getItem('todayStyle') || 'orange'
};

function init() {
    setupSettings();
    render();
}

function render() {
    const now = new Date();
    const year = now.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDays = isLeap ? 366 : 365;

    // Calculate Day of Year
    const start = new Date(year, 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Update Stats
    const daysRemaining = totalDays - dayOfYear;
    const percent = ((dayOfYear / totalDays) * 100).toFixed(1);

    elements.daysRemaining.textContent = `${daysRemaining} Days Remaining`;
    elements.percentCompleted.textContent = `${percent}% Completed`;

    // Render Grid
    elements.grid.innerHTML = '';

    for (let i = 1; i <= totalDays; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');

        if (i < dayOfYear) {
            dot.classList.add('completed');
            dot.title = `Day ${i} (Completed)`;
        } else if (i === dayOfYear) {
            dot.classList.add('today');
            dot.classList.add(currentState.todayStyle);
            dot.title = `Day ${i} (Today)`;

            if (currentState.todayStyle === 'hourglass') {
                dot.textContent = '⏳';
            }
        } else {
            dot.title = `Day ${i}`;
        }

        elements.grid.appendChild(dot);
    }
}

function setupSettings() {
    // Sync UI with state
    const currentRadio = document.querySelector(`input[value="${currentState.todayStyle}"]`);
    if (currentRadio) currentRadio.checked = true;

    // Open Modal
    elements.settingsTrigger.addEventListener('click', () => {
        elements.settingsModal.classList.add('active');
    });

    // Close Modal and Save
    elements.closeSettings.addEventListener('click', () => {
        elements.settingsModal.classList.remove('active');
        // Just in case it wasn't caught by change event, mainly for ux closing
    });

    // Close on click outside
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) {
            elements.settingsModal.classList.remove('active');
        }
    });

    // Radio Changes
    elements.radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                currentState.todayStyle = e.target.value;
                localStorage.setItem('todayStyle', currentState.todayStyle);
                render(); // Re-render to apply style immediately
            }
        });
    });
}
