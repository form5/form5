import { useState } from 'react';


/**
 * @typedef {import('../../types.d.ts').FormFieldElement} FormFieldElement
 * @typedef {''|null} BooleanAttribute
 */

/**
 * @param {object} [handlers]
 * @param {(isDirty: true) => void} [handlers.onDirty]
 * @param {(isDirty: false) => void} [handlers.onPristine]
 * @returns A collection of event handlers and states (whose values are either an empty string when
 * true, or `null` when false—because React).
 */
export function useInteractiveStates({
	onDirty,
	onPristine,
} = {}) {
	const [pristine, setPristine] = useState(/** @type {BooleanAttribute} */ (''));
	const [touched, setTouched] = useState(/** @type {BooleanAttribute} */ (null));

	/**
	 * @type {React.FocusEventHandler<FormFieldElement>}
	 */
	const onBlur = (e) => {
		if (touched !== '') { setTouched('') }
	};
	/**
	 * @type {React.ChangeEventHandler<FormFieldElement>}
	 */
	const onChange = () => {
		if (touched !== '') { setTouched('') }
		if (pristine !== null) {
			setPristine(null);
			onDirty?.(true);
		}
	};
	/**
	 * @type {React.FormEventHandler<FormFieldElement>}
	 */
	const onInvalid = () => {
		if (touched !== '') { setTouched('') }
	};
	/**
	 * @type {React.FormEventHandler}
	 */
	const onSubmit = () => {
		setTouched(null);
		setPristine('');
		onPristine?.(false);
	};

	return {
		onBlur,
		onChange,
		onInvalid,
		onSubmit,
		pristine,
		touched,
	};
}
