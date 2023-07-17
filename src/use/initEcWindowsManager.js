import { reactive } from "vue";
import { markRaw } from "vue";

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
const createWindow = (options) => ({
  id: options.id || generateId(),
  title: options.title,
  component: markRaw(options.component),
});

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
    createWindow,
  };

  globalContext.windowsManager = windowsManager;
}
