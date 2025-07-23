import { clsx } from 'clsx';

import styles from './Group.module.css';


export { styles as grouptClasses };

/**
 * @typedef {typeof import('react')} React
 */

/**
 * @typedef {object} GroupOwnProps
 * @property {React.ElementType} [GroupOwnProps.as] The element to render.
 */
/**
 * Visually group form elements (buttons) together.
 * @param {GroupOwnProps & React.HTMLAttributes<HTMLElement>} props
 */
export default function Group({
	as: Tag = 'div',
	className,
	...others
}) {
	return (
		<Tag
			{...others}
			className={clsx(styles.Group, className)}
			role="group"
		/>
	);
}

Group.displayName = /** @type {const} */ ('Form5Group');
