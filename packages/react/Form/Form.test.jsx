import { deepEqual, equal } from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { cleanup, fireEvent, render } from '@testing-library/react';

import Field from '../Field/Field.jsx';
import Form from './Form.jsx';


describe('<Form>', () => {
	const labelText = 'foo bar';
	function noop() {}

	afterEach(() => {
		cleanup();
	});

	describe('initially', () => {
		it('should be pristine and untouched', () => {
			const { container: { firstChild: form } } = render(
				<Form name="foo" onSubmit={noop} />
			);

			equal(form.hasAttribute('pristine'), true, 'pristine');
			equal(form.hasAttribute('touched'), false, 'touched');
		});
	});

	describe('onBlur', () => {
		it('should be touched', () => {
			const {
				container: { firstChild: form },
				getByLabelText,
			} = render(
				<Form name="foo" onSubmit={noop}>
					<Field
						id="bar"
						label={labelText}
						name="foo"
					/>
				</Form>
			);

			const input = getByLabelText(labelText);

			fireEvent.blur(input, { target: {} });

			equal(form.hasAttribute('pristine'), true, 'pristine');
			equal(form.hasAttribute('touched'), true, 'touched');
		});
	});

	describe('onChange', () => {
		it('should be touched and not pristine', () => {
			const {
				container: { firstChild: form },
				getByLabelText,
			} = render(
				<Form name="foo" onSubmit={noop}>
					<Field
						id="bar"
						label={labelText}
						name="foo"
					/>
				</Form>
			);

			const input = getByLabelText(labelText);

			fireEvent.change(input, { target: { value: 'qux' } });

			equal(form.hasAttribute('pristine'), false, 'pristine');
			equal(form.hasAttribute('touched'), true, 'touched');
		});
	});

	function resetOrSubmitForm(action) {
		const calls = new Set();

		const {
			container: { firstChild: form },
			getByLabelText,
		} = render(
			<Form
				name="foo"
				onReset={() => { calls.add('reset') }}
				onSubmit={() => { calls.add('submit') }}
			>
				<Field
					id="bar"
					label={labelText}
					name="foo"
				/>
			</Form>
		);

		const input = getByLabelText(labelText);

		fireEvent.change(input, { target: { value: 'qux' } });

		equal(form.hasAttribute('pristine'), false, 'pristine (after change)');
		equal(form.hasAttribute('touched'), true, 'touched (after change)');

		fireEvent[action](form, {
			target: {
				reportValidity: () => true,
				stopPropagation: noop,
			},
		});

		equal(form.hasAttribute('pristine'), true, `pristine (after ${action})`);
		equal(form.hasAttribute('touched'), false, `touched (after ${action})`);
		equal(calls.size, 1, `handler’s called (after ${action})`);
		equal(calls.has(action), true, `handler’s called (after ${action})`);
	}

	describe('onReset', () => {
		it('should void initial values, allowing a subsequent submit with the same value(s)', () => {
			const sameSearchValue = 'foo';

			let onResetCalled = 0;
			let onSubmitCalled = 0;
			function onReset() { onResetCalled++ }
			function onSubmit() { onSubmitCalled++ }

			const {
				container: { firstChild: form },
				getByTestId,
			} = render(
				<Form onReset={onReset} onSubmit={onSubmit}>
					<Field data-testid="search" name="q" type="search" />
				</Form>
			);

			const field = getByTestId('search');

			fireEvent.change(field, { target: { value: sameSearchValue } });

			fireEvent.submit(form, { elements: [field] });
			equal(onResetCalled, 0, 'reset count (after submit)');
			equal(onSubmitCalled, 1, 'submit count');

			fireEvent.reset(form, { elements: [field] });
			equal(onResetCalled, 1, 'reset count (after reset)');
			equal(onSubmitCalled, 1, 'submit count');

			fireEvent.change(field, { target: { value: sameSearchValue } });
			fireEvent.submit(form, { elements: [field] });
			equal(onResetCalled, 1, 'reset count (after subsequent submit)');
			equal(onSubmitCalled, 2, 'submit count');
		});

		it('should reset pristine & touched and call handler', () => {
			resetOrSubmitForm('reset');
		});
	});

	describe('onSubmit', () => {
		it('should reset pristine & touched and call handler', () => {
			resetOrSubmitForm('submit');
		});

		it('should provide the correct data onSubmit', () => {
			const dV = {
				__proto__: null,
				age: 30,
				contactDetails: {
					__proto__: null,
					email: 'jakob.jingleheimer@test.dev',
					phones: {
						__proto__: null,
						home: '1111111111',
						mobile: '5555555555',
					},
				},
				names: {
					__proto__: null,
					forename: 'Jakob',
					surname: 'Jingleheimer',
				},
			};
			const nV = {
				__proto__: null,
				age: 31,
				contactDetails: {
					__proto__: null,
					email: 'jakob.jingleheimer+different@test.dev',
					phones: {
						__proto__: null,
						mobile: '7777777777',
					},
				},
			};

			/** @type {Record<string, unknown>} */
			let delta;
			/** @type {Record<string, unknown>} */
			let all;
			/** @type {Event} */
			let event;

			async function onSubmit(...args) {
				([delta, all, event] = args);
			}

			const {
				container: { firstChild: form },
				getByLabelText,
			} = render(
				<Form name="test" onSubmit={onSubmit}>
					<fieldset name="names">
						<Field
							defaultValue={dV.names.forename}
							label="forename"
							name="forename"
						/>

						<Field
							defaultValue={dV.names.surname}
							label="surname"
							name="surname"
						/>
					</fieldset>

					<Field
						defaultValue={dV.age}
						label="age"
						name="age"
						type="number"
					/>

					<fieldset name="contactDetails">
						<fieldset name="phones">
							<Field
								defaultValue={dV.contactDetails.phones.mobile}
								label="mobile phone number"
								name="mobile"
							/>
							<Field
								defaultValue={dV.contactDetails.phones.home}
								label="home phone number"
								name="home"
							/>
						</fieldset>

						<Field
							defaultValue={dV.contactDetails.email}
							label="email"
							name="email"
							type="email"
						/>
					</fieldset>
				</Form>
			);

			const ageField = getByLabelText('age');
			const emailField = getByLabelText('email');
			const mobileField = getByLabelText('mobile phone number');

			fireEvent.change(ageField, { target: { value: nV.age } });
			fireEvent.change(emailField, { target: { value: nV.contactDetails.email } });
			fireEvent.change(mobileField, { target: { value: nV.contactDetails.phones.mobile } });

			fireEvent.submit(form);

			deepEqual(delta, nV, 'delta');
			deepEqual(all, {
				__proto__: null,
				age: nV.age,
				contactDetails: {
					__proto__: null,
					email: nV.contactDetails.email,
					phones: {
						__proto__: null,
						home: dV.contactDetails.phones.home,
						mobile: nV.contactDetails.phones.mobile,
					},
				},
				names: dV.names,
			}, 'all');
			equal(event.type, 'submit');
		});
	});
});
