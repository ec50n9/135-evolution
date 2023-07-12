import EcWindow from "../components/ec-window.jsx";

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
    return (
      <div style='display: flex; flex-direction: column; row-gap: 0.5rem;'>
        <div style='display: flex; align-items: center;'>
          <div
            style='padding: 0 .3rem; color: #fff; background-color: #3b82f6;'
            onClick={() => (this.enable3D = !this.enable3D)}
          >
            3D预览: {this.enable3D ? "开" : "关"}
          </div>
        </div>
        <div ref='previewWrapperEl'>
          <div
            style={`perspective: 60rem; transform: rotateY(${
              this.threeD.x
            }deg) rotateX(${
              this.threeD.y
            }deg); transform-style: preserve-3d; transition: ${
              this.threeD.dragging ? "none" : "all 0.3s"
            }; user-select: none; cursor: grab;`}
            innerHTML={this.sectionOuterHTMLPreview ?? "请点击编辑器中的元素"}
          ></div>
        </div>
      </div>
    );
  },
};

export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  render() {
    return (
      <EcWindow title='预览'>
        <SectionPreview sectionOuterHTML={this.context.editingEl?.outerHTML} />
      </EcWindow>
    );
  },
};
