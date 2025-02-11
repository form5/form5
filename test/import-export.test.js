import assert from 'node:assert';
import { describe, it } from 'node:test';


describe('package exports', () => {
	it('should contain all components', async () => {
		const comps = await import('@form5/react');

		assert.ok(comps.Button, 'Button');
		assert.ok(comps.Field, 'Field');
		assert.ok(comps.FileInput, 'FileInput');
		assert.ok(comps.Form, 'Form');
		assert.strictEqual(Object.keys(comps).length, 4, 'number of components');
	});

	it('should contain all utilities', async () => {
		await import('@form5/utils/composeData')
			.then(assert.ok);
		await import('@form5/utils/deepDiff')
			.then(assert.ok);
	});
});

describe('importing exports', () => {
	it('should import each component', async () => {
		const imports = await Promise.all([
			import('@form5/utils/composeData'),
			import('@form5/utils/deepDiff'),
			import('@form5/react/Button'),
			import('@form5/react/Field'),
			import('@form5/react/FileInput'),
		]);

		for (const imp of imports) {
			assert.strictEqual(typeof imp.default, 'function', 'default export');
		}

		// Form is memoized, so it's wrapped
		await import('@form5/react/Form')
			.then((imp) => assert.strictEqual(typeof imp.default.type, 'function', 'default export'))
	});
});
