# [Markdown-it](https://github.com/markdown-it/markdown-it) Nodes

Markdown node for document creation.

## Nodes Structure

```bash
 Markdown
 ├── Viewer
 ├── MultiLine
 └── Paginator
     ├── Collection
     └── Page

```

## 🔲Include Nodes

### `Viewer` Node

```litegraph
{
  "title": "Viewer",
  "inputs": [
    { "label": "toUpdate", "type":-1 },
    { "label": "text|collection", "type":"string,markdown::collection" }
  ],
  "outputs": [
    { "label": "component", "type":"component" }
  ]
}
```

#### Slots

##### Inputs

| Label                  | Type                            | Description |
| ---------------------- | ------------------------------- | ----------- |
| **toUpdate**           | `event`                         |             |
| **text \| collection** | `string`,`markdown::collection` |             |

##### Outputs

| Label         | Type        | Description |
| ------------- | ----------- | ----------- |
| **component** | `component` |             |

---

&nbsp;
&nbsp;

### `MultiLine` Node

```litegraph
{
  "title": "MultiLine",
  "inputs": [],
  "outputs": [
    { "label": "text", "type":"string" }
  ]
}
```

#### Slots

##### Inputs

| Label | Type | Description |
| ----- | ---- | ----------- |
| -     | -    | -           |

##### Outputs

| Label    | Type     | Description |
| -------- | -------- | ----------- |
| **text** | `string` |             |

---

&nbsp;
&nbsp;

### `Paginator/Collection` Node

```litegraph
{
  "title": "Collection",
  "inputs": [
    { "label": "page", "type":"markdown::page" }
  ],
  "outputs": [
    { "label": "paginator", "type":"markdown::collection" }
  ]
}
```

#### Slots

##### Inputs

| Label    | Type             | Description |
| -------- | ---------------- | ----------- |
| **page** | `markdown::page` |             |

##### Outputs

| Label         | Type                   | Description |
| ------------- | ---------------------- | ----------- |
| **paginator** | `markdown::collection` |             |

---

&nbsp;
&nbsp;

### `Paginator/Page` Node

```litegraph
{
  "title": "Page",
  "inputs": [
    { "label": "text", "type":"string" },
    { "label": "path", "type":"string" }
  ],
  "outputs": [
    { "label": "page", "type":"markdown::page" }
  ]
}
```

#### Slots

##### Inputs

| Label    | Type     | Description |
| -------- | -------- | ----------- |
| **text** | `string` |             |
| **path** | `string` |             |

##### Outputs

| Label    | Type             | Description |
| -------- | ---------------- | ----------- |
| **page** | `markdown::page` |             |

---

&nbsp;
&nbsp;

## Loadmap

-

## Contributing

Please visit [Github repository [ markdown-it-nodes ]](https://github.com/DesingExpress/markdown-it-nodes)

## Sources

[Github repository [ markdown-it-nodes ]](https://github.com/DesingExpress/markdown-it-nodes)

## License

[MIT](https://mit-license.org/)
