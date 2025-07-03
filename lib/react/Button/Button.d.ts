declare function Button({ appearance, children: label, className, fluid, type, variant, ...others }: ButtonProps & import("react").BaseHTMLAttributes<any>): JSX.Element;
declare namespace Button {
    let displayName: "Form5Button";
    namespace APPEARANCES {
        let AFFIRMING: "affirming";
        let BASIC: "basic";
        let DANGER: "danger";
        let PRIMARY: "primary";
        let WARNING: "warning";
    }
    namespace TYPES {
        let BUTTON: "button";
        let RESET: "reset";
        let SUBMIT: "submit";
    }
    namespace VARIANTS {
        let CTA: "cta";
        let GLYPH: "glyph";
    }
    function Group({ className, ...props }: import("../Group/Group.jsx").GroupProps & React.HTMLAttributes<HTMLElement>): JSX.Element;
}
export default Button;
export { styles as buttonClasses };
export type React = typeof import("react");
export type ButtonProps = {
    appearance?: Appearance | undefined;
    disabled?: boolean | undefined;
    children?: React.ReactNode;
    fluid?: boolean | undefined;
    type?: "button" | "reset" | "submit" | undefined;
    variant?: Variant | undefined;
};
export type Appearance = (typeof Button.APPEARANCES)[keyof typeof Button.APPEARANCES];
export type Type = (typeof Button.TYPES)[keyof typeof Button.TYPES];
export type Variant = (typeof Button.VARIANTS)[keyof typeof Button.VARIANTS];
//# sourceMappingURL=Button.d.ts.map