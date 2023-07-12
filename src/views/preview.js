import EcWindow from "../components/ec-window.js";
import { addStyle } from "../utils/inject-util.js";

const { h } = Vue;

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

export default {
  data() {
    return { editorEl: null, editingEl: null };
  },
  mounted() {
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
    // 处理编辑器点击
    handleEditorClick(e) {
      this.editingEl?.classList.remove("ective");
      this.editingEl = e.target;
      this.editingEl.classList.add("ective");
    },
  },
  render() {
    return h(
      EcWindow,
      {},
      {
        default: () =>
          h(SectionPreview, { sectionOuterHTML: this.editingEl?.outerHTML }),
      }
    );
  },
};
