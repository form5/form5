import { equal, match, ok } from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { cleanup, render } from '@testing-library/react';

import Button from './Button.jsx';


describe('<Button>', () => {
	afterEach(() => {
		cleanup();
	});

	it('should consume children as label', () => {
		const button = render(
			<Button>Hello world</Button>
		)
		.getByText('Hello world');

		ok(button);
	});

	it('should respect `fluid`', () => {
		const button = render(
			<Button fluid />
		)
		.getByRole('button');

		match(button.className, /fluid/);
	});

	it('should respect `appearance`', () => {
		for (const appearance of Object.values(Button.APPEARANCES)) {
			const button = render(
				<Button appearance={appearance} />
			)
			.getByRole('button');

			equal(button.getAttribute('appearance'), appearance);

			cleanup();
		}
	});

	it('should respect `type`', () => {
		for (const type of Object.values(Button.TYPES)) {
			const button = render(
				<Button type={type} />
			)
			.getByRole('button');

			equal(button.getAttribute('type'), type);

			cleanup();
		}
	});

	it('should respect `variant`', () => {
		for (const variant of Object.values(Button.VARIANTS)) {
			const button = render(
				<Button variant={variant} />
			)
			.getByRole('button');

			equal(button.getAttribute('variant'), variant);

			cleanup();
		}
	});
});

describe('<Button.Group>', () => {
	it('should render an augmented <Group>', () => {
		const group = render(
			<Button.Group />
		)
		.getByRole('group');

		match(group.className, /ButtonGroup/);
	});
});
