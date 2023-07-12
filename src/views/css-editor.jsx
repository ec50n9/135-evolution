import EcWindow from "../components/ec-window.jsx";

// 格式化css文本
const formatCssText = (cssText) => {
  const cssTextArr = cssText.split(";").filter((item) => item);
  const result = cssTextArr.reduce((prev, item) => {
    const [key, value] = item.split(":");
    prev += `${key.trim()}: ${value.trim()};\n`;
    return prev;
  }, "");
  return result;
};

// 压缩css文本
const minimizeCssText = (cssText) => {
  const cssTextArr = cssText
    .trim()
    .split(";")
    .filter((item) => item);
  const result = cssTextArr.reduce((prev, item) => {
    const [key, value] = item.split(":");
    prev += `${key.trim()}:${value.trim()};`;
    return prev;
  }, "");
  return result;
};

// css编辑器
const CssEditor = {
  props: {
    cssText: String,
  },
  methods: {
    handleKeydown(e) {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        e.stopPropagation();

        this.$emit("save");
      }
    },
  },
  render() {
    return (
      <div style={{ padding: "1rem" }}>
        <textarea
          style={{
            width: "100%",
            height: "10rem",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "Consolas, monospace",
            fontSize: "1rem",
          }}
          value={this.cssText}
          onInput={(e) => {
            this.$emit("update:cssText", e.target.value);
          }}
          onFocus={() =>
            document.addEventListener("keydown", this.handleKeydown)
          }
          onBlur={() =>
            document.removeEventListener("keydown", this.handleKeydown)
          }
        ></textarea>
      </div>
    );
  },
};

// css编辑器窗口
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cssText: "",
    };
  },
  watch: {
    "context.editingEl": {
      immediate: true,
      handler(el) {
        const originCssText = el?.style?.cssText ?? "";
        this.cssText = formatCssText(originCssText);
      },
    },
  },
  render() {
    return (
      <EcWindow title='CSS编辑器hello'>
        <CssEditor
          cssText={this.cssText}
          onUpdate:cssText={(val) => (this.cssText = val)}
          onSave={() => {
            (this.context.editingEl ?? {}).style.cssText = minimizeCssText(
              this.cssText
            );
          }}
        />
      </EcWindow>
    );
  },
};
