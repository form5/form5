import _keys from 'lodash-es/keys.js';
import _isArray from 'lodash-es/isArray.js';
import _isEmpty from 'lodash-es/isEmpty.js';
import _isObject from 'lodash-es/isObject.js';


/**
 * @typedef {import('../types.d.ts').ComposedData} ComposedData
 */
/**
 * @param {*} oldVals
 * @param {*} newVals
 * @param {Record<string, any>} delta
 * @returns {ComposedData | Array<number | string>} The delta—the difference between old and new. When an old field is absent
 * in new, the old field is set to `null`.
 */
export default function deepDiff(oldVals, newVals, delta = { __proto__: null }) {
	if (_isArray(oldVals) || _isArray(newVals)) {
		if (''+newVals === ''+oldVals) return; // cheaply check same values without considering order
		if (typeof newVals !== 'undefined') return newVals; // don't iterate values (just accept new)
		return [];
	}

	if (
		!_isObject(newVals)
		|| newVals instanceof FileList
		|| newVals instanceof File
	) {
		if (newVals === oldVals) return;
		if (typeof newVals !== 'undefined') return newVals; // don't iterate values (just accept new)
		return null;
	}

	const oldKeys = _keys(oldVals).sort();
	const newKeys = _keys(newVals).sort();

	for (const newKey of newKeys) {
		const newVal = newVals[newKey];
		const oK = oldKeys.indexOf(newKey);
		const oldVal = oldVals[newKey];

		if (isEmptyValue(oldVal)) {
			if (!isEmptyValue(newVal)) { // empty before but has a value now, so take whatever the new is
				delta[newKey] = newVal;
			} // else: empty before and now, so exclude
		} else {
			const val = deepDiff(oldVal, newVal, delta[newKey]);

			if (
				typeof val !== 'undefined'
				&& !_isObject(val)
				|| _isArray(val)
				|| !_isEmpty(val)
			) {
				delta[newKey] = val;
			}
		}

		oldKeys.splice(oK, 1); // remove from list to know below whether to set empty vals
	}

	// if any old keys are left, set them to empty values
	for (const oldKey of oldKeys) {
		const oldVal = oldVals[oldKey];

		delta[oldKey] = deepDiff(oldVal);
	}

	return delta;
}

function isEmptyValue(val) {
	return typeof val === 'undefined' || val === '';
}
