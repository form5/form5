export type FormControlElement = (
	  HTMLButtonElement
	| HTMLFieldSetElement
	| HTMLInputElement
	| HTMLObjectElement
	| HTMLOutputElement
	| HTMLSelectElement
	| HTMLTextAreaElement
);

export type FormControlElements = HTMLCollectionOf<FormControlElement>;

/**
 * An object with values cast to the type declared by the field from which the value was derived.
 * Checkboxses and Radios have boolean values.
*/
export type ComposedData = {
	[k: string]: (
			Array<number | string>
		| boolean
		| FileList
		| number
		| string
		| null
		| undefined
		| ComposedData
	),
};
