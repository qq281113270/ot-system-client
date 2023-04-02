import "./index.less";

import { message } from "antd";
import React, { memo, useEffect } from "react";
import Layout from "client/component/Layout";
import { mapRedux } from "client/redux";

import Main from "./main";

const Quill = (props) => {
  const {
    match: {
      params: { action, id, type }
    },
    state: {
      user: {
        userInfo: {
          user: { id: userId, name: userName }
        }
      }
    }
  } = props;

  useEffect(() => {
    var toolbarOptions = [
      // ['bold', 'italic'],
      // ['link', 'image'],
      [{ align: [] }],
      ["link", "image", "bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      // [{ header: 1 }, { header: 2 }], // custom button values
      // [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      // [{ direction: 'rtl' }], // text direction
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],

      ["clean"] // remove formatting button
    ];

    // 实例化 富文本
    const main = new Main({
      quillElId: "#editor",
      quillOptions: {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
          cursors: {
            autoRegisterListener: false
          },
          history: {
            userOnly: true
          }
        },
        readOnly: true
      }
    });

    main.init({
      documentTitle: "ot协同文档",
      documentId: id, // 文档id
      documentType: type, // 文档类型
      userName, // 用户名称
      userId,
      // 文档连接状态
      onDocumentConnectionState: (state) => {
        var indicatorColor;
        // sharedbSocketStateEl.innerHTML = state;
        switch (state.toString()) {
          case "connecting":
            indicatorColor = "silver";
            break;
          case "connected":
            indicatorColor = "lime";
            break;
          case "disconnected":
          case "closed":
          case "stopped":
            indicatorColor = "red";
            break;
        }
        console.log("state=========", state);
        // sharedbSocketIndicatorEl.style.backgroundColor = indicatorColor;
      },
      // 光标连接状态
      onCursorConnectionState: (state) => {
        var indicatorColor;
        socketStateEl.innerHTML = state;
        switch (state.toString()) {
          case "connected":
            indicatorColor = "lime";
            break;
          case "error":
          case "closed":
            indicatorColor = "red";
            break;
        }
        socketIndicatorEl.style.backgroundColor = indicatorColor;
      },
      // 改变光标位置
      onChangeCursors: (data) => {
        // const { cursorList, localCursor } = data;
        // updateUserList(cursorList, localCursor);
      },
      // 改变文档内容
      onChangeDocument: (data) => {
        console.log("onChangeDocument", data);
      },
      // 文档websocket 连接
      documentConnectionUrl:
        (location.protocol === "https:" ? "wss" : "ws") +
        "://" +
        "127.0.0.1:3003" +
        "/socket/document" +
        `?documentId=${id}&documentType=${type}&userName=${"用户名"}&userId=123&documentTitle=ot协同文档`
      // // 光标websocket 连接
      // cursorConnectionUrl:
      //   (location.protocol === "https:" ? "wss" : "ws") +
      //   "://" +
      //   window.location.host +
      //   "/cursors" +
      //   `?documentId=${id}&documentType=${type}`,
    });

    main.quill.enable();
    
  }, []);
  return (
    <div className="account-management-details">
      <div id="editor"></div>
    </div>
  );
};

export default mapRedux(["user"])((props) => {
  return (
    <Layout
      mainProps={{
        sx: {
          flexGrow: 1,
          p: 0,
          height: "100vh",
          //  height: "calc(100vh - 30px)",
          overflow: "auto"
        }
      }}>
      <Quill {...props}></Quill>
    </Layout>
  );
});
