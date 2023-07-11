const { h } = Vue;

/**
 * 窗口标题栏
 * @param {{title: string}} props
 * @returns
 */
function Header(props) {
  const btns = [
    {
      color: "#f59e0b",
      onClick: () => {
        console.log("mini");
      },
    },
    {
      color: "#ef4444",
      onClick: () => {
        console.log("close");
      },
    },
  ];

  const Btn = ({ color }) =>
    h("div", {
      style: {
        width: "1rem",
        height: "1rem",
        borderRadius: "50%",
        backgroundColor: color,
      },
    });

  return h(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "2rem",
        padding: "0 0.5rem",
        borderBottom: "1px solid #e5e7eb",
        userSelect: "none",
        cursor: "move",
      },
    },
    [
      h("div", props.title),
      h(
        "div",
        {
          style: {
            display: "flex",
            columnGap: "0.5rem",
          },
        },
        btns.map((btn) => h(Btn, btn))
      ),
    ]
  );
}

/**
 * @param {string} cssText
 * @param {Element} target
 */
function addStyle(cssText, target) {
  const style = document.createElement("style");
  style.textContent = cssText;
  (target ? target : document.head).append(style);
}

export default {
  data() {
    return { count: 0, x: 0, y: 0, editorEl: null, editingEl: null };
  },
  mounted() {
    // 监听headerEl拖拽
    const { headerEl } = this.$refs;
    headerEl.addEventListener("mousedown", (e) => {
      const { clientX, clientY } = e;
      const { left, top } = headerEl.getBoundingClientRect();
      const disX = clientX - left;
      const disY = clientY - top;
      const move = (e) => {
        const { clientX, clientY } = e;
        this.x = clientX - disX;
        this.y = clientY - disY;
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    // 获取编辑器
    this.editorEl = document.querySelector("#ueditor_0");

    // 注入样式
    addStyle(
      `.ective {
      outline: 1.5px dashed #f43f5e !important;
      outline-offset: 2px !important;
      position: relative !important;
    }`,
      this.editorEl.contentDocument.head
    );

    // 监听editorEl点击
    this.editorEl.contentDocument
      .querySelector("body")
      .addEventListener("click", this.handleEditorClick);
  },
  beforeUnmount() {
    // 移除样式
    this.editorEl.contentDocument.head.lastElementChild.remove();

    // 移除监听
    this.editorEl.contentDocument
      .querySelector("body")
      .removeEventListener("click", this.handleEditorClick);
  },
  methods: {
    // 处理编辑器点击
    handleEditorClick(e) {
      this.editingEl?.classList.remove("ective");
      this.editingEl = e.target;
      this.editingEl.classList.add("ective");
    },
  },
  watch: {
    editingEl(el) {
      this.$refs.domContainer.innerHTML = el?.outerHTML ?? "请选择元素";
    },
  },
  render() {
    return h(
      "div",
      {
        style: {
          position: "fixed",
          left: `${this.x}px`,
          top: `${this.y}px`,
          display: "flex",
          flexDirection: "column",
          width: "24em",
          maxHeight: "90%",
          backgroundColor: "#fff",
          boxShadow:
            "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
          borderRadius: "1em",
        },
      },
      [
        h(Header, { ref: "headerEl", title: `x: ${this.x}, y: ${this.y}` }),
        h("div", { ref: "domContainer", style: { padding: "0.5rem" } }),
      ]
    );
  },
};
