// JavaScript
async function getDashboardData(url = '/data.json') {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const DashboardItem = (data, container = '.dashboard__content', view = 'weekly') => {
    const PERIODS = {
        daily: 'day',
        weekly: 'week',
        monthly: 'month',
    };

    const createMarkup = () => {
        const { title, timeframes } = data;
        const id = title.toLowerCase().replace(/ /g, '-');
        const { current, previous } = timeframes[view.toLowerCase()];

        container.insertAdjacentHTML('beforeend', `
            <div class="dashboard__item dashboard__item--${id}">
                <article class="tracking-card">
                    <header class="tracking-card__header">
                        <h4 class="tracking-card__title">${title}</h4>
                        <img class="tracking-card__menu" src="images/icon-ellipsis.svg" alt="menu">
                    </header>
                    <div class="tracking-card__body">
                        <div class="tracking-card__time">
                            ${current}hrs
                        </div>
                        <div class="tracking-card__prev-period">
                            Last ${PERIODS[view]} - ${previous}hrs
                        </div>
                    </div>
                </article>
            </div>
        `);

        return {
            time: container.querySelector(`.dashboard__item--${id} .tracking-card__time`),
            prev: container.querySelector(`.dashboard__item--${id} .tracking-card__prev-period`),
        };
    };

    const changeView = (newView) => {
        view = newView.toLowerCase();
        const { current, previous } = data.timeframes[view.toLowerCase()];
        markup.time.innerText = `${current}hrs`;
        markup.prev.innerText = `Last ${PERIODS[view]} - ${previous}hrs`;
    };

    const markup = createMarkup();

    return { changeView };
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.dashboard__content');

    getDashboardData().then(data => {
        const activities = data.map(activity => DashboardItem(activity, container));

        const viewSelector = document.querySelector('.view-selector');
        viewSelector.addEventListener('click', (event) => {
            if (event.target.classList.contains('view-selector__item')) {
                const currentView = event.target.innerText.trim().toLowerCase();
                activities.forEach(activity => activity.changeView(currentView));
                viewSelector.querySelectorAll('.view-selector__item')
                    .forEach(selector => selector.classList.remove('view-selector__item--active'));
                event.target.classList.add('view-selector__item--active');
            }
        });
    });
});
