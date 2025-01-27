/**
 * @fileOverview 课程表编辑器的类型定义
 */
import { DateTime } from "luxon";

/**
 * 课程信息接口
 */
interface Subject {
    /** 课程名称 */
    name: string;
    /** 课程简称 */
    shortName: string;
    /**
     * 课程备注
     * 因为课程的名称无法表达所有信息，所以可以通过备注来补充，其他的名称就没什么关系了，用不着
     */
    notes: string;
    /** 教师姓名 */
    teacherName: string;
    /** 附加信息 */
    attach?: {
        [key: string]: any;
    };
}

/**
 * 时间表接口
 */
interface Timetable {
    /** 时间表名称 */
    name: string;
    /** 时间表布局，key为布局ID */
    layouts: {
        [key: string]: LessonLayout | BreakLayout;
    };
    /** 附加信息 */
    attach?: {
        [key: string]: any;
    };
}

/**
 * 基础布局接口
 */
interface BaseLayout {
    /** 开始时间 */
    startTime: DateTime;
    /** 结束时间 */
    endTime: DateTime;
    /**
     * 是否单独显示
     * 为true时，只有时间适合时，才会显示在一个独立的位置，而不是和课程一起显示
     */
    hide: boolean;
    /** 附加信息 */
    attach?: {
        [key: string]: any;
    };
}

/**
 * 课程布局接口，继承自基础布局
 */
interface LessonLayout extends BaseLayout {
    /** 布局类型 */
    type: "lesson";
    /** 默认课程的ID */
    subjectId: string;
}

/**
 * 休息时间布局接口，继承自基础布局
 */
interface BreakLayout extends BaseLayout {
    /** 布局类型 */
    type: "break";
    /** 课间休息的名称 */
    breakName: string;
}

type ClassType = {
    /** 时间ID */
    timeId: string;
    /** 课程ID */
    subjectId: string;
    /** 附加信息 */
    attach?: {
        [key: string]: any;
    };
};

/**
 * 课程表接口
 */
interface Curriculum {
    /** 课程表名称 */
    name: string;
    /** 关联的时间表ID */
    timetableId: string;

    /**
     * 课程安排列表
     * 对课程表规定的时间的具体实现
     */
    classes: ClassType[];
    /** 附加信息 */
    attach?: {
        [key: string]: any;
    };
}

type TimeGroupLayout = {
    /**
     * layout的类型 可以选择是另一个timeGroup或者是一个课表
     */
    type: "curriculum" | "timegroup";
    id: string;
    attach?: {
        [key: string]: any;
    };
};

interface TimeGroup {
    /**
     * 时间组的名称
     */
    name: string;
    /**
     * 时间组的粒度
     */
    granularity: "day" | "week" | "month" | "year";
    /**
     * 时间组的周期 比如以天为粒度，周期为2，那么就要给这两天分配对应的课表/时间组
     */
    cycle: number;
    /**
     * 开始时间
     * 为null时，表示继承父级时间组的开始时间
     * 为DateTime时，表示具体的开始时间
     */
    startTime: DateTime | null;
    /**
     * 对周期中每个时间段的分布
     * example:
     * cycle = 2
     * 那么layout的长度应该为2，每个元素对应一个时间段
     */
    layout: TimeGroupLayout[];
    attach?: {
        [key: string]: any;
    };
}

/**
 * 课程对象类型，key为课程ID
 */
export type SubjectObject = {
    [key: string]: Subject;
};

/**
 * 时间表对象类型，key为时间表ID
 */
export type TimetableObject = {
    [key: string]: Timetable;
};

/**
 * 课程表对象类型，key为课程表ID
 */
export type CurriculumObject = {
    [key: string]: Curriculum;
};
/**
 * 时间组对象类型，key为时间组ID
 */
export type timeGroupObject = {
    [key: string]: TimeGroup;
};
export type ScheduleEditorStore = {
    subjects: SubjectObject;
    timetables: TimetableObject;
    curriculums: CurriculumObject;
    timeGroups: timeGroupObject;
};
