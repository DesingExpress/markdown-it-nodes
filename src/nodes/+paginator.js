import { Pure } from "@design-express/fabrica";

export class collection extends Pure {
  static path = "Markdown/Paginator";
  static title = "Collection";
  static description = "Collection";

  constructor() {
    super();
    this.addInput("page", "markdown::page");
    this.addInput("page", "markdown::page");
    this.addOutput("paginator", "markdown::collection");
  }
  onGetInputs() {
    return [["add Page", "markdown::page"]];
  }

  onExecute() {
    const _inputs = this.getInputs();
    const collection = Object.fromEntries(
      _inputs.map((_, idx) => this.getInputData(idx + 1))
    );

    this.setOutputData(1, collection);
  }
}

export class page extends Pure {
  static path = "Markdown/Paginator";
  static title = "Page";
  static description = "Page";

  constructor() {
    super();
    this.properties = { path: "" };
    this.addInput("text", "string");
    this.addInput("path", "string");

    this.addOutput("page", "markdown::page");
    this.addWidget("text", "path", this.properties.path, "path");
    this.widgets_up = true;
    this.widgets_start_y = 26;
  }

  onExecute() {
    const text = this.getInputData(1);
    const path = this.getInputData(2) ?? this.properties.path ?? "";

    this.setOutputData(1, [path, text]);
  }
}
