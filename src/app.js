async function getDashboarddata(url = "/data.json") {
	const response = await fetch(url);
	const data = response.json();
	return data;
}

class DashboardItem {
	static PERIODS = {
		daily: "day",
		weekly: "week",
		monthly: "mounth",
	};
	constructor(data, container = ".dashboard__content", view = "weekly") {
		this.data = data;
		this.container = document.querySelector(container);
		this.view = view;

		this.createMarcup();
	}

	createMarcup() {
		const { title, timeframes } = this.data;
		const { current, previous } = timeframes[this.view.toLocaleLowerCase()];

		const id = title.toLocaleLowerCase().replace(/ /g, "-");

		this.container.insertAdjacentHTML(
			"beforeend",
			`
        <div class="dashboard__item dashboard__item--${id}">
					<article class="tracking-card">
						<header class="tracking-card__header">
							<h4 class="tracking-card__title">${title}</h4>
							<img
								src="/images/icon-ellipsis.svg"
								alt="menu"
								class="tracking-card__menu"
							/>
						</header>
						<div class="tracking-card__body">
							<div class="tracking-card__time">${current}hrs</div>
							<div class="tracking-card__prev-period">
								Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs
							</div>
						</div>
					</article>
				</div>
        `
		);

		this.time = this.container.querySelector(
			`.dashboard__item--${id} .tracking-card__time`
		);

		this.prev = this.container.querySelector(
			`.dashboard__item--${id} .tracking-card__prev-period`
		);
	}

	changeView(view) {
		this.view = view.toLocaleLowerCase();
		const { current, previous } =
			this.data.timeframes[this.view.toLocaleLowerCase()];

		this.time.innerText = `${current}hrs`;
		this.prev.innerText = `Last ${
			DashboardItem.PERIODS[this.view]
		} - ${previous}hrs`;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	getDashboarddata().then(data => {
		const activites = data.map(el => new DashboardItem(el));

		const selectors = document.querySelectorAll(".view-selector__item");

		selectors.forEach(selector => {
			selector.addEventListener("click", function () {
				selectors.forEach(el =>
					el.classList.remove("view-selector__item--active")
				);
				selector.classList.add("view-selector__item--active");

				const currentView = selector.innerText
					.trim()
					.toLocaleLowerCase();

				console.log(currentView);

				activites.forEach(card => card.changeView(currentView));
			});
		});
	});
});
