/**
 * @fileOverview 插件的类型
 */
import {defineComponent} from "vue";
import {Store} from "pinia";

/**
 * 插件的组件
 */
interface PluginComponent<T extends string = string> {
    settingPage: ReturnType<typeof defineComponent> | null;
    mainPage: Record<T, ReturnType<typeof defineComponent>> | null;
}

/**
 * 插件对象
 */
export interface IPlugin<T extends string = string> {
    name: string;
    id: string;
    description: string;
    component: PluginComponent<T>;
    api?: Record<string, any>;
    init: (store: PluginStore<T>) => void;
}

export interface PluginState<T extends string = string> extends StateTree {
    componentStatus: Record<T, DraggableComponentConfig>;
}

export type PluginStore<T extends string = string> = Store<
    string,
    PluginState<T>
>;

/**
 * 插件实例
 */
export interface InstancePlugin {
    pluginObject: IPlugin;
    store: PluginStore;
}

/**
 * 仅暴露插件的组件以及其store
 */
export interface PluginComponentStore {
    component: PluginComponent;
    store: PluginStore;
    id: string;
}

/**
 * 可拖拽组件的参数
 */
export interface DraggableComponentConfig {
    maxWidth: number;
    maxHeight: number;
    minWidth: number;
    minHeight: number;
    width: number | "auto";
    height: number | "auto";
    x: number;
    y: number;
    draggable: boolean;
    resizable: boolean;
    zIndex: number;
}

export interface PluginProps {
    store: PluginStore;
}
