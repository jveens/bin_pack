const app = {};

app.init = function(){
	app.sliders.forEach(slide => {
		slide.addEventListener('mousemove', app.updateValues);
		slide.addEventListener('change', app.updateValues);
	});

	app.gridSetup.addEventListener('submit', function(event){
		event.preventDefault();	
		app.brickster(app.bricks, app.cols, true);
	});

	app.brickster(app.bricks, app.cols, false);

	window.addEventListener('resize', function(event){

		clearTimeout(app.resizeTimer);
		app.resizeTimer = setTimeout(function() {

			// Run code here, resizing has "stopped"
			app.resizeGrid();
		        
		}, 500);

	});
}

// app.grid = document.querySelector('#grid');
app.sliders = document.querySelectorAll('input[type="range"]');
app.gridSetup = document.querySelector('#grid-setup');
app.body = document.querySelector('body');
app.bricks = document.querySelector('#bricks').value;
app.cols = document.querySelector('#cols').value;
app.gutters = document.querySelector('#gutters').value;
app.placedBlocks = [];
app.gridItemLength = 0;
app.currentColumns;
app.resizeTime;

app.parts = [
	{
		height: 2,
		width: 2,
		className: 'two-two'
	},
	{
		height: 1,
		width: 1,
		className: 'one-one'
	},
	{
		height: 2,
		width: 1,
		className: 'two-one'
	},
	{
		height: 1,
		width: 2,
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

app.brickster = function(number, columns, clear) {

	const blocks = app.getBlocks(number);
	const completedRows = [];
	const grid = document.querySelector('#grid');
	let currentRow = 0;
	let nextRow = 0;
	let gridDimensions = false;
	let changed = false;
	app.currentColumns = columns;

	grid.innerHTML = '';
	app.placedBlocks = [];

	function getNewRow(){

		let newRow = [];

		for (let i = 0; i < columns; i++){
			newRow.push(0);
		}

		return newRow;
	}


	function createDOMItem(block){

		const gridItem = document.createElement('div');
		gridItem.classList.add(block.className, 'grid-item');
		gridItem.style.width = ((100 / columns) * block.width ) + '%';
		gridItem.setAttribute('data-width', block.width);
		gridItem.setAttribute('data-height', block.height);

		return gridItem;
	}


	let currentRowSpaces = getNewRow(columns);
	let nextRowSpaces = getNewRow(columns);
	let nextNextRowSpaces = getNewRow(columns);


	function updateRows(columns) {

		completedRows.push(currentRow);
		currentRow = nextRow;
		nextRow = 0;

		currentRowSpaces = nextRowSpaces;
		nextRowSpaces = nextNextRowSpaces;
		nextNextRowSpaces = getNewRow(columns);

	}

	function setInitialGrid(block) {

		const gridItem = createDOMItem(block);

		gridDimensions = true;

		gridItem.setAttribute('offset-x', 0);
		gridItem.setAttribute('offset-y', 0);

		app.placedBlocks.push(gridItem);

		gridItem.style.top = 0;
		gridItem.style.left = 0;

		grid.appendChild(gridItem);

		// Grid is square-based, we only need length of 1 side
		app.gridItemLength = gridItem.offsetWidth / block.width;

	};

	function brickLayer(gridItem, itemPosition) {

		gridItem.setAttribute('offset-x', itemPosition);
		gridItem.setAttribute('offset-y', completedRows.length);

		gridItem.style.top = completedRows.length * app.gridItemLength + 'px';
		gridItem.style.left = itemPosition * app.gridItemLength + 'px';

		app.placedBlocks.push(gridItem);

		grid.appendChild(gridItem);

	}

	function setRowSpaces(block, itemOffset) {

		if (block.width > 1) {
			currentRowSpaces[itemOffset + 1] = 1;
		}

		if (block.height > 1) {
			nextRowSpaces[itemOffset] = 1;
			nextRow = nextRow + block.width;

			if (block.width > 1) {
				nextRowSpaces[itemOffset + 1] = 1;
			}
		}

		currentRowSpaces[itemOffset] = 1;
		currentRow = currentRow + block.width;


	}

	function fitOrSkip(gridItem, block, index) {

		// check where we can place it, it will be a '0' in our currentRow array
		let itemPosition = currentRowSpaces.indexOf(0);

		if ( block.width === 1 ) {

			brickLayer(gridItem, itemPosition);

			setRowSpaces(block, itemPosition);

			blocks.shift();

		} else if (block.width > 1 && currentRowSpaces[itemPosition + 1] != 1 && currentRowSpaces[itemPosition] != currentRowSpaces.length - 1) {

			brickLayer(gridItem, itemPosition);

			setRowSpaces(block, itemPosition);

			// blocks.splice(index, 1);
			blocks.splice(index, 1);

		} else if (changed){

			changed = !changed;

		} else {
			updateRows();
		}

	}

	function fitBricks( blocks ) {

		if ( blocks.length > 0 ) {

			blocks.forEach((block, index) => {

				// if out currentRow value is equal to our cols, it means it's full!
				// consider moving this to a reduce
				if (currentRow == columns) {

					updateRows();

				}

				const gridItem = createDOMItem(block);

				if ( gridDimensions && ( currentRow + block.width <= columns ) ) {
					
					changed = true;

					fitOrSkip(gridItem, block, index);

				} 

				if ( !gridDimensions && index === 0 ) {

					setInitialGrid(block);

					setRowSpaces(block, currentRow);

					blocks.splice(index, 1);
					
				}

			}); // end blocks.foreach
			
		} // end block.length check

		// use flag to check if we have done a whole loop without placing a single brick - if so, get out
		if ( !changed ) {
			updateRows();
		}

		// set grid container height based on completed rows 
		grid.style.height = (completedRows.length + 2) * app.gridItemLength + 'px';
		return blocks;

	}

	while( blocks.length > 1 ) {

		fitBricks(blocks);

	}

}

app.updateValues = function(){

	app.bricks = document.querySelector('#bricks').value;
	app.cols = document.querySelector('#cols').value;
	app.gutters = document.querySelector('#gutters').value;

	const output = document.querySelector(`output[for="${this.id}"]`);
	output.innerHTML = this.id === 'gutters' ? this.value + 'px' : this.value;
}

app.resizeGrid = function(){

	// we need to get our new grid length after resize
	const item = app.placedBlocks[0];
	const itemX = item.getAttribute('data-width');
	let newGridLength = item.offsetWidth / itemX;

	app.placedBlocks.forEach( (item, i) => {

		let offsetX = parseInt(item.getAttribute('offset-x'));
		let offsetY = parseInt(item.getAttribute('offset-y'));


		if (offsetX != 0){
			item.style.left = (newGridLength * offsetX) + 'px';
		}

		if (offsetY != 0){
			item.style.top = (newGridLength * offsetY) + 'px';
		}
	});

	app.gridItemLength = newGridLength;
}

document.addEventListener("DOMContentLoaded", function() {
  app.init();
});