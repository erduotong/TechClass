/**
 * @fileOverview 课表展示器插件
 */
import {IPlugin} from "../../types/plugins";
import {ref} from "vue";
import {scheduleEditorApi} from "../scheduleEditor/scheduleEditorTypes";
import {InterPluginApi} from "../../modules/pluginUtils";
import logger from "../../modules/logger";
import nextLesson from "./component/nextLesson.vue"

type apiType = {} | scheduleEditorApi;
const scheduleEditorApi = ref<apiType>({});
let abortController: AbortController | null = null;
type mainPageKeys = "nextLesson"
export const scheduleDisplay: IPlugin<mainPageKeys> = {
    name: "课表展示器",
    description: "",
    id: "scheduleDisplay",
    isOfficial: true,
    component: {
        mainPage: {
            nextLesson: nextLesson,
        },
        settingPage: null,
    },
    hooks: {
        onMounted: (store, api) => {
            abortController = new AbortController();
            const signal = abortController.signal;

            InterPluginApi.getPluginApiPromise("scheduleEditor")
                .then((api) => {
                    if (!signal.aborted && api) {
                        scheduleEditorApi.value = api;
                        logger.debug("[scheduleDisplay] 获取scheduleEditorApi成功");
                    }
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        logger.trace("[scheduleDisplay] 已取消获取scheduleEditorApi")
                    }
                });
        },
        onUnmounted: () => {
            if (abortController) {
                abortController.abort();
                abortController = null;
            }
            scheduleEditorApi.value = {};
        },
    },
    storeConfig: {
        storageConfig: {
            enabled: true,
            keys: ["componentStatus"],

        }
    }
};
