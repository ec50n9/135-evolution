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
      onClick: props.onMinimize,
    },
    {
      color: "#ef4444",
      onClick: props.onClose,
    },
  ];

  const Btn = ({ color }) =>
    h("div", {
      style: {
        width: "1rem",
        height: "1rem",
        borderRadius: "50%",
        backgroundColor: color,
        cursor: "pointer",
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
 * 预览区域
 */
const SectionPreview = {
  props: {
    sectionOuterHTML: String,
  },
  data() {
    return {
      enable3D: false,
      threeD: {
        dragging: false,
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    /**
     * 生成3D预览
     * @param {string} html html文本
     */
    makeIt3D(html) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const target = wrapper.firstChild;

      // 遍历子元素进行分层
      function makeLevel(el, level = 0) {
        el.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 4px 12px";
        el.style.transformStyle = "preserve-3d";
        el.style.transform += `translateZ(${level * 0.2}rem)`;
        if (el.children.length) {
          Array.from(el.children).forEach((child) =>
            makeLevel(child, level + 1)
          );
        }
      }
      makeLevel(target);

      return wrapper.innerHTML;
    },
  },
  computed: {
    sectionOuterHTMLPreview() {
      return this.sectionOuterHTML && this.enable3D
        ? this.makeIt3D(this.sectionOuterHTML)
        : this.sectionOuterHTML;
    },
  },
  watch: {
    enable3D(val) {
      if (val) {
        this.threeD.x = 45;
        this.threeD.y = 45;
      } else {
        this.threeD.x = 0;
        this.threeD.y = 0;
      }
    },
  },
  mounted() {
    // previewEl拖拽更新视图角度
    const maxAngle = 60;
    const { previewWrapperEl } = this.$refs;
    let startX = 0;
    let startY = 0;
    previewWrapperEl.addEventListener("mousedown", (e) => {
      if (!this.enable3D) return;
      e.preventDefault();

      const listenerEl = document.body;

      this.threeD.dragging = true;
      startX = e.pageX;
      startY = e.pageY;

      const onMouseMove = (e) => {
        if (!this.threeD.dragging) return;
        const x = e.pageX - startX;
        const y = e.pageY - startY;
        (this.threeD.x > maxAngle && x > 0) ||
          (this.threeD.x < -maxAngle && x < 0) ||
          (this.threeD.x += x);
        (this.threeD.y > maxAngle && y < 0) ||
          (this.threeD.y < -maxAngle && y > 0) ||
          (this.threeD.y -= y);

        startX = e.pageX;
        startY = e.pageY;
      };
      const onMouseUp = () => {
        this.threeD.dragging = false;
        listenerEl.removeEventListener("mousemove", onMouseMove);
        listenerEl.removeEventListener("mouseup", onMouseUp);
      };

      listenerEl.addEventListener("mousemove", onMouseMove);
      listenerEl.addEventListener("mouseup", onMouseUp);
    });
  },
  render() {
    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          rowGap: "0.5rem",
          padding: "0.5rem",
          overflowX: "visible",
          overflowY: "auto",
        },
      },
      [
        h("div", { style: { display: "flex", alignItems: "center" } }, [
          h(
            "div",
            {
              style: {
                padding: "0 .3rem",
                color: "#fff",
                backgroundColor: "#3b82f6",
              },
              onClick: () => (this.enable3D = !this.enable3D),
            },
            `3D预览: ${this.enable3D ? "开" : "关"}`
          ),
        ]),
        h(
          "div",
          { ref: "previewWrapperEl" },
          h("div", {
            style: {
              perspective: "60rem",
              transform: `rotateY(${this.threeD.x}deg) rotateX(${this.threeD.y}deg)`,
              transformStyle: "preserve-3d",
              transition: this.threeD.dragging ? "none" : "all 0.3s",

              userSelect: "none",
              cursor: "grab",
            },
            innerHTML: this.sectionOuterHTMLPreview ?? "请点击编辑器中的元素",
          })
        ),
      ]
    );
  },
};

/**
 * 添加样式
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

    // 注入激活后的样式
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
    // 处理最小化点击
    handleMinimize() {
      console.log("handleMinimizeClick");
    },
    // 处理关闭点击
    handleClose() {
      console.log("handleCloseClick");
    },
    // 处理编辑器点击
    handleEditorClick(e) {
      this.editingEl?.classList.remove("ective");
      this.editingEl = e.target;
      this.editingEl.classList.add("ective");
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
        h(Header, {
          ref: "headerEl",
          title: `预览`,
          onMinimize: this.handleMinimize,
          onClose: this.handleClose,
        }),
        h(SectionPreview, { sectionOuterHTML: this.editingEl?.outerHTML }),
      ]
    );
  },
};
