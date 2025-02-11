import { deepEqual, equal } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fireEvent, render } from '@testing-library/react';

import { useInteractiveStates } from './use-interactive-states.js';


describe('useInteractiveStates()', () => {
	function TestComponent({
		onDirty,
		onPristine,
		...others
	}) {
		const interactiveStates = useInteractiveStates({ onDirty, onPristine });

		return (
			<input
				{...others}
				{...interactiveStates}
			/>
		);
	}

	it('should initially mark the field pristine and untouched', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent name="foo" />
		);

		equal(field.hasAttribute('pristine'), true, 'pristine');
		equal(field.hasAttribute('touched'), false, 'touched');
	});

	it('should mark the field "touched" AFTER the first time it becomes active/focused', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent name="foo" />
		);

		fireEvent.blur(field);

		equal(field.hasAttribute('pristine'), true, 'pristine');
		equal(field.hasAttribute('touched'), true, 'touched');
	});

	it('should remove "pristine" as soon as the field value changes (and mark it "touched")', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent name="foo" />
		);

		fireEvent.change(field, { target: { value: 'bar' } });

		equal(field.hasAttribute('pristine'), false, 'pristine');
		equal(field.hasAttribute('touched'), true, 'touched');
	});

	it('should mark the field touched if it is not already and becomes invalid', () => {
		const { container: { firstChild: field } } = render(
			<TestComponent required name="foo" />
		);

		fireEvent.invalid(field);

		equal(field.hasAttribute('pristine'), true, 'pristine');
		equal(field.hasAttribute('touched'), true, 'touched');
	});

	describe('onSubmit', () => {
		it('should reset "pristine" & "touched" and call handlers', () => {
			const calls = new Map();
			function onDirty(...args) { calls.set('onDirty', args); }
			function onPristine(...args) { calls.set('onPristine', args); }

			const { container: { firstChild: field } } = render(
				<TestComponent
					name="foo"
					onDirty={onDirty}
					onPristine={onPristine}
				/>
			);

			fireEvent.change(field, { target: { value: 'bar' } });

			equal(field.hasAttribute('pristine'), false, '(after change) pristine');
			equal(field.hasAttribute('touched'), true, '(after change) touched');
			equal(calls.size, 1, 'callback count after change');
			deepEqual(calls.get('onDirty'), [true], 'onDirty called after change');

			calls.clear();

			fireEvent.submit(field);

			equal(field.hasAttribute('pristine'), true, 'pristine (after submit)');
			equal(field.hasAttribute('touched'), false, 'touched (after submit)');
			equal(calls.size, 1, 'callback count (after submit)');
			deepEqual(calls.get('onPristine'), [false], 'onPristine called (after submit)');
		});
	});
})
