import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  forwardRef,
} from "react";
import MarkdownIt from "markdown-it";
import MarkdownItKatex from "@liradb2000/markdown-it-katex";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItToc from "markdown-it-toc-done-right";
import slugify from "slugify";
// import MarkdownItApexCharts, { ApexRender } from "markdown-it-apexcharts";
import MarkdownItMermaid from "@liradb2000/markdown-it-mermaid";
import "./md.css";
import "katex/dist/katex.min.css";
import MarkdownItFootnote from "markdown-it-footnote";
// import MarkDownItAttrs from "markdown-it-attrs";
import {
  MarkdownItBizCharts,
  processingInstructions,
} from "./markdown-it-bizcharts";

// import _ from "lodash";

import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  AutoSizer,
  WindowScroller,
} from "react-virtualized";

import { Parser } from "html-to-react";
import { styled } from "@mui/material";

const slugifyFunc = (s) => slugify(s);

const MarkDownViewerWrapper = styled("div")({
  width: "100%",
  height: "100%",
});

const PreviewArea = React.memo(
  forwardRef(
    (
      {
        container = null,
        mdText: _mdText,
        backgroundColor = "white",
        color = null,
        resizeFont = true,
        cb,
      },
      ref
    ) => {
      const [mdText, setMdText] = useState(_mdText);
      const _mdArea = useRef(null);
      const mdArea = ref || _mdArea;

      const _lastWidth = useRef();
      const [renderList, setRenderList] = useState([]);
      const cache = useRef(
        new CellMeasurerCache({
          defaultHeight: 20,
          fixedWidth: true,
        })
      );
      const handleClickhref = useCallback((e) => {
        const { page } = e.currentTarget.dataset ?? {};
        if (!page) return;
        cb.setPage?.(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      function rowRenderer({ index, isScrolling, key, parent, style }) {
        const source = renderList[index]; // This comes from your list data
        return (
          <CellMeasurer
            cache={cache.current}
            columnIndex={0}
            key={key}
            parent={parent}
            rowIndex={index}
          >
            {({ measure, registerChild }) =>
              source({
                measure: measure,
                registerChild: registerChild,
                style: style,
              })
            }
          </CellMeasurer>
        );
      }

      function _handleOnResize({ width }) {
        if (_lastWidth.current !== width) {
          _lastWidth.current = width;
          if (resizeFont) {
            mdArea.current.style.fontSize = `${0.0125 * width}px`;
          }
          cache.current.clearAll();
        }
      }

      const renderMarkdown = useCallback(() => {
        var md = MarkdownIt({
          html: false,
          linkify: true,
          typographer: true,
          breaks: true,
          xhtmlOut: false,
        });

        md.use(MarkdownItKatex, {
          output: "htmlAndMathml",
          strict: false,
        })
          .use(MarkdownItAnchor, {
            level: [1, 2, 3],
            slugify: slugifyFunc,
            permalink: true,
            // renderPermalink: (slug, opts, state, permalink) => {},
            permalinkClass: "material-icons-outlined anchor",
            permalinkSymbol: "link",
            permalinkBefore: false,
          })
          .use(MarkdownItToc, {
            level: [1, 2],
            slugify: slugifyFunc,
          })
          .use(MarkdownItMermaid, {
            theme: "dark",
          })
          .use(MarkdownItFootnote)
          .use(MarkdownItBizCharts);

        return md.render(mdText || "-");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [mdText]);

      useEffect(() => {
        let isValidNode = function () {
          return true;
        };

        const preprocessingInstructions = [
          {
            shouldPreprocessNode: function (node) {
              return (
                node.attribs &&
                node.attribs["href"] &&
                node.attribs["href"].startsWith("#page:")
              );
            },
            preprocessNode: function (node) {
              node.attribs = {
                ...node.attribs,
                // href: undefined,
                // "data-page": node.attribs["href"].replace("#page:", ""),
                onClick: handleClickhref,
              };
            },
          },
        ];

        // var htmlToReactParser = new Parser();
        // setRenderList(htmlToReactParser.parse(renderMarkdown()));

        var htmlToReactParser = new Parser();
        var reactComponent = htmlToReactParser.parseWithInstructions(
          renderMarkdown(),
          isValidNode,
          processingInstructions,
          preprocessingInstructions
        );

        setRenderList(reactComponent);

        cache.current.clearAll();
        // ApexRender();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [mdText]);

      useEffect(() => {
        setMdText(_mdText);
      }, [_mdText]);
      useEffect(() => {
        cb.update = (v) => setMdText(v);
        return () => (cb.update = undefined);
      }, [cb]);

      return (
        <MarkDownViewerWrapper
          className="markdown-body"
          ref={mdArea}
          style={{ backgroundColor, color }}
        >
          {renderList.length > 0 ? (
            !!container ? (
              <WindowScroller scrollElement={container.current ?? container}>
                {({ height, scrollTop }) => (
                  <AutoSizer disableHeight onResize={_handleOnResize}>
                    {({ width }) => (
                      <List
                        deferredMeasurementCache={cache.current}
                        rowHeight={cache.current.rowHeight}
                        overscanRowCount={0}
                        rowCount={renderList.length}
                        rowRenderer={rowRenderer}
                        autoHeight={true}
                        height={height ?? 300}
                        width={width}
                        scrollTop={scrollTop}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            ) : (
              <div
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
              >
                <AutoSizer onResize={_handleOnResize}>
                  {({ width, height }) => (
                    <List
                      deferredMeasurementCache={cache.current}
                      rowHeight={cache.current.rowHeight}
                      overscanRowCount={0}
                      rowCount={renderList.length}
                      rowRenderer={rowRenderer}
                      height={height ?? 300}
                      width={width}
                    />
                  )}
                </AutoSizer>
              </div>
            )
          ) : (
            <React.Fragment />
          )}
        </MarkDownViewerWrapper>

        // <div className="markdown-body" dangerouslySetInnerHTML={{__html:renderMarkdown(props.text)}}></div>
      );
    }
  )
);

export default PreviewArea;
