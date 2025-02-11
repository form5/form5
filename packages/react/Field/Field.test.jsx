import { deepEqual, equal, notEqual, ok } from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { cleanup, fireEvent, render } from '@testing-library/react';

import Field from './Field.jsx';


describe('<Field>', () => {
	const labelText = 'foo bar';

	afterEach(() => {
		cleanup();
	});

	it('should associate field and label', () => {
		const { getByLabelText } = render(
			<Field
				id="bar"
				label={labelText}
				name="foo"
			/>
		);

		const input = getByLabelText(labelText);

		ok(input);
	});

	it('should accept user-input', () => {
		const { getByLabelText } = render(
			<Field
				id="bar"
				label={labelText}
				name="foo"
			/>
		);

		const input = getByLabelText(labelText);
		const value = 'xyz';

		fireEvent.change(input, { target: { value } });

		equal(input.value, value);
	});

	it('should avoid obnoxious react noise about uncontrolled to controlled fields', () => {
		const globalConsoleErr = console.error;
		const calls = new Array();
		global.console.error = function MOCK_consoleError(...args) { calls.push(args) }

		render(
			<Field
				id="bar"
				label={labelText}
				name="foo"
				value={null}
			/>
		);

		equal(calls.length, 0);

		global.console.error = globalConsoleErr;
	});

	describe('displaying errors', () => {
		let getByLabelText;
		let queryByTestId;
		let input;

		beforeEach(() => {
			({ getByLabelText, queryByTestId } = render(
				<Field
					id="bar"
					label={labelText}
					name="foo"
					required
					type="email"
					value="abc"
				/>
			));
			input = getByLabelText(labelText);
		});

		it('should NOT display an error initially', () => {
			equal(queryByTestId('field-error'), null);
		});

		it('should NOT display an error on focus', () => {
			fireEvent.focus(input);
			equal(queryByTestId('field-error'), null);
		});

		it('should NOT display an error on change', () => {
			fireEvent.change(input, { target: { value: '' } });
			equal(queryByTestId('field-error'), null);
		});

		function triggerErrorDisplay() {
			fireEvent.change(input, { target: { value: '' } });
			fireEvent.blur(input);

			return queryByTestId('field-error');
		}

		it('should display an error on blur', () => {
			const error = triggerErrorDisplay();
			notEqual(error.textContent, '');
		});

		it('should clear the error on subsequent change', () => {
			triggerErrorDisplay();

			fireEvent.change(input, { target: { value: 'jakob@example.com' } });

			equal(queryByTestId('field-error'), null);
		});
	});

	it('should make a list when options are provided', () => {
		const options = {
			'abc-123': 'foo',
			'def-456': 'bar',
		};
		const { queryByTestId } = render(
			<Field
				id="bar"
				label={labelText}
				name="foo"
				options={options}
			/>
		);

		notEqual(queryByTestId('foo_options'), null);
	});

	describe('element variations', () => {
		it('should respect `as`', () => {
			const select = render(
				<Field
					as="select"
					id="bar"
					label={labelText}
					name="foo"
				/>
			)
			.getByLabelText(labelText);

			equal(select.tagName, 'SELECT');

			cleanup();

			const textarea = render(
				<Field
					as="textarea"
					id="bar"
					label={labelText}
					name="foo"
				/>
			)
			.getByLabelText(labelText);

			equal(textarea.tagName, 'TEXTAREA');
		});

		it.skip('should use checkbox state as value', () => {
			let onChangeCalledWith;
			const input = render(
				<Field
					id="bar"
					label={labelText}
					name="foo"
					onChange={(...args) => onChangeCalledWith = args}
					type="checkbox"
				/>
			).getByLabelText(labelText);

			// FIXME: fireEvent.change does not trigger on checkbox
			fireEvent.change(input, { target: { checked: true } });

			console.log('onChangeCalledWith:', onChangeCalledWith)

			equal(onChangeCalledWith[0].value, true);
		});

		describe('`variant`', () => {
			it('should appear as `cta`', () => {
				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						variant="cta"
					/>
				)
				.getByLabelText(labelText);

				equal(input.getAttribute('variant'), 'cta');
			});

			it('should appear as `toggle`', () => {
				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						type="checkbox"
						variant="toggle"
					/>
				)
				.getByLabelText(labelText);

				equal(input.getAttribute('variant'), 'toggle');
			});
		});

		describe('textarea', () => {
			it('should set a default number of `rows`', () => {
				const { getByLabelText } = render(
					<Field
						as="textarea"
						id="bar"
						label={labelText}
						name="foo"
					/>
				);

				const field = getByLabelText(labelText);

				equal(field.rows, 3);
			});
		});
	});

	describe('event callbacks', () => {
		it('should trigger a provided onBlur handler', () => {
			let onBlurCalledWith;
			const name = 'foo';
			const input = render(
				<Field
					id="bar"
					label={labelText}
					name={name}
					onBlur={(...args) => onBlurCalledWith = args}
				/>
			)
			.getByLabelText(labelText);

			fireEvent.focus(input);
			fireEvent.blur(input);

			equal(onBlurCalledWith.length, 1);
			equal(onBlurCalledWith[0].type, 'blur');
			equal(onBlurCalledWith[0].target, input);
		});

		it('should trigger a provided onChange handler', () => {
			let onChangeCalledWith;
			const id = 'bar';
			const name = 'foo';
			const input = render(
				<Field
					id={id}
					label={labelText}
					name={name}
					onChange={(...args) => onChangeCalledWith = args}
				/>
			).getByLabelText(labelText);
			const value = 'xyz';

			fireEvent.change(input, { target: { value } });

			equal(onChangeCalledWith.length, 2);
			deepEqual(onChangeCalledWith[0], { name, id, value });
			equal(onChangeCalledWith[1].type, 'change');
			equal(onChangeCalledWith[1].target, input);
		});

		describe('when readonly', () => {
			it('should prevent blur events', () => {
				let onBlurCalled;

				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						onBlur={(...args) => onBlurCalled = true}
						readOnly
					/>
				)
				.getByLabelText(labelText);

				fireEvent.blur(input);

				equal(onBlurCalled, undefined);
			});

			it('should prevent change actions', () => {
				let onChangeCalled;
				let preventDefaultCalled;
				let stopImmediatePropagationCalled;
				let stopPropagationCalled;

				const input = render(
					<Field
						id="bar"
						label={labelText}
						name="foo"
						onChange={(...args) => onChangeCalled = true}
						readOnly
					/>
				)
				.getByLabelText(labelText);

				const value = 'xyz';

				fireEvent.change(input, {
					nativeEvent: {
						stopImmediatePropagation: () => stopImmediatePropagationCalled = true,
					},
					preventDefault: () => preventDefaultCalled = true,
					stopPropagation: () => stopPropagationCalled = true,
					target: { value },
				});

				equal(onChangeCalled, undefined);
				equal(preventDefaultCalled, undefined);
				equal(stopImmediatePropagationCalled, undefined);
				equal(stopPropagationCalled, undefined);
			});
		});
	});
});
