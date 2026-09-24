---
title: "DailyFlow 使用指南：用桌面应用或 AI Agent 管理日程"
description: "DailyFlow 的完整上手指南：从 Windows 桌面应用、悬浮窗和便签到 AI Agent 对话管理，了解如何在同一份本地数据上安排和跟踪任务。"
pubDate: 2026-09-25
category: "效率工具"
tags: ["DailyFlow", "Windows", "AI Agent", "效率工具"]
---

如果你希望有一个随时可见、又不依赖云端账号的日程工具，DailyFlow 提供了两种入口：直接使用 Windows 桌面应用，或者把日程管理交给支持 Skill 的 AI Agent。

两种方式使用同一份本地数据。你在桌面应用里添加的任务，Agent 可以读取；Agent 创建或修改的任务，也会立即同步到应用中。日常查看适合用桌面界面，需要批量整理或用自然语言表达需求时，则可以直接和 Agent 对话。

## 安装并打开 DailyFlow

从 [GitHub Releases](https://github.com/Skydoge-zjm/DailyFlow/releases) 下载 Windows 安装包，可以选择 MSI 或 NSIS 版本。安装并首次打开后，主界面会展示当天的安排、完成进度、任务列表和周历。

DailyFlow 不要求注册云端账号。安装完成后就可以直接创建任务，后续再根据需要配置悬浮窗、便签和提醒。

![DailyFlow 主界面：查看当天安排、完成进度和周历](/images/dailyflow/dailyflow-main.png "DailyFlow 主界面（示例数据）") {width=1360 height=1000}

## 用桌面应用管理日程

### 查看和安排任务

主界面会按时间展示当天的日程和待办。你可以通过周历切换日期，搜索已有任务，也可以切换到列表视图或四象限视图，从不同角度整理工作重点。

需要记录新事项时，使用快速添加即可。打开任务编辑界面后，可以继续调整日期、时间、优先级、标签、备注和重复规则；完成任务后直接勾选即可更新状态。

DailyFlow 支持几种常见的任务形态：

- **日程或普通待办**：指定开始时间的事项会作为日程显示；没有开始时间的事项会作为全天待办。
- **截止事项**：适合跟踪有明确完成期限、但不一定占用固定时段的任务。
- **长期目标**：可以不设置日期，用来记录需要持续推进的方向。

这样的区分可以把“什么时候做”“什么时候必须完成”和“长期想推进什么”分开管理，减少任务列表里的混杂信息。

### 使用今日悬浮窗

今日悬浮窗可以常驻桌面，适合在工作过程中快速查看当天安排。你可以直接在悬浮窗中添加任务或标记完成，也可以将窗口置顶、拖动到合适的位置并调整大小。

悬浮窗关闭后，还可以从系统托盘重新打开。把它放在经常能看到的位置，就不需要为了确认下一件事反复切换窗口。

![DailyFlow 今日悬浮窗：查看当天任务并快速添加事项](/images/dailyflow/dailyflow-widget.png "DailyFlow 今日悬浮窗（示例数据）") {width=295 height=375}

### 使用桌面便签

临时想法、会议记录或还没整理成任务的内容，可以先写入桌面便签。DailyFlow 支持创建多张便签，并对每张便签进行移动、缩放、置顶、隐藏和换色。

便签更适合承接短期信息，正式任务则继续放在任务系统中。等内容明确后，再把便签里的想法整理成带日期、优先级或提醒的任务即可。界面主题和其他外观选项也可以在应用设置中调整。

## 让 AI Agent 帮你管理任务

如果你更习惯用对话安排工作，可以让 Codex、Claude Code、WorkBuddy 等支持 Skill 的 AI Agent 调用 DailyFlow CLI。

### 第一步：让终端找到 `dailyflow`

打开 DailyFlow 主界面的“设置”，先检测 PATH，再使用一键添加功能写入 DailyFlow 命令路径。完成后重新打开终端或 AI Agent，让新的 PATH 配置生效。

### 第二步：安装 `dailyflow-cli` Skill

将仓库中的 [`dailyflow-cli` Skill](https://github.com/Skydoge-zjm/DailyFlow/tree/main/skills/dailyflow-cli) 安装到所用 Agent 支持的 Skill 目录。不同工具的目录位置和安装方式可能不同，按照对应工具的说明完成配置即可。

配置完成后，Agent 就能通过 CLI 查询和更新 DailyFlow 中的任务、日程与相关信息。

### 第三步：直接用自然语言提出需求

你不需要记住 CLI 参数，可以直接描述想完成的事情，例如：

> 帮我安排明天下午两点的产品评审，预计一小时，设为高优先级。

> 今天还有哪些事情没完成？先告诉我逾期的。

> 把团队周会改到周五上午十点。

当日期、时间、事项和目标都足够明确时，Agent 会直接执行；如果缺少必要信息，或者一句话里有多个目标无法区分，它才会继续询问。

## 两个实际使用场景

### 安排后再取消组会

先用一句话告诉 Agent 需要安排什么时间的组会，Agent 会创建任务并返回日期、时间和提醒设置。临时有变化时，继续说“组会取消了”，它会根据刚才创建的任务删除对应安排，并确认当天的时间已经空出来。

![Agent 先安排下午组会，再根据“组会取消了”删除对应任务](/images/dailyflow/agent-meeting-cancel.png "安排并取消组会的对话") {width=1447 height=754}

### 从带链接的通知创建截止事项

收到带网页链接的微信通知时，可以把消息原文直接粘贴给 Agent。Agent 会读取链接中的通知内容，提取其中的日期和要求，再自动创建截止事项，不需要手动打开网页抄录信息。

![用户直接粘贴带链接的微信通知](/images/dailyflow/agent-wechat-notification.png "带链接的通知原文") {width=1439 height=141}

下面的示例中，Agent 从通知里识别出两个 C2 相关截止日期，并把它们写入 DailyFlow。创建完成后，两个事项会和其他任务一样出现在桌面悬浮窗中，后续可以继续修改、完成或查看详情。

![Agent 根据网页通知自动创建两个截止事项，并同步到今日悬浮窗](/images/dailyflow/agent-wechat-deadlines.png "自动创建的两个截止事项") {width=293 height=318}

## 提醒和重复任务

指定开始时间的任务默认会在开始时提醒。如果某个任务不需要提醒，可以直接告诉 Agent 关闭提醒。

提醒由 DailyFlow 桌面应用发送，因此需要保持 DailyFlow 运行。重复任务完成后，系统会自动生成下一次安排，不需要每次手动重新创建。

## 本地数据如何同步

任务、便签和设置都保存在本机的 JSON 文件中，不需要 DailyFlow 云端账号。桌面应用与 Agent 通过这份共享数据协同工作：应用负责可视化查看、快速编辑和提醒，Agent 负责理解自然语言并执行查询或批量修改。

这也意味着，Agent 只会通过 CLI 访问完成当前请求所需的数据；你可以继续在桌面应用中检查结果、调整细节或手动完成任务。

## 相关链接

- [GitHub 源码仓库](https://github.com/Skydoge-zjm/DailyFlow)
- [下载 Windows 版本](https://github.com/Skydoge-zjm/DailyFlow/releases)
- [CLI 参考文档](https://github.com/Skydoge-zjm/DailyFlow/blob/main/docs/CLI.md)
