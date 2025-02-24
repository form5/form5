import 'react';

declare module 'react' {
	type BooleanAttr = '' | null;

	export interface HTMLAttributes<T> {
		arrangement?: string,
		appearance?: string,
		pristine?: BooleanAttr,
		switch?: BooleanAttr
		touched?: BooleanAttr,
		variant?: string,
	}
}
