import { Pure } from "@design-express/fabrica";

export class multiLine extends Pure {
  static path = "Markdown";
  static title = "MultiLine";
  static description = "MultiLine";

  constructor() {
    super();
    this.properties = {
      text: "",
    };

    this.addOutput("text", "string");
    this.addWidget("text", "text", this.properties.text, "text", {
      multiline: true,
    });
  }

  onExecute() {
    const text = this.properties.text;

    this.setOutputData(1, text);
  }
}
