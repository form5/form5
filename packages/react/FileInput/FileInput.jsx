import { clsx } from 'clsx';
import _map from 'lodash-es/map.js';
import { PureComponent } from 'react';

import Button, { buttonClasses } from '../Button/Button.jsx';

import styles from './FileInput.module.css';


export { styles as fileInputClasses };

/**
 * @typedef {import('react')} React
 */

/**
 * @typedef {object} FileInputOwnProps
 * @property {React.ReactNode} [icon]
 * @property {string} [label]
 * @property {(event: React.ChangeEvent<HTMLInputElement>, files: FileList) => void} [onChange]
 */

/**
 * @extends React.PureComponent<(FileInputOwnProps & React.InputHTMLAttributes<HTMLInputElement>)>
 */
export default class FileInput extends PureComponent {
	static defaultProps = {
		icon: '📂',
		label: 'Select file(s)',
		multiple: false,
	}

	state = {
		/** @type {Array<{ file: URL['href'], preview: URL['href'] }>} */
		previews: new Array(0),
	};

	/** @internal */
	static getDerivedStateFromProps(props, state) {
		if (
			props.value
			&& (
				props.value instanceof File
				|| typeof props.value === 'string'
			)
		) {
			return { previews: [generatePreview(props.value)] };
		}

		return state;
	}

	/** @internal */
	handleChange = (e, cb) => {
		const { files } = e.target;

		if (!files?.length) return console.error('[File Preview] Files is empty');

		this.setState({ previews: _map(files, generatePreview) });

		cb?.(e, files);
	}

	/** @internal */
	componentWillUnmount() {
		for (const { preview } of this.state.previews) URL.revokeObjectURL(preview);
	}

	render() {
		const {
			handleChange,
			props: {
				accept,
				className,
				icon,
				label,
				multiple,
				name,
				onChange,
			},
			state: {
				previews,
			},
		} = this;

		let hasMediaPreview = false;

		const Previews = _map(previews, ({ file, preview }) => {
			if (preview) {
				hasMediaPreview = true;

				return (
					<object
						className={styles.FileInputPreview}
						data={preview}
						key={file.name}
						type={file.type}
					/>
				);
			}

			if (file) return (<p key={file.name}>{file.name}</p>);
		});

		return (
			<label
				className={clsx(
					styles.FileInput,
					className,
					{[styles.FileInputPreviews]: hasMediaPreview},
				)}
				htmlFor={name}
			>
				{Previews}

				<span
					appearance={Button.APPEARANCES.BASIC}
					className={clsx(buttonClasses.Button, styles.FileInputButton)}
					title={label}
					variant={Button.VARIANTS.CTA}
				>{icon}</span>

				<input
					accept={accept}
					className={styles.FileInputControl}
					id={name}
					multiple={multiple}
					name={name}
					onChange={(e) => handleChange(e, onChange)}
					type="file"
				/>
			</label>
		);
	}
}
FileInput.displayName = /** @type {const} */ ('Form5FileInput');

/**
 * @typedef {{ file: File, preview?: URL['href'] }} Preview
 * @param {URL['href'] | File} input
 */
export function generatePreview(input) {
	const output = /** @type {Preview} */ ({ file: input });

	// `File` doesn't exist in node, so its `createObjectURL` expects a `Blob`
	// `File` inherits from `Blob`, so checking for `Blob` also catches `File`
	if (input instanceof Blob) {
		if (PREVIEWABLE_MIME_REGEX.test(input.type)) {
			output.preview = URL.createObjectURL(input);
		}
		return output;
	}

	try { // check if `file` is a URL
		if (
			typeof input !== 'string'
			|| !(
				input.startsWith('http')
				|| input.startsWith('file')
			)
		) throw 'not a URL';
		const name = (new URL(input)).pathname.split('/').at(-1);

		// @ts-ignore The extra properties don't matter
		output.file = { name };
		output.preview = input;

		return output;
	} catch { }
}

const PREVIEWABLE_MIME_REGEX = /^audio|application(?!\/vnd)|image|video/;
