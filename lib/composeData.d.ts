export default function composeData(values: ComposedData, element: HTMLButtonElement | HTMLFieldSetElement | HTMLInputElement | HTMLObjectElement | HTMLOutputElement | HTMLSelectElement | HTMLTextAreaElement, i: Int, collection: HTMLFormControlsCollection): ComposedData;
export namespace FIELD_TAGS {
    let FIELDSET: "fieldset";
    let INPUT: "input";
    let SELECT: "select";
    let TEXTAREA: "textarea";
}
export type Int = number;
export type ComposedData = {
    [k: string]: Array<number | string> | boolean | FileList | number | string | null | undefined | ComposedData;
};
export type FieldTag = (typeof FIELD_TAGS)[keyof typeof FIELD_TAGS];
//# sourceMappingURL=composeData.d.ts.map