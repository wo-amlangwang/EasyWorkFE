// 用户信息结构
interface UserInfo {
    id: number // 用户ID
    username: string // 用户名
    nickname: string // 昵称
    email: string   // 邮箱
    user_pic: string // 用户头像
}


// 项目信息结构
interface ProjectInfo {
    id: number // 项目ID
    name: string // 项目名称
    details: string // 项目详情
    master: string // 创建者
    create_time: string // 创建时间
    deleted: number // 是否删除
}

interface TaskInfo {
    id: number // 任务ID
    name: string // 任务名称
    details: string // 任务详情
    type: number, // 任务类型
    create_user: string // 创建者
    update_user: string // 更新者
    priority: number // 优先级
    create_time: string // 创建时间
    update_time: string // 更新时间
    deadline: string // 截止时间
    assignee: string[] // 指派者
    status: number // 状态
    task_comment: string // 任务评论
    deleted: number // 是否删除

    time_line: TimeLine[] // 任务时间轴
}

interface TimeLine {
    id: number // 时间线ID
    type: number // 事件类型
    user: string // 事件发生者
    time: string // 事件发生时间
    details: string // 事件详情
}

export type {
    UserInfo,
    ProjectInfo,
    TaskInfo,
    TimeLine
}