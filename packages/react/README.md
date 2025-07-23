# Form5 / React Components

## Requirements

* CSS modules
* React 17+

This package distributes JSX so you can decide how it gets compiled.

## Demo

[https://form5.github.io/](https://form5.github.io/)

## Quick start

```console
$ npm i @form5/react
```

```jsx
import Button from '@form5/react/Button';
import Field from '@form5/react/Field';
import Form from '@form5/react/Form';

export const TestForm = ({ who = 'world' }) => (
	<Form name="hello">
		<Field name="who" type="text" defaultValue={who} />
		<Button type="submit">Submit</Button>
	</Form>
);
```

## Key features

Use what you want. No component requires any other component (ex `<Form>` works just fine with plain `<input>`, `<select>`, etc).

You can also use the utilities that underpin `<Form>` without the react component itself (you're free to re-invent the wheel), just add them as a separate dependency, import, and go:

```console
$ npm i @form5/utils
```

```js
import composeData from '@form5/utils/composeData';
import deepDiff from '@form5/utils/deepDiff';
```

### Just the tip

Good practice in data management keeps things minimal. When changing data, it's generally best to track only what changed (especially important for large data models). Out of the box, Form5 provides a deep diff to `<Form>`'s `onSubmit` handler.

### Model for model

Form5 supports a one-to-one DOM to data model mapping: To create nested data objects, use a plain old `<fieldset>`; when a `name` prop is supplied, the data object provided to `onSubmit` will nest fields inside under that name. [See examples below](#component-consumption).

### Native

This package leverages as many native APIs as possible: HTML5's [Constraints Validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation), CSS variables, latest media queries and properties, etc. Anything that doesn't is as closely aligned and friendly as possible to any existing native APIs (with a couple small but personally frustrating exceptions—the lesser of two evils).

### Performance

Performance was one of the main reasons I created this; I was gobsmacked by the _horrendous_ performance of leading libs *cough* formik *cough*; that may not be the case anymore (I haven't checked). There are no redundant/superfluous re-renders etc from this package and no divitis.

## Usage

This package encourages/supports (and enforces a bit) accessibility. It leverages the native [Constraints Validation API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation), and very rudimentary structural styling via [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout).

State can be controlled or uncontrolled without impacting the validation this package facilitates.

### Styling configuration

General layout structure and basic validation state appearance is handled by this package. There are some css variables that are consumed if available:

<details>
<summary>CSS variables</summary>

css var | purpose
:--- | :---
`--colour-background` | field background colour
`--colour-danger` | borders and text colours when field has invalid input
`--colour-light` | icon-based button background colour
`--colour-medium` | default border colours,
`--colour-muted` | disabled & readonly field's label
`--colour-primary` | submit button
`--colour-success` | success button colour
`--colour-text-deemphasised` | label text and border colour of disabled fields
`--colour-warning` | background colour of a "warning" button
`--default-border-radius` | field corner rounding
`--default-boxshadow` | drop shadow on buttons and fields
`--default-padding` | inner spacing of fields and minimum inner spacing for buttons
`--default-transition-duration` | value used for [`transition-duration`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration) on various Fields
`--default-transition-easing` | value used for [`transition-timing-function`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function) on various Fields
`--grid-gutter` | space between css grid layout cells (labels + fields, fields + fields); value used for [`gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
</details>

Labels of fields set to required are automatically styled with an "*" in an accessibility-friendly way.

Implementer's css modules are consumed via css modules (passed as normal via `className`).

### Components

If a field is supplied validation props (`minLength`, `required`, etc), the component will automatically trigger its fields ("form controls") to self-validate and display relevant errors upon submit. Each field supports supplying custom validation messages via the Constraints Validation API—when no custom message(s) are supplied, browser defaults (which are pretty good and support i18n for free) are used. A Form submitted with no changes or invalid fields will abort the submission (the supplied `onSubmit` callback will not be called).

Any props not specific to this package are passed to the relative element.

<details>
<summary>Code example</summary>

```jsx
import { Button } from '@form5/react/Button';
import { Field } from '@form5/react/Field';
import { Form } from '@form5/react/Form';

import AddressService from '../AddressService.js';
import ClientsService from '../ClientsService.js';

import yourCustomStyles from './something.module.css';


const validateAddress = (event) => {
  const { target } = event;
  const isInvalid = AddressService.validate(target.value);
  let msg = 'Address is not recognised';

  if (isInvalid) {
    if (typeof msg === 'boolean') msg = isInvalid;

    target.setCustomValidity(msg);
    target.reportValidity(); // required because reasons
  }
};

const validateDomain = (event) => {
  const { target } = event;
  const isInvalid = ClientsService.validate(target.value);
  let msg = 'Email address is not allowed';

  if (isInvalid) {
    if (typeof msg === 'boolean') msg = isInvalid;

    target.setCustomValidity(msg);
    target.reportValidity(); // required because reasons
  }
};

const sendToCloud = (
  delta,
  {
    forename,
    surname,
    contactDetails: {
      email,
      tel,
    },
    newsletterOptIn,
  },
  event,
) => {
  return fetch(…);
};

const SFC = (props) => (
  <Form
    className={yourCustomStyles.SignupForm}
    name="signup"
    onDirty={setIsDirty}
    onPristine={setIsDirty}
    onSubmit={sendToCloud}
  >
    <Field
      name="forename"
      minLength={2}
      placeholder="Jane"
      required
      type="text"
    />
    <Field
      name="surname"
      minLength={2}
      placeholder="Smith"
      required
      type="text"
    />
    <fieldset name="contactDetails">
      <Field
        name="email"
        onBlur={validateDomain}
        placeholder="jane@example.com"
        type="email"
      />
      <Field
        as="textarea"
        name="mailingAddress"
        onChange={validateAddress}
      />
      <Field
        name="tel"
        placeholder="5555555555"
        type="tel"
      />
    </fieldset>
    <Field
      name="newsletterOptIn"
      type="checkbox"
      variant={Input.VARIANTS.TOGGLE}
    />
    <Button
      appearance={Button.APPEARANCES.BASIC}
      type="submit"
    />
  </Form>
);
```
</details>

#### `<Form>`

This component facilitates validation and provides a data model object for uncontrolled fields. Fields wrapped in a name `fieldset` result in a nested object.

It also provides a `delta` of data changes, useful for [`PATCH`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)ing existing field(s) changed by the user: the delta object contains only properties differing from their initial value. Ex an existing user changes their forename: `delta = { forename: 'Jakob' }`; if a Form is submitted multiple times, note that its delta changes—the delta is the difference from the last "clean" state until "now" (so it will reflect changes since the last submit).

`<Form>` accepts a number of event handlers (the usual `onChange`, `onSubmit`, etc), as well as some other useful extras:

##### `onDirty` and `onPristine`

These optional handlers are called with `true` and `false` respectively as they're typically used to track `isDirty` (so `onDirty={setIsDirty}` and `onPristine={setIsDirty}`).

`<Form>` tracks `pristine` and `touched` regardless of whether handlers are supplied because it uses them internally (such as to abort a submission when `pristine`). Each handler is called only once per change (eg when the form becomes dirty and then when it becomes `pristine` again after submit). These can be leveraged to, for instance, warn the user they are about to abandon the current changes.

#### `<fieldset>`

Form5 itself has no component for `<fieldset>`, but it does have special support for the native
`<fieldset>` when composing data. Natively, `readonly` has no effect on a `<fieldset>` (or its
descendants), to the surprise and upset of many. In Form5, setting `<fieldset readonly>` will result in
`composeData()` ignoring its descedants in output (as if the descendants themselves were `readonly`). However, in order to get native html to behave
like the descendant fields are `readonly`, you must also set `disabled` on the fielset: `<fieldset
disabled readonly>`. `composeData()` ordinarily outputs descendants' value as `null` when `<fieldset
disabled>`, but when it is _also_ `readonly`, it instead ignores them.

In order to create nested data, a named fieldset can be used:

<details>
<summary>Code example</summary>

```html
<fieldset name="something">
  <input name="a" />
  <input name="b" />

  <fieldset name="else">
    <input name="c" />
    <input name="d" />
  </fieldset>

  <fieldset><!-- anonymous -->
    <input name="e" />
    <input name="f" />
  </fieldset>
</fieldset>
```

Results in `composeData()` outputting:

```js
{
  something: {
    a: '…',
    b: '…',
    else: {
      c: '…',
      d: '…',
    }
    e: '…',
    f: '…',
  }
}
```
</details>

#### `<Button>`

The most important difference here is the `type` prop defaults to `button` instead of `submit` because forgetting to override "submit" has confusing, adverse behaviour.

#### `<FileInput>`

A file picker for uploading from disk. The main difference between this component and this package's `<Field>` component is that it generates a preview for image-type files or lists filenames of selected files (when a preview cannot be generated).

#### `<Field>`

This component is a thin wrapper for native `label` and form fields (`input`, `select`, `textarea`) that helps to ensure accessibility and facilitate validation. It leverages `onBlur` and `onChange` listeners to track `pristine` and `touched` (to avoid erroneously invalidating the field); its internal handlers are called first, and then handlers optionally supplied via props.

To create a list of values within a single property, append `[]` to the `name` attribute, like `<Field name="foo[]" />`; to avoid conflicting with the likes of react, a number may optionally be included within the brackets, like `<Field name="foo[0]" />`, but the number (index) itself will be ignored (sequence in data objects is determined by the input's place in the DOM).

When you have existing data with which to pre-populate form fields that users will subsequently change, you can still have an uncontrolled component (meaning you don't need to manage `onChange` etc) by using React's `defaultChecked={valueFromDb}` or `defaultValue={valueFromDb}` (which also works with a native `<input>`). Note that unlike native HTML checkboxes and radio "buttons", Form5 enforces the expected behaviour of `readOnly` on these fields (natively, `readOnly` only affects setting `value`, and checkboxes and radios change `checked`—seemingly a distinction without a difference). So `<Field checked readOnly type="checkbox" />` cannot be unchecked.

`<Field>` also offers a small easter-egg: a toggle, which is effectively a checkbox with fancy styling.
