import * as actions from '../actions';


export default class Util {

	constructor(store)
	{
		this.store = store;
	}

	/**
	 * Toggle side
	 *
	 * @param {Boolean|undefined} sw
	 */
	toggleSide(sw=undefined)
	{
		try {
			const currentSw = this.store.getState().tree.side.visible;
			const targetSw = (typeof sw === 'undefined') ? !currentSw : sw;

			this.store.dispatch(actions.side.visible(targetSw));
		} catch(e) {
			console.warn('Error action', e)
		}
	};

	/**
	 * export
	 *
	 * @param {String} type
	 * @return {Array|Object}
	 */
	export(type=null)
	{
		if (!type) return null;

		const state = this.store.getState();

		function side()
		{
			let keys = state.api.side.getKeys('all');
			return state.api.side.getImages(keys);
		}
		function grid()
		{
			let result = state.api.grid.getBlocks('all');
			return Object.keys(result).sort().map(o => {
				delete result[o].indexPrefix;
				return result[o];
			});
		}
		function preference()
		{
			return state.api.grid.getPreference();
		}

		switch(type)
		{
			case 'side':
				return side();
			case 'grid':
				return grid();
			case 'preference':
				return state.api.grid.getPreference();
			case 'all':
				return {
					side: side(),
					grid: grid(),
					preference: preference(),
				};
				break;
		}

		return null;
	}

	/**
	 * import
	 *
	 * @param {String} type
	 * @param {Array|Object} value
	 * @param {Boolean} replace
	 */
	import(type=null, value=null, replace=false)
	{
		if (!(type && value)) return;

		const state = this.store.getState();

		function side(value=null)
		{
			if (replace) state.api.side.clear();
			state.api.side.add(value);
		}
		function grid(value=null)
		{
			if (replace)
			{
				let keys = state.api.grid.getKeys('all');
				state.api.grid.remove(keys);
			}
			state.api.grid.add(value);
		}

		switch(type)
		{
			case 'side':
				side(value);
				break;
			case 'grid':
				grid(value);
				break;
			case 'preference':
				state.api.grid.setPreference(value);
				break;
			case 'all':
				side(value.side);
				grid(value.grid);
				state.api.grid.setPreference(value.preference);
				break;
		}
	}

	/**
	 * make image
	 *
	 */
	makeImage()
	{
		console.log('play make image');
		// TODO : parameter (format, sampling, quality, callback)
	}

}