# JavaScript Form Generator Library Documentation

## 1. Overview

This library is a **dynamic schema-driven form generator** built with **React**, **Zustand**, and **Mantine**.

It generates complete forms from a `FormDefinition` schema and supports:

* Validation (Laravel-style rules)
* Step forms
* Dynamic tables
* Computed expressions
* Cascading selects
* Tabs and grouped layouts
* Custom components
* Zustand-based centralized state

The main entry point is the `FormGenerator` component.

---

## 2. Core FormDefinition Structure

```ts
type FormDefinition = {
    fields: Record<string, IField>;
    buttons: Button[];
    steps?: FormSteps;
    groups: Record<string, FormGroup>;
};
```

### Properties

#### `fields`

Contains all form fields and their configuration.

#### `groups`

Defines visual layout and field grouping.

#### `steps`

Optional stepper definition for multi-step forms.

#### `buttons`

Defines submit/action buttons shown below the form.

---

## 3. Field System

### Base Field Interface

All fields share a common base structure:

```ts
interface IField {
    state?: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY" | "TABLE" | "ADDABLE";
    validators?: string[];
    error?: string;
    info?: string;
    loading?: boolean;
}
```

---

## 4. Recommended Typed Field Interfaces

Instead of treating every field as the same `IField`, it is better to define **specific interfaces for each field type**.

### 4.1 String / Text Field

Used for short text inputs such as names, emails, codes, etc.

```ts
export interface IStringField extends IBaseField {
    type: "STRING" | "TEXT";
    value?: string;
    config?: {
        min?: number;
        max?: number;
    };
}
```

#### Example

```ts
username: {
    type: "STRING",
    value: "",
    validators: ["required|string|min:3|max:50"]
}
```

---

### 4.2 Number Field

Used for numeric input.

```ts
export interface INumberField extends IBaseField {
    type: "NUMBER";
    value?: number;
    config?: {
        min?: number;
        max?: number;
    };
}
```

#### Example

```ts
age: {
    type: "NUMBER",
    value: 18,
    config: {
        min: 0,
        max: 120
    },
    validators: ["required|numeric|min:0|max:120"]
}
```

---

### 4.3 Date Field

Used for selecting a date.

```ts
export interface IDateField extends IBaseField {
    type: "DATE";
    value?: string | number;
    config?: {
        min?: number;
        max?: number;
    };
}
```

#### Notes

* `min` and `max` can be used to constrain selectable dates
* Date format handling depends on the date component implementation

#### Example

```ts
birthDate: {
    type: "DATE",
    validators: ["required"]
}
```

---

### 4.4 Textarea Field

Used for multiline text such as notes, comments, or descriptions.

```ts
export interface ITextAreaField extends IBaseField {
    type: "TEXTAREA";
    value?: string;
    config?: {
        min?: number;
        max?: number;
    };
}
```

#### Example

```ts
description: {
    type: "TEXTAREA",
    validators: ["nullable|string|max:500"]
}
```

---

### 4.5 Boolean Field

Used for checkboxes or toggle-like fields.

```ts
export interface IBooleanField extends IBaseField {
    type: "BOOLEAN";
    value?: boolean;
    config?: {
        hides?: string[];
    };
}
```

#### Notes

* `hides` can be used to dynamically hide other fields when checked/unchecked

#### Example

```ts
isCompany: {
    type: "BOOLEAN",
    value: false,
    config: {
        hides: ["personalId"]
    }
}
```

---

### 4.6 Select Field

Used for dropdowns and cascading selects.

```ts
export interface ISelectField extends IBaseField {
    type: "SELECT";
    value?: string | number;
    config?: {
        data?: any[];
        loadData?: string[];
    };
}
```

#### Notes

* `data` contains dropdown options
* `loadData` is used for cascading select behavior

#### Example

```ts
city: {
    type: "SELECT",
    config: {
        data: [
            { value: "prague", label: "Prague" },
            { value: "brno", label: "Brno" }
        ]
    }
}
```

#### Cascading Select Example

```ts
street: {
    type: "SELECT",
    config: {
        loadData: ["city"]
    }
}
```

---

### 4.7 Custom Field

Used when rendering a custom React component.

```ts
export interface ICustomField extends IBaseField {
    type: "CUSTOM";
    value?: any;
    component: string;
    config?: Record<string, any>;
}
```

#### Notes

* `component` must match a key from the `components` prop passed into `FormGenerator`

#### Example

```ts
signature: {
    type: "CUSTOM",
    component: "SignaturePad"
}
```

---

### 4.8 Table Field

Used for editable row-based structured data.

```ts
export interface ITableField extends IBaseField {
    type: "TABLE";
    value?: any[];
    config?: {
        limit?: number | null;
        cols?: ITableColl[];
        action?: string;
        isClamped?: boolean;
        isMandatory?: string[];
    };
}
```

#### Notes

* `limit` = maximum row count
* `cols` = table column schema
* `action` = backend endpoint for table operations
* `isClamped` = prevents certain values from exceeding previous values
* `isMandatory` = currently unused

#### Example

```ts
items: {
    type: "TABLE",
    value: [],
    config: {
        limit: 10,
        cols: [
            { id: "name", type: "TEXT", state: "EDITABLE" },
            { id: "price", type: "NUMBER", state: "EDITABLE" }
        ]
    }
}
```

---

## 5. Final `IField` Union Type

This is the recommended TypeScript shape:

```ts
export type IField =
    | IStringField
    | INumberField
    | IDateField
    | ITextAreaField
    | IBooleanField
    | ISelectField
    | ICustomField
    | ITableField;
```

This gives you:

* better autocomplete
* safer configs
* easier renderer logic
* cleaner documentation

---

## 6. Legacy Generic `IField` (Current Compatibility)

If you still want to keep your current generic interface for compatibility, it can be documented like this:

```ts
export interface IField {
    state?: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY" | "TABLE" | "ADDABLE";
    value?: string | number | any[];
    type: "NUMBER" | "STRING" | "DATE" | "TEXT" | "CUSTOM" | "SELECT" | "BOOLEAN" | "TABLE" | "TEXTAREA";
    config?: IFieldConfig;
    component?: string; // only for CUSTOM field
    validators?: string[];
    error?: string;
    info?: string;
    expression?: string; // mainly for computed VIEWONLY fields
    loading?: boolean;
}
```

---

## 7. `IField` Property Documentation

### `state`

Controls how the field behaves and is rendered.

#### Allowed values

| State      | Description                       |
| ---------- | --------------------------------- |
| `EDITABLE` | Standard editable field           |
| `VIEW`     | Read-only visual display          |
| `HIDDEN`   | Not rendered                      |
| `VIEWONLY` | Read-only computed/display field  |
| `TABLE`    | Used for table-like rendering     |
| `ADDABLE`  | Field may be dynamically appended |

---

### `value`

Initial or current field value.

#### Typical values by field type

| Field Type                   | Value Type           |
| ---------------------------- | -------------------- |
| `STRING`, `TEXT`, `TEXTAREA` | `string`             |
| `NUMBER`                     | `number`             |
| `DATE`                       | `string` or `number` |
| `BOOLEAN`                    | `boolean`            |
| `SELECT`                     | `string` or `number` |
| `TABLE`                      | `any[]`              |
| `CUSTOM`                     | `any`                |

---

### `type`

Determines which UI component is rendered.

#### Supported values

| Type       | Description                 |
| ---------- | --------------------------- |
| `STRING`   | Standard short text input   |
| `TEXT`     | Alias for text input        |
| `NUMBER`   | Numeric input               |
| `DATE`     | Date picker                 |
| `SELECT`   | Dropdown / cascading select |
| `BOOLEAN`  | Checkbox / toggle           |
| `TEXTAREA` | Multiline text input        |
| `TABLE`    | Editable table              |
| `CUSTOM`   | Custom React component      |

---

### `config`

Field-specific configuration object.

Different field types use different config options.

---

### `component`

Only used for `CUSTOM` fields.

Specifies the component key to render.

---

### `validators`

Laravel-style validation rule strings.

---

### `error`

Current validation or server error message for the field.

---

### `info`

Optional helper text or informational message shown near the field.

---

### `expression`

Used for computed or derived values.

Typically useful with:

* `VIEWONLY` fields
* calculated totals
* formula-based fields
* table column computations

#### Example

```ts
total: {
    type: "NUMBER",
    state: "VIEWONLY",
    expression: "price * quantity"
}
```

---

### `loading`

Indicates async loading state (commonly used for selects or custom fields).

---

## 8. `IFieldConfig` Documentation

```ts
export interface IFieldConfig {
    min?: number;        // only for DATE and NUMBER
    max?: number;        // only for DATE and NUMBER
    data?: any[];        // only for SELECT
    limit?: number | null; // only for TABLE
    cols?: ITableColl[]; // only for TABLE
    loadData?: string[]; // only for SELECT
    hides?: string[];    // only for BOOLEAN
    isClamped?: boolean; // only for TABLE
    isMandatory?: string[]; // currently unused
    action?: string;     // only for TABLE
}
```

### Property Details

| Property      | Used By          | Description                               |
| ------------- | ---------------- | ----------------------------------------- |
| `min`         | `NUMBER`, `DATE` | Minimum allowed value/date                |
| `max`         | `NUMBER`, `DATE` | Maximum allowed value/date                |
| `data`        | `SELECT`         | Dropdown options                          |
| `limit`       | `TABLE`          | Max number of rows                        |
| `cols`        | `TABLE`          | Table column definitions                  |
| `loadData`    | `SELECT`         | Cascading select dependencies             |
| `hides`       | `BOOLEAN`        | Fields to hide dynamically                |
| `isClamped`   | `TABLE`          | Prevents values exceeding previous values |
| `isMandatory` | `TABLE`          | Reserved / currently unused               |
| `action`      | `TABLE`          | Server endpoint for row operations        |

---

## 9. Table Column Definition

```ts
export interface ITableColl {
    type: "NUMBER" | "SELECT" | "DATE" | "TEXT" | "FILE";
    state: "EDITABLE" | "VIEW" | "HIDDEN" | "VIEWONLY";
    data?: TableSelectItem[];
    loadData?: string[];
    id: string;
    expression?: string | null;
    default?: string | number;
    min?: number;
    max?: number;
    aggregate?: boolean;
    required?: boolean;
    link?: string;
}
```

### Table Column Properties

| Property      | Description                        |
| ------------- | ---------------------------------- |
| `type`        | Column input type                  |
| `state`       | Rendering state                    |
| `data`        | Select options                     |
| `loadData`    | Cascading dependencies             |
| `id`          | Unique column identifier           |
| `expression`  | Computed value formula             |
| `default`     | Default cell value                 |
| `min` / `max` | Numeric/date constraints           |
| `aggregate`   | Include in totals/aggregates       |
| `required`    | Required column input              |
| `link`        | Optional link or relation metadata |

---

## 10. Groups and Layout

### `FormGroup`

```ts
export type FormGroup = {
    state?: "EDITABLE" | "HIDDEN";
    type: "GROUP" | "TABS";
    value?: string[] | string[][] | Record<string, string[] | string[][]>;
    config?: {
        colls?: number;
        title?: string;
        collabsable?: boolean;
    };
};
```

---

## 11. `FormGroup` Property Documentation

### `state`

| Value      | Description                 |
| ---------- | --------------------------- |
| `EDITABLE` | Group is visible and active |
| `HIDDEN`   | Group is not rendered       |

---

### `type`

| Type    | Description                   |
| ------- | ----------------------------- |
| `GROUP` | Standard grouped field layout |
| `TABS`  | Tab-based layout              |

---

### `value`

Defines the structure of fields inside the group.

#### Supported layouts

| Value Type                               | Meaning                  |
| ---------------------------------------- | ------------------------ |
| `string[]`                               | Vertical field list      |
| `string[][]`                             | Grid / row-column layout |
| `Record<string, string[] \| string[][]>` | Tab-based structure      |

---

### `config`

Defines optional display and layout behavior for the group.

#### `config` type

```ts
config?: {
    colls?: number;
    title?: string;
    collabsable?: boolean;
}
```

#### Group Config Properties

| Property      | Description                                     |
| ------------- | ----------------------------------------------- |
| `colls`       | Number of columns to render in the group layout |
| `title`       | Group title/header                              |
| `collabsable` | Whether the group can be collapsed/expanded     |

#### Example

```ts
basicInfo: {
    type: "GROUP",
    value: [
        ["firstName", "lastName"],
        ["email", "phone"]
    ],
    config: {
        title: "Basic Information",
        colls: 2,
        collabsable: true
    }
}
```

---

## 12. Tabs Layout Example

```ts
addressTabs: {
    type: "TABS",
    value: {
        "Personal Address": ["street", "city", "zip"],
        "Billing Address": ["billingStreet", "billingCity", "billingZip"]
    },
    config: {
        title: "Addresses"
    }
}
```

---

## 13. Steps

```ts
type FormSteps = Record<string, string[]>;
```

Each key is a step ID and its value is an array of group IDs.

### Example

```ts
steps: {
    step1: ["basicInfo", "addressGroup"],
    step2: ["paymentGroup"]
}
```

Validation runs before moving to the next step.

---

## 14. Validation System (Laravel-Style)

Validation rules are defined as strings:

```ts
validators: [
    "required|string|min:3|max:50",
    "email",
    "numeric|min:0|max:100",
    "same:password_confirmation"
]
```

### Supported Rules

| Rule                 | Description                        |
| -------------------- | ---------------------------------- |
| `required`           | Field must not be empty            |
| `required_if`        | Required based on condition        |
| `nullable`           | Field may be empty                 |
| `string`             | Must be a string                   |
| `email`              | Must be valid email                |
| `numeric`            | Must be a number                   |
| `integer`            | Must be an integer                 |
| `digits:X`           | Must have exactly X digits         |
| `size:X`             | Must have exact length             |
| `min:X`              | Minimum number or string length    |
| `max:X`              | Maximum number or string length    |
| `between:min,max`    | Range check                        |
| `confirmed`          | Must match confirmation field      |
| `same:field`         | Must equal another field           |
| `at_least_one:a,b,c` | At least one checkbox must be true |
| `regex:/pattern/`    | Regex validation                   |
| `in:a,b,c`           | Must be one of allowed values      |

### Error Message Format

```txt
{fieldId}.{rule}.error
```

#### Examples

```txt
email.required.error
password.min.error
```

---

## 15. Expressions

Expressions allow runtime computed values.

```ts
expression: "price * quantity"
```

Used for:

* computed fields
* totals
* view-only outputs
* table formulas
* aggregates

### Example

```ts
subtotal: {
    type: "NUMBER",
    state: "VIEWONLY",
    expression: "unitPrice * amount"
}
```

---

## 16. Cascading Selects

```ts
config: {
    loadData: ["city", "street"]
}
```

To use cascading selects, provide a loader:

```tsx
<FormGenerator cascadeLoderFn={loaderFunction} />
```

### Loader Signature

```ts
type CascadeLoaderFn = (params: {
    target: string;
    source: string;
    value: any;
}) => Promise<any[]>;
```

---

## 17. Zustand Store Architecture

The form uses a centralized Zustand store:

```ts
export interface TFormStore {
    steps: FormSteps;
    groups: Record<string, FormGroup>;
    fields: Record<string, IField>;
    buttons: Button[];
    tabs: Record<string, Tab>;
    messages: Message[];
    alerts: Message[];
    buttonErrors: Message[];
    stepper: Stepper | null;
    csrfToken: string;

    setSteps: (steps: FormSteps) => void;
    setGroups: (groups: Record<string, FormGroup>) => void;
    setFields: (fields: Record<string, IField>) => void;
    appendFields: (newFields: Record<string, IField>) => void;
    updateFieldConfig: (fieldKey: string, newconfig: Partial<IFieldConfig>) => void;
    updateField: (fieldKey: string, updatedField: Partial<IField>) => void;
    getField: (fieldKey: string) => IField | undefined;

    setStepper: (stepper: Stepper) => void;
    setMessages: (messages: Message[]) => void;
    setButtons: (buttons: Button[]) => void;
    setButtonErrors: (messages: Message[]) => void;
    setAlerts: (alerts: Message[]) => void;

    setTabs: (tabs: Record<string, Tab>) => void;
    getTab: (id: string) => Tab | null;
    setTabFields: (id: string, field: Record<string, IField>) => void;

    setCsrfToken: (token: string) => void;

    initializeFrom: (data: FormDefinition) => void;
}
```

---

## 18. Utility: `extractFieldIds`

This helper extracts all field IDs from any `FormGroup` structure.

```ts
export function extractFieldIds(group: FormGroup): string[]
```

### Supports

* flat groups (`string[]`)
* grid groups (`string[][]`)
* tab groups (`Record<string, ...>`)

### Example

```ts
const ids = extractFieldIds(group);
```

Useful for:

* validation
* step traversal
* dependency resolution
* rendering pipelines

---

## 19. Basic Usage

```tsx
<FormGenerator
    definition={formDefinition}
    handleSubmit={(data) => console.log(data)}
    components={customComponents}
    cascadeLoderFn={cascadeLoader}
/>
```

---

## 20. Architecture Summary

| Layer                 | Responsibility  |
| --------------------- | --------------- |
| `FormDefinition`      | Form schema     |
| `Zustand Store`       | Form state      |
| `FormGenerator`       | Initialization  |
| `GenerateGroup`       | Layout          |
| `GenerateField`       | Field rendering |
| `Validation`          | Rule validation |
| `ExpressionEvaluator` | Computed values |
| `TableGenerator`      | Table handling  |
| `StepFormGenerator`   | Step navigation |

---

## 21. Summary

This library is a **schema-driven dynamic form engine** where:

* forms are defined in JSON/schema
* rendering is automatic
* validation uses Laravel-style rules
* layout is group-based
* fields can be computed using expressions
* tables are schema-defined
* steps are configuration-based
* state is centrally managed with Zustand

---

## 22. Recommended TypeScript Refactor

For the best developer experience, it is recommended to use the **discriminated union field type approach** shown above instead of relying only on the generic `IField`.

### Benefits

* Better IntelliSense
* Safer field configs
* Easier renderer logic
* Fewer runtime mistakes
* Cleaner schema authoring
