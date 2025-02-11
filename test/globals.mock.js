export class File extends Blob {
	/** @type {BlobPart[]} */
	#bits;
	#lastModified = Date.now();
	#name = '';
	#type = '';

	/**
	 *
	 * @param {BlobPart[]} bits
	 * @param {string} name
	 * @param {object} options
	 * @param {ReturnType<typeof Date.now>} [options.lastModified]
	 * @param {string} [options.type]
	 */
	constructor(bits, name, { lastModified, type } = {}) {
		super(bits);
		this.#bits = bits;
		this.#name = name;

		if (lastModified) this.#lastModified = lastModified;
		if (type) this.#type = type;
	}

	get lastModified() { return this.#lastModified }
	get name() { return this.#name }
	get size() { return 1 }
	get type() { return this.#type }
}
// @ts-ignore
global.File = File;

export class FileList extends Array {
	item(idx) { return this[idx] }
}

global.FileList = FileList;
