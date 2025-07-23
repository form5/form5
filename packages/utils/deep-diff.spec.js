import { deepEqual } from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { FileList } from '../../test/globals.mock.js';

import deepDiff from './deep-diff.js';


describe('deepDiff', () => {
	const avatar = new File([''], 'me.jpg');
	const header1 = new File([''], 'bg1.jpg');
	const header2 = new File([''], 'bg2.jpg');
	const header3 = new File([''], 'bg3.jpg');

	let headers;
	let oldVals;

	beforeEach(() => {
		headers = new FileList(header1, header2);

		oldVals = {
			allergies: ['nuts', 'shellfish'],
			avatar,
			contactDetails: {
				email: 'jj@example.com',
				tels: {
					home: '1111111111',
					mobile: '5555555555',
				},
				preferred: 'email',
			},
			headers,
			name: 'Jakob Jingleheimer',
			togglable: false,
		};
	});

	describe('no differences', () => {
		it('should return an empty object when no change', () => {
			const diff = deepDiff(oldVals, oldVals);

			deepEqual(diff, { __proto__: null });
		});

		describe('no initial value and unchanged', () => {
			it('should return an empty object', () => {
				const diff_str = deepDiff({ foo: '' }, { foo: '' });

				deepEqual(diff_str, { __proto__: null }, 'empty string');

				const diff_undef = deepDiff({ foo: undefined }, { foo: undefined });

				deepEqual(diff_undef, { __proto__: null }, 'undefined');
			});
		});
	});

	describe('with differences', () => {
		describe('omitted/removed', () => {
			describe('non-iterable values', () => {
				it('should return an object with only the empty property(s)', () => {
					const newVals = {
						contactDetails: {
							tels: {
								home: '1111111111',
							},
						},
						headers,
					};

					const diff = deepDiff(oldVals, newVals);

					deepEqual(diff, {
						__proto__: null,
						allergies: [],
						avatar: null,
						contactDetails: {
							__proto__: null,
							email: null,
							preferred: null,
							tels: {
								__proto__: null,
								mobile: null,
							},
						},
						name: null,
						togglable: null,
					});
				});
			});

			describe('list-like items', () => {
				it('should return an object with the remaining items and empty values for other items', () => {
					headers = new FileList(header1);

					const diff = deepDiff(
						{
							...oldVals,
							allergies: ['nuts', 'shellfish'],
						},
						{
							...oldVals,
							allergies: [],
							headers,
						},
					);

					deepEqual(diff, {
						__proto__: null,
						allergies: [],
						headers,
					});
				});
			});
		});

		describe('added', () => {
			describe('non-iterable values', () => {
				it('should include the new value', () => {
					const newVals = {
						...oldVals,
						contactDetails: {
							...oldVals.contactDetails,
							tels: {
								...oldVals.contactDetails.tels,
								home: '2222222222',
							},
						},
						foo: 'bar',
					};

					const diff = deepDiff(oldVals, newVals);

					deepEqual(diff, {
						__proto__: null,
						contactDetails: {
							__proto__: null,
							tels: {
								__proto__: null,
								home: '2222222222',
							},
						},
						foo: 'bar',
					});
				});
			});

			describe('list-like items', () => {
				it('should take the whole list', () => {
					const newVals = {
						__proto__: null,
						allergies: ['nuts', 'shellfish'],
						headers: new FileList(
							header1,
							header2,
							header3,
						),
					};

					const diff = deepDiff({
						...oldVals,
						allergies: [],
					}, {
						...oldVals,
						...newVals,
					});

					deepEqual(diff, newVals);
				});
			});
		});

		describe('changed', () => {
			describe('when only a root-level checkbox value changes', () => {
				it('should contain only that value', () => {
					const newVal = { __proto__: null, togglable: true };
					const newVals = { __proto__: null, ...oldVals, ...newVal };
					const diff = deepDiff(oldVals, newVals);

					deepEqual(diff, newVal);
				});
			});

			describe('when only a nested value changes', () => {
				it('should contain only that value', () => {
					const newVal = { __proto__: null, contactDetails: { __proto__: null, preferred: 'phone' } };
					const newVals = {
						...oldVals,
						contactDetails: {
							...oldVals.contactDetails,
							...newVal.contactDetails,
						},
					};
					const diff = deepDiff(oldVals, newVals);

					deepEqual(diff, newVal);
				});
			});
		});
	});
});
