export function useInteractiveStates({ onDirty, onPristine, }?: {
    onDirty?: ((isDirty: true) => void) | undefined;
    onPristine?: ((isDirty: false) => void) | undefined;
}): {
    onBlur: (e: FocusEvent) => void;
    onChange: () => void;
    onInvalid: () => void;
    onSubmit: () => void;
    pristine: "" | null;
    touched: "" | null;
};
export type BooleanAttribute = "" | null;
//# sourceMappingURL=useInteractiveStates.d.ts.map