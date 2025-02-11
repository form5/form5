import _reduce from 'lodash-es/reduce.js';
import { clsx } from 'clsx';
import { memo, useRef } from 'react';

import composeData, {
	FIELD_TAGS,
} from '@form5/utils/composeData';
import deepDiff from '@form5/utils/deepDiff';
import { useInteractiveStates } from '../use-interactive-states/use-interactive-states.js';

import styles from './Form.module.css';


export { styles as formClasses };

/**
 * @typedef {import('react')} React
 */

/**
 * @typedef {import('@form5/utils/composeData').ComposedData} ComposedData
 */
/**
 * @typedef {React.FormEvent<HTMLFormElement>} SubmitEvent
 */
/**
 * @typedef {React.FormEvent<HTMLFormElement>} ResetEvent
 */
/**
 * @typedef {<D extends ComposedData>(delta: Partial<D>, all: D, event: SubmitEvent) => void} OnSubmit
 * @param delta The difference between the initial values and the current values
 * @param all The same shape, but containing the full current values
 * @param event The original submit event
 * @returns {void}
 */
/**
 * @typedef {React.MutableRefObject<ComposedData>} Values
 */
/**
 * @typedef {object} FormOwnProps
 * @property {(isDirty: true) => void} [FormOwnProps.onDirty]
 * @property {(isDirty: false) => void} [FormOwnProps.onPristine]
 * @property {OnSubmit} FormOwnProps.onSubmit
 */
/**
 *
 * @param {FormOwnProps & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>} props
 */
export function Form({
	children,
	className,
	onDirty,
	onPristine,
	...props
}) {
	const formElm = useRef(/** @type {HTMLFormElement} */ (null));
	const initValues = useRef(/** @type {ComposedData} */ (null)); // `useRef` to avoid needless re-renders
	const {
		pristine,
		touched,
		...is
	} = useInteractiveStates({ onDirty, onPristine });

	// form needs an `id` for buttons that live outside it in the DOM: `<button form={form.id}>`
	props.id ||= props.name;

	return (
		<form
			{...props}
			className={clsx(styles.Form, className)}
			noValidate
			onBlur={(e) => {
				// We only care when the blur bubbled from a field
				if (e.target.form === formElm.current) is.onBlur(e);
			}}
			onChange={is.onChange}
			onReset={(e) => {
				props.onReset?.(e);
				// After everything has succeeded
				initValues.current = { __proto__: null };
				is.onSubmit();
			}}
			onSubmit={(e) => {
				onSubmit(e, initValues, props.onSubmit);
				// After everything has succeeded
				is.onSubmit(e);
			}}
			ref={(el) => {
				setup(el, initValues);
				formElm.current = el;
			}}
			pristine={pristine}
			touched={touched}
		>
			{children}
		</form>
	);
}

Form.FIELD_TAGS = FIELD_TAGS;

Form.displayName = /** @type {const} */ ('Form5Form');

export default memo(Form);

/**
 * @internal Exported for testing
 * @param {SubmitEvent} event
 * @param {Values} initValues
 * @param {OnSubmit} cb
 * @returns void
 */
export function onSubmit(event, initValues, cb) {
	event.preventDefault();

	if (!event.target.reportValidity()) return;

	event.stopPropagation();

	const all = _reduce(
		Array.from(event.target.elements),
		composeData,
		{ __proto__: null },
	);

	const delta = deepDiff(initValues.current, all);

	if (!Object.keys(delta).length) return;

	initValues.current = all; // reset starting values for potential subsequent submit

	return cb(delta, all, event);
}

/**
 * @internal Exported for testing
 * @param {HTMLFormElement} formElement
 * @param {Values} initValues
 */
export function setup(formElement, initValues) {
	if (!formElement || initValues.current) return;

	initValues.current = _reduce(
		Array.from(formElement.elements),
		composeData,
		{ __proto__: null },
	);
};
