import { equal, match, ok } from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { cleanup, render } from '@testing-library/react';

import Group from './Group.jsx';


describe('<Group>', () => {
	afterEach(() => {
		cleanup();
	});

	it('should have the proper role', () => {
		const group = render(
			<Group />
		)
		.getByRole('group');

		ok(group);
	});

	it('should respect `as`', () => {
		const group = render(
			<Group as="span" />
		)
		.getByRole('group');

		equal(group.tagName, 'SPAN');
	});

	it('should accept className', () => {
		const group = render(
			<Group as="span" className="foo" />
		)
		.getByRole('group');

		match(group.className, /Group/);
		match(group.className, /foo/);
	});
});
