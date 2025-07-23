# Form5 / Utils

## Demo

[https://form5.github.io/](https://form5.github.io/)

## Quick start

```console
$ npm i @form5/utils
```

## Usage

### `composeData()`

Produce a key-value map of field `name`s (or `id`s) to their `value` (or equivalent, like an `<input checked>`). If you want to roll your own instead of having Form5's `<Form>` do it for you, it would look something like this:

```jsx
import { composeData } from '@form5/utils/composeData';

function onSubmit(event) {
  const formControlsList = Array.from(event.target.elements);
  const data = {};
  formControlsList.reduce(composeData, data);
}

<form onSubmit={onSubmit}>
  {/* … */}
</form>
```

This utility has a couple noteworthy extras related to `<fieldset>`:

* Named `<fieldset>`s create nested key-value maps (see `<fieldset>` below); anonymous `<fieldset>`s are themselves ignored in output (but their descendants are present, as normal).
* Disabled `<fieldset>`s output their descendant's value as `null`, _unless_ the `<fieldset>` is also `readonly`¹.

¹ A named `<fieldset>` with no items is excluded from `composeData()`'s output (there is no empty
object).

### `deepDiff()`

Produce a delta of A & B, maintaining the shape of the inputs. In Form5, this is used in combination with `composeData()`: On mount, `<Form>` runs `composeData()` on all its fields to create the initial state ("A"), and then on submit, runs `composeData()` again to get its fields' current values ("B"), feeding A & B into deepDiff (`deepDiff(A, B)`), and finally resets A to B (for
a potential subsequent submission).

```js
import { deepDiff } from '@form5/utils/deepDiff';

const initial = {
  country: 'Canada',
  forename: 'Jakob',
};
const current = {
  country: 'Holland',
  forename: 'Jakob',
};
deepDiff(initial, current); // { country: 'Holland' }
```
