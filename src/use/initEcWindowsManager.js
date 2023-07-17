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
 * @param {object} options
 * @param {string} [options.id]
 * @param {string} [options.title]
 * @param {object} options.component
 */
const createWindow = (options) => {
  const warpper = h(
    EcWindow,
    {
      title: options.title,
    },
    {
      default: () => h(options.component),
    }
  );

  return {
    id: options.id || generateId(),
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
    list.push(createWindow(item));
  });

  const windowsManager = {
    list,
    createWindow: (options)=>{
      const window = createWindow(options);
      list.push(window);
      return window;
    },
  };

  globalContext.windowsManager = windowsManager;
}
