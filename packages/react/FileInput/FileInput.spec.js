import { deepEqual, equal,match, ok } from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { Blob } from 'node:buffer';

await import('react')
	.then((module) => ({
		PureComponent: class MOCK_PureComponent {
			setState = function MOCK_setState(data) {
				Object.assign(this.state, data)
			};
		},
	}));

import FileInput, { generatePreview } from './FileInput.jsx';


const previewSrcRegex = /^blob:/;

describe('FileInput', () => {
	let finput;

	function generateChangeEvent(count = 1) {
		const files = Array(count);

		for (let i = 0; i < count; i++) {
			files[i] = Object.assign(new Blob([''], { type: 'image/jpeg' }), {
				name: `image_${i}.jpg`,
			});
		}

		return {
			target: { files },
		};
	}

	beforeEach(() => {
		finput = new FileInput({});
	});

	describe('deriving state from props', () => {
		it('should generate a preview when value is set to a file', () => {
			const state = FileInput.getDerivedStateFromProps({
				value: new File(new Array(), 'preview.jpg'),
			});

			ok(Array.isArray(state.previews));
			equal(state.previews.length, 1);
		});

		it('should generate a preview when value is set to a URL', () => {
			const state = FileInput.getDerivedStateFromProps({
				value: 'http://example.com/preview.jpg',
			});

			ok(Array.isArray(state.previews));
			equal(state.previews.length, 1);
			ok(state.previews[0]);
		});

		describe('no initial value', () => {
			it('should use the default state', () => {
				const defaultState = { previews: new Array(0) };
				const state = FileInput.getDerivedStateFromProps({}, defaultState);

				deepEqual(state, defaultState);
			});
		});
	});

	describe('handleChange()', () => {
		describe('when selection', () => {
			it('should trigger generating previews', () => {
				const event = generateChangeEvent();
				/** @type {object} */
				let setStateCalledWith;

				finput.setState = function MOCK_setState(data) {
					setStateCalledWith = data;
				}

				finput.handleChange(event, () => {});

				ok(Array.isArray(setStateCalledWith.previews));
				equal(setStateCalledWith.previews.length, 1);

				deepEqual(Object.keys(setStateCalledWith.previews[0]), ['file', 'preview']);
				deepEqual(setStateCalledWith.previews[0].file, event.target.files[0]);
				match(setStateCalledWith.previews[0].preview, previewSrcRegex);
			});
		});

		describe('when NO selection', () => {
			it('should abort', () => {
				const ogConsoleError = console.error;
				/** @type {Array<any>} */
				let consoleErrorCalledWith

				console.error = function MOCK_consoleError(...args) {
					consoleErrorCalledWith = args;
				}

				const event = generateChangeEvent(0);
				let setStateCalled = false;
				let handlePreviewsCalled = false;
				let cbCalled = false;

				finput.setState = function MOCK_setState() {
					setStateCalled = true;
				}

				finput.handleChange(event, () => { cbCalled = true });

				match(consoleErrorCalledWith[0], /empty/);
				equal(setStateCalled, false, 'setStateCalled');
				equal(handlePreviewsCalled, false, 'handlePreviewsCalled');
				equal(cbCalled, false, 'cbCalled');

				// cleanup
				console.error = ogConsoleError;
			});
		});
	});

	describe('before unmount', () => {
		it('should release preview URL(s)', () => {
			const ogRevokeObjectURL = URL.revokeObjectURL;
			let revokeObjectURLCalledWith;

			URL.revokeObjectURL = function MOCK_revokeObjectURL(id) {
				revokeObjectURLCalledWith = id
			}

			const previewUrl = 'blob://image_1.jpg';

			finput.state.previews = [
				{ preview: previewUrl }
			];

			finput.componentWillUnmount();

			equal(revokeObjectURLCalledWith, previewUrl);

			// cleanup
			URL.revokeObjectURL = ogRevokeObjectURL;
		});
	})
});

describe('FileInput → generatePreview()', () => {
	describe('when input is a File', () => {
		it('should generate a preview media files', () => {
			[
				'audio/mp3',
				'application/pdf',
				'image/generic',
				'video/mp4',
			].forEach((type) => {
				// Node doesn't support `File`, so fake it with `Blob` (which is the base class of File)
				const file = new File([''], 'foo.img', { type });
				const output = generatePreview(file);

				equal(output.file, file);
				match(output.preview, previewSrcRegex);
			});
		});

		it('should pass along non-media files', () => {
			[
				'application/vnd.oasis.opendocument.text',
				'font/otf',
				'text/plain',
			].forEach((type) => {
				// Node doesn't support `File`, so fake it with `Blob` (which is the base class of File)
				const file = new File([''], 'foo.img', { type });
				const output = generatePreview(file);

				equal(output.file, file);
				equal(output.preview, undefined);
			});
		});
	});

	describe('when input is a url', () => {
		it('should construct facsimile data for file://', () => {
			const src = 'file:///tmp/foo.img';
			const output = generatePreview(src);

			deepEqual(output.file, { name: 'foo.img' });
			equal(output.preview, src);
		});

		it('should construct facsimile data for http(s)://', () => {
			const src = 'https://example.com/foo.img';
			const output = generatePreview(src);

			deepEqual(output.file, { name: 'foo.img' });
			equal(output.preview, src);
		});
	});

	describe('when input is invalid', () => {
		it('should return nothing', () => {
			[
				[],
				2,
				Symbol('foo.img'),
				true,
				undefined,
				'foo',
			].forEach((input) => equal(
				// @ts-ignore this is the point of the test
				generatePreview(input),
				undefined),
			);
		});
	});
});
