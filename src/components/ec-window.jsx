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

  const Btn = ({ color }) => (
    <div
      style={{
        width: "1rem",
        height: "1rem",
        borderRadius: "50%",
        backgroundColor: color,
        cursor: "pointer",
      }}
    />
  );

  // return h(
  //   "div",
  //   {
  //     style: {
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //       height: "2rem",
  //       padding: "0 0.5rem",
  //       borderBottom: "1px solid #e5e7eb",
  //       userSelect: "none",
  //       cursor: "move",
  //     },
  //   },
  //   [
  //     h("div", props.title),
  //     h(
  //       "div",
  //       {
  //         style: {
  //           display: "flex",
  //           columnGap: "0.5rem",
  //         },
  //       },
  //       btns.map((btn) => h(Btn, btn))
  //     ),
  //   ]
  // );
  return (
    <div
      ref='headerEl'
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "2rem",
        padding: "0 0.5rem",
        borderBottom: "1px solid #e5e7eb",
        userSelect: "none",
        cursor: "move",
      }}
    >
      <div>{props.title}</div>
      <div
        style={{
          display: "flex",
          columnGap: "0.5rem",
        }}
      >
        {btns.map((btn) => (
          <Btn {...btn} />
        ))}
      </div>
    </div>
  );
}

export default {
  name: "EcWindow",
  props: {
    title: {
      type: String,
      default: "EcWindow",
    },
  },
  data() {
    return {
      activated: true,
      x: 0,
      y: 0,
    };
  },
  mounted() {
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
  },
  methods: {
    onMinimize() {
      this.activated = false;
    },
    onClose() {
      this.activated = false;
    },
  },
  render() {
    return (
      <div
        style={{
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
        }}
      >
        {/* 头部 */}
        <Header
          ref='headerEl'
          title={this.title}
          onMinimize={this.onMinimize}
          onClose={this.onClose}
        />
        {/* 内容 */}
        <div
          style={{
            flex: 1,
            overflow: "hidden auto",
            padding: "0.5rem",
          }}
        >
          {this.$slots.default()}
        </div>
      </div>
    );
  },
};
