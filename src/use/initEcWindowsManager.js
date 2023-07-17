import EcWindow from "../components/ec-window/index.vue";
import { markRaw, reactive, h } from "vue";

/**
 * 生成随机id
 */
const generateId = () => {
  return Math.random().toString(36).slice(2, 10);
};

/**
 * 创建窗口
 * @param {object} globalContext 上下文
 * @param {object} options
 * @param {string} [options.id]
 * @param {string} [options.title]
 * @param {object} options.component
 * @returns {object} 窗口
 * @returns {string} 窗口.id
 * @returns {object} 窗口.rect
 * @returns {object} 窗口.component
 */
const createWindow = (globalContext, options) => {
  // 初始化参数
  options.id = options.id || generateId();

  const rect = reactive({
    x: 0,
    y: 0,
  });
  const warpper = h(
    EcWindow,
    {
      title: options.title,
      rect,
      onDrag: ({ x, y }) => {
        rect.x = x;
        rect.y = y;
      },
      onMinimize: () => {
        console.log("minimize", options.id);
      },
      onClose: () => {
        console.log("close", options.id);
        globalContext.windowsManager.closeWindow(options.id);
      },
    },
    {
      default: () => h(options.component),
    }
  );

  return {
    id: options.id,
    rect,
    component: markRaw(warpper),
  };
};

/**
 * 窗口管理器
 * @param {object} globalContext 上下文
 * @param {object[]} initWindows 初始化窗口
 * @returns 窗口管理器相关的上下文
 */
export default function (globalContext, initWindows) {
  const context = globalContext.data;

  const list = reactive([]);
  initWindows.map((item) => {
    list.push(createWindow(globalContext, item));
  });

  const windowsManager = {
    list,
    createWindow: (options) => {
      const window = createWindow(globalContext, options);
      list.push(window);
      return window;
    },
    closeWindow: (id) => {
      const index = list.findIndex((item) => item.id === id);
      if (index === -1) return;
      list.splice(index, 1);
    },
  };

  globalContext.windowsManager = windowsManager;
}
