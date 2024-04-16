import React from "react";
import * as BizCharts from "bizcharts";
import HtmlToReact from "html-to-react";

export const MarkdownItBizCharts = (md, opts) => {
  const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    // const code = `${token.info} \n ${token.content.trim()}`;
    const tmp = token.content.trim();
    if (token.info === "biz") {
      try {
        // error catch purpose
        const json = JSON.parse(tmp);

        return `<div data-name="bizchart"><div>${tmp}</div></div>`;
      } catch (err) {
        return `<pre>${err}</pre>`;
      }
    }

    return defaultRenderer(tokens, idx, opts, env, self);
  };
};

let processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

export const processingInstructions = [
  {
    shouldProcessNode: function (node) {
      // return node.parent && node.parent.name && node.parent.name === 'bizchart';
      return (
        node.parent &&
        node.parent.attribs &&
        node.parent.attribs["data-name"] &&
        node.parent.attribs["data-name"] === "bizchart"
      );
    },
    processNode: function (node, children) {
      const bizData = JSON.parse(node.children[0].data);

      // 이걸 동적으로 생성해주어야 겠네 ....
      return (
        <BizCharts.Chart {...bizData.Chart}>
          {Object.keys(bizData).map((v, i) => {
            if (v === "Chart") {
              return null;
            }

            // JSON 에서는 key 가 겹칠수 없습니다. 그럴때는 key 뒤에 숫자를 붙여주세요.
            // to remove duplicated comp, ex) Geom1 => Geom
            let key = v.replace(/\d+$/, "");

            const TempComp = BizCharts[key];

            return <TempComp key={v} {...bizData[v]} />;
          })}
        </BizCharts.Chart>
      );
    },
  },
  {
    shouldProcessNode: function (node) {
      return (
        node.attribs &&
        node.attribs["href"] &&
        node.attribs["href"].startsWith("#page:")
      );
    },
    processNode: function (node, children) {
      node.attribs = {
        ...node.attribs,
        href: null,
        "data-page": node.attribs["href"].replace("#page:", ""),
      };
      return React.createElement(node.tagName, node.attribs, children);
    },
  },
  {
    shouldProcessNode: function (node) {
      return (
        node.parent.type === "root" &&
        node.name === "p" &&
        node.children.length === 1 &&
        node.children[0].name === "img"
      );
    },
    processNode: function (node, children) {
      return ({ measure, registerChild, style }) => (
        <p ref={registerChild} style={style}>
          {React.cloneElement(children[0], {
            ...children[0].props,
            onLoad: measure,
          })}
        </p>
      );
    },
  },
  // {
  //     // Anything else
  //     shouldProcessNode: function (node) {
  //         return node.type === "text" && node.data === "\n";
  //     },
  //     processNode: ({ registerChild, style }) => (
  //         <br  />
  //     ),
  // },
  {
    // Anything else
    shouldProcessNode: function (node) {
      return node.parent?.type === "root";
    },
    processNode: _wrappingCellMeasure,
  },
  {
    // Anything else
    shouldProcessNode: function (node) {
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode,
  },
];

function _wrappingCellMeasure(node, children, index) {
  const source = processNodeDefinitions.processDefaultNode(
    node,
    children,
    index
  );
  return ({ registerChild, style }) => {
    return source.type ? (
      <div ref={registerChild} style={style}>
        {source}
      </div>
    ) : (
      <div style={{ ...style, height: 1 }} ref={registerChild} />
    );
  };
}
