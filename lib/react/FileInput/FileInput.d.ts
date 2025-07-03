export function generatePreview(input: URL["href"] | File): Preview | undefined;
export { styles as fileInputClasses };
declare class FileInput extends PureComponent<FileInputProps & import("react").InputHTMLAttributes<HTMLInputElement>, any, any> {
    static defaultProps: {
        icon: string;
        label: string;
        multiple: boolean;
    };
    static getDerivedStateFromProps(props: any, state: any): any;
    constructor(props: (FileInputProps & import("react").InputHTMLAttributes<HTMLInputElement>) | Readonly<FileInputProps & import("react").InputHTMLAttributes<HTMLInputElement>>);
    constructor(props: FileInputProps & import("react").InputHTMLAttributes<HTMLInputElement>, context: any);
    state: {
        previews: Array<URL["href"]>;
    };
    handleChange: (e: any, cb: any) => void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
declare namespace FileInput {
    let displayName: "Form5FileInput";
}
export default FileInput;
export type Preview = {
    file: File;
    preview?: URL["href"];
};
export type React = typeof import("react");
export type FileInputProps = {
    icon?: React.ReactNode;
    onChange?: ((event: React.ChangeEvent<HTMLInputElement>, files: FileList) => void) | undefined;
};
import { PureComponent } from 'react';
//# sourceMappingURL=FileInput.d.ts.map