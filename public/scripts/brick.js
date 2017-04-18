const app = {};

app.grid = document.querySelector('#grid');
app.sliders = document.querySelectorAll('input[type="range"]');
app.gridSetup = document.querySelector('#grid-setup');
app.body = document.querySelector('body');

const trigger = document.querySelector('[data-trigger-more]');

app.bricks = document.querySelector('#bricks').value;
app.cols = document.querySelector('#cols').value;
app.gutters = document.querySelector('#gutters').value;

app.parts = [
	{
		width: 2,
		height: 2,
		className: 'two-two'
	},
	{
		width: 1,
		height: 1,
		className: 'one-one'
	},
	{
		width: 2,
		height: 1,
		className: 'two-one'
	},
	{
		width: 1,
		height: 2,
		className: 'one-two'
	}
];

app.getBlocks = function(number){
	
	const blocks = [];

	for (let i = 0; i <= number; i++) {
		let rand = Math.floor(Math.random()*app.parts.length);

		blocks.push( app.parts[rand]);
	}

	return blocks;
}

app.brickster = function(number, columns, gutters, clear) {

	var blocks = app.getBlocks(number);

	if (clear) {
		grid.innerHTML = '';
	}
	
	app.grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
	app.grid.style.gridColumnGap = `${gutters}px`;
	app.grid.style.gridRowGap = `${gutters}px`;
	app.body.style.padding = `${gutters}px`;

	blocks.forEach(block => {
		const gridItem = document.createElement('div');
		gridItem.classList.add(block.className, 'grid-item');

		grid.appendChild(gridItem);
	});
}

app.updateValues = function(){

	app.bricks = document.querySelector('#bricks').value;
	app.cols = document.querySelector('#cols').value;
	app.gutters = document.querySelector('#gutters').value;

	const output = document.querySelector(`output[for="${this.id}"]`);
	output.innerHTML = this.id === 'gutters' ? this.value + 'px' : this.value;
}

app.sliders.forEach(slide => {
	slide.addEventListener('mousemove', app.updateValues);
	slide.addEventListener('change', app.updateValues);
});

app.gridSetup.addEventListener('submit', function(event){
	event.preventDefault();
	console.log( app.bricks, app.cols, app.gutters );
	app.brickster(app.bricks, app.cols, app.gutters, true);
});

trigger.addEventListener('click', function(event){
	event.preventDefault();
	app.brickster(app.bricks, app.cols, app.gutters, false);
});

app.brickster(app.bricks, app.cols, app.gutters, false);