import { Pure } from "@design-express/fabrica";
import PreviewArea from "./markdown";

export class mdViewer extends Pure {
  static path = "Markdown";
  static title = "Viewer";
  static description = "markdown viewer";

  constructor() {
    super();
    this.properties = {
      mdText: "",
      backgroundColor: "#FFFFFF",
      color: "#000000",
      resizeFont: false,
    };
    this.addInput("toUpdate", -1);
    this.addInput("text|collection", "string,markdown::collection");
    this.addOutput("component", "component");
    this.addWidget(
      "text",
      "backgroundColor",
      this.properties.backgroundColor,
      "backgroundColor"
    );
    this.addWidget("text", "color", this.properties.color, "color");
    this.addWidget(
      "toggle",
      "resizeFont",
      this.properties.resizeFont,
      "resizeFont"
    );
    this.cb = {
      _page: undefined,
      update: undefined,
      setPage(page) {
        this.update?.(this._page?.[page] ?? "");
      },
    };
  }

  onExecute() {
    const text = this.getInputData(2) ?? this.properties.mdText;
    const backgroundColor = this.properties.backgroundColor;
    const color = this.properties.color;
    const resizeFont = this.properties.resizeFont;
    let _text = text;
    if (typeof text === "object") {
      _text = text[""] ?? Object.values(text)[0];
      this.cb._page = text;
    }
    this.setOutputData(
      1,
      <PreviewArea
        mdText={_text}
        backgroundColor={backgroundColor}
        color={color}
        resizeFont={resizeFont}
        cb={this.cb}
      />
    );
  }
  onAction(name) {
    if (name === "toUpdate") {
      this.cb.update?.(this.getInputData(2) ?? this.properties.mdText);
    } else {
      return super.onAction(...arguments);
    }
  }
}
