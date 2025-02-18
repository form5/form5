import { clsx } from 'clsx';
import _isEmpty from 'lodash-es/isEmpty.js';
import _map from 'lodash-es/map.js';
import { useState } from 'react';

import { useInteractiveStates } from '../use-interactive-states/use-interactive-states.js';

import Button from '../Button/Button.jsx';
import buttonStyles from '../Button/Button.module.css';

import styles from './Field.module.css';


export { styles as inputClasses };

/**
 * @typedef {import('react')} React
 * @typedef {import('../../types.d.ts').FormFieldElement} FormFieldElement
 */

/**
 * @typedef {object} FieldOwnProps
 * @property {import('../Button/Button.jsx').Appearance} [FieldOwnProps.appearance=Button.APPEARANCES.PRIMARY]
 * @property {Arrangement} [FieldOwnProps.arrangement=Field.ARRANGEMENTS.INLINE]
 * @property {'input'|'select'|'textarea'} [FieldOwnProps.as='input'] The element to render.
 * @property {boolean} [FieldOwnProps.fluid] Whether the field should fill its container.
 * @property {React.ReactNode} FieldOwnProps.label
 * @property {HTMLInputElement['name']} FieldOwnProps.name
 * @property {(event: React.FocusEvent<FormFieldElement>) => void} [FieldOwnProps.onBlur]
 * @property {(change: { id: string, name: string, value: boolean | number | string }, event: React.ChangeEvent<FormFieldElement>) => void} [FieldOwnProps.onChange]
 * @property {Record<HTMLOptionElement['value'], React.ReactNode>} [FieldOwnProps.options]
 * @property {boolean} [FieldOwnProps.readOnly]
 * @property {Variant} [FieldOwnProps.variant]
 */

/** @typedef {FieldOwnProps & Omit<FormFieldElement, 'onChange'>} FieldProps<> */

/**
	* @typedef {FieldOwnProps['as'] extends 'input'
  *   ? HTMLInputElement
  *   : FieldOwnProps['as'] extends 'select'
  *     ? HTMLSelectElement
  *     : HTMLTextAreaElement
  * } FieldElement
  */

/**
 * @param {FieldProps} props
 */
export default function Field({
	appearance = Button.APPEARANCES.PRIMARY,
	arrangement = Field.ARRANGEMENTS.INLINE,
	as: Tag = 'input',
	className,
	fluid,
	id,
	label,
	name,
	onBlur,
	onChange,
	options,
	readOnly,
	required,
	type = 'text',
	variant,
	...others
}) {
	const [error, setError] = useState('');
	const {
		pristine,
		touched,
		...is
	} = useInteractiveStates();
	const isInvalid = !!error;

	id ||= name;

	const props = {
		...others,
		...(options && { list: `${name}_options` }),
		...(Tag === 'textarea' && !('rows' in others) && { rows: 3 }),
		...(Tag !== 'input' && { type: null }),
		...(type === 'search' && !('fluid' in others) && { fluid: true }),
		...(others.value === null && { value: '' }), // React has a tantrum when `value` is `null`
		/** @type {React.FocusEventHandler<FormFieldElement>} */
		onBlur(e) {
			if (readOnly) return;

			is.onBlur(e);

			onBlur?.(e);

			if (e.target.checkValidity()) setError('');
		},
		/** @type {React.ChangeEventHandler<FieldElement>} */
		onChange(e) {
			if (readOnly) {
				// ! Contrary to what anyone would want, `readonly` does NOT affect checkboxes or radio buttons
				// ! because `readonly` prevents `value` being changed, they use `checked` not  `value`.
				e.preventDefault();
				// These stop*Propagations are necessary to prevent <Form> pristine/touched being updated
				e.stopPropagation(); // Prevent other handlers registered via React being called
				e.nativeEvent.stopImmediatePropagation(); // Prevent other handlers registered not via React being called
				return;
			}

			is.onChange(e);

			let {
				checked,
				id,
				name,
				type,
			} = e.target;
			const value = type === 'checkbox'
				? checked
				: ''+(options?.[e.target.value] ?? e.target.value);

			onChange?.({
				id,
				name,
				value,
			}, e);

			if (isInvalid && e.target.checkValidity()) setError('');
		},
	};

	const isButton = buttonVariants.has(variant);
	const isSwitch = switchTypes.has(type);
	const isSearch = type === "search";

	if (isSearch) arrangement = Field.ARRANGEMENTS.COMPACT;

	return (
		<div
			arrangement={arrangement}
			className={clsx(
				styles.FieldContainer,
				{
					[styles.Fluid]: fluid,
					[buttonStyles.Button]: isButton,
				},
			)}
			pristine={pristine}
			switch={isSwitch ? '' : null}
			touched={touched}
			{...isButton && {
				variant,
			}}
		>
			<Tag
				className={clsx(styles.Field, className)}
				name={name}
				id={id}
				onInvalid={(e) => {
					e.nativeEvent.stopImmediatePropagation();
					setError(e.target.validationMessage);
					is.onInvalid(e);
				}}
				readOnly={readOnly}
				required={required}
				type={type}
				variant={variant}
				{...props}
			/>

			{isSearch && (
				<>
					<Button
						appearance={Button.APPEARANCES.BASIC}
						className={styles.SearchSubmit}
						disabled={props.disabled}
						readOnly={readOnly}
						type={Button.TYPES.SUBMIT}
						variant={Button.VARIANTS.GLYPH}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" style={{ height: "0.8em" }}><path d="M6.663 0C2.991 0 0 2.991 0 6.663s2.991 6.663 6.663 6.663a6.628 6.628 0 0 0 4.213-1.508l3.978 3.979a.667.667 0 1 0 .943-.943l-3.978-3.978a6.628 6.628 0 0 0 1.507-4.213C13.326 2.991 10.336 0 6.663 0Zm0 1.333a5.32 5.32 0 0 1 5.33 5.33 5.32 5.32 0 0 1-5.33 5.33 5.32 5.32 0 0 1-5.33-5.33 5.32 5.32 0 0 1 5.33-5.33Z"/></svg>
					</Button>

					<Button
						appearance={Button.APPEARANCES.BASIC}
						className={styles.SearchReset}
						disabled={props.disabled}
						readOnly={readOnly}
						type={Button.TYPES.RESET}
						variant={Button.VARIANTS.GLYPH}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" style={{ height: "0.8em" }}><path d="M13.162 2.326a.5.5 0 0 0-.349.154L8 7.293 3.187 2.48a.5.5 0 1 0-.707.707L7.293 8 2.48 12.813a.499.499 0 1 0 .707.707L8 8.707l4.813 4.813a.5.5 0 1 0 .707-.707L8.707 8l4.813-4.813a.5.5 0 0 0-.358-.86Z"/></svg>
					</Button>
				</>
			)}

			{(!!label || isInvalid) && (
				<div className={styles.InnerWrapper}>
					{!!label && (
						<label
							className={clsx(styles.Label, {
								[buttonStyles.Button]: isButton,
							})}
							htmlFor={id}
							{...isButton && {
								appearance,
								variant,
							}}
						>
							{label}
						</label>
					)}

					{isInvalid && (
						<dialog
							className={styles.Error}
							data-testid="field-error"
							open
						>
							{error}
						</dialog>
					)}
				</div>
			)}

			{!_isEmpty(options) && (
				<datalist data-testid={props.list} id={props.list}>{_map(options, (label, key) => (
					<option key={key} value={key}>{label}</option>
				))}</datalist>
			)}
		</div>
	);
};

Field.displayName = /** @type {const} */ ('Form5Field');

/**
 * @typedef {typeof Field.ARRANGEMENTS[keyof typeof Field.ARRANGEMENTS]} Arrangement
 */
Field.ARRANGEMENTS = /** @type {const} */ ({
	COMPACT: 'compact',
	INLINE: 'inline',
	STACKED: 'stacked',
	STAND_ALONE: 'stand-alone',
});
/**
 * @typedef {typeof Field.VARIANTS[keyof typeof Field.VARIANTS]} Variant
 */
Field.VARIANTS = /** @type {const} */ ({
	CTA: Button.VARIANTS.CTA,
	GLYPH: Button.VARIANTS.GLYPH,
	TOGGLE: 'toggle',
});

const dtTypes = new Set([
	'date',
	'datetime',
	'datetime-local',
	'time',
]);

const buttonVariants = new Set([
	Field.VARIANTS.CTA,
	Field.VARIANTS.GLYPH,
]);

const switchTypes = new Set([
	'checkbox',
	'color',
	'radio',
]);
