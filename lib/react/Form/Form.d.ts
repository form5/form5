export function Form({ children, className, onDirty, onPristine, ...props }: FormProps & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">): JSX.Element;
export namespace Form {
    export { FIELD_TAGS };
    export let displayName: "Form5Form";
}
export function onSubmit(event: SubmitEvent, initValues: Values, cb: OnSubmit): void;
export function setup(formElement: HTMLFormElement, initValues: Values): void;
export { styles as formClasses };
declare const _default: import("react").MemoExoticComponent<typeof Form>;
export default _default;
export type React = typeof import("react");
export type ComposedData = import("../../composeData.js").ComposedData;
export type SubmitEvent = React.FormEvent<HTMLFormElement>;
export type ResetEvent = React.FormEvent<HTMLFormElement>;
export type OnSubmit = <D extends ComposedData>(delta: Partial<D>, all: D, event: SubmitEvent) => void;
export type Values = React.MutableRefObject<ComposedData>;
export type FormProps = {
    children: React.ReactNode;
    onDirty?: ((isDirty: true) => void) | undefined;
    onPristine?: ((isDirty: false) => void) | undefined;
    onSubmit: OnSubmit;
};
import { FIELD_TAGS } from '../../composeData.js';
//# sourceMappingURL=Form.d.ts.map