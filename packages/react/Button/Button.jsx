import { clsx } from 'clsx';

import Group from '../Group/Group.jsx';

import styles from './Button.module.css';


export { styles as buttonClasses };

/**
 * @typedef {typeof import('react')} React
 */

/**
 * @typedef {object} ButtonOwnProps
 * @property {Appearance} [ButtonOwnProps.appearance=Button.APPEARANCES.PRIMARY]
 * @property {boolean} [ButtonOwnProps.disabled]
 * @property {React.ReactNode} [ButtonOwnProps.children]
 * @property {boolean} [ButtonOwnProps.fluid=false]
 * @property {boolean} [ButtonOwnProps.readOnly=false]
 * @property {HTMLButtonElement['type']} [ButtonOwnProps.type=Button.TYPES.BUTTON]
 * @property {Variant} [ButtonOwnProps.variant=Button.VARIANTS.CTA]
 */

/**
 * @param {ButtonOwnProps & React.BaseHTMLAttributes} props
 */
export default function Button({
	appearance = Button.APPEARANCES.PRIMARY,
	children: label,
	className,
	fluid,
	type = Button.TYPES.BUTTON,
	variant = Button.VARIANTS.CTA,
	...others
}) {
	Object.assign(others, { appearance, type, variant });
	return (
		<button
			{...others}
			className={clsx(
				styles.Button,
				className,
				{
					[styles.fluid]: fluid,
				},
			)}
		>
			{label}
		</button>
	);
}

Button.displayName = /** @type {const} */ ('Form5Button');

/**
 * @typedef {typeof Button.APPEARANCES[keyof typeof Button.APPEARANCES]} Appearance
 */
Button.APPEARANCES = /** @type {const} */ ({
	AFFIRMING: 'affirming',
	BASIC: 'basic',
	DANGER: 'danger',
	PRIMARY: 'primary',
	WARNING: 'warning',
});
/**
 * @typedef {typeof Button.TYPES[keyof typeof Button.TYPES]} Type
 */
Button.TYPES = /** @type {const} */ ({
	BUTTON: 'button',
	RESET: 'reset',
	SUBMIT: 'submit',
});
/**
 * @typedef {typeof Button.VARIANTS[keyof typeof Button.VARIANTS]} Variant
 */
Button.VARIANTS = /** @type {const} */ ({
	CTA: 'cta',
	GLYPH: 'glyph',
});

/**
 * @param {import('../Group/Group.jsx').GroupOwnProps & React.HTMLAttributes<HTMLElement>} props
 */
Button.Group = ({ className, ...props }) => (
	<Group className={clsx(className, styles.ButtonGroup)} {...props} />
);
