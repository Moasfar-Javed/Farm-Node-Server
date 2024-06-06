// scheduler.js
import schedule from "node-schedule";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.resolve("res/scheduled_tasks.json");

class SchedulingUtility {
  constructor() {
    this.scheduledTasks = {};
    this.taskFunctions = {};
    this.loadTasksFromFile().then((e) => {});
  }
  async loadTasksFromFile() {
    try {
      await fs.access(filePath);

      const data = await fs.readFile(filePath, "utf-8");
      const tasks = JSON.parse(data);

      for (const id in tasks) {
        const { time, taskFunction } = tasks[id];
        const task = new Function("return " + taskFunction)();
        this.scheduleTask(id, time, task, false);
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Error loading tasks from file:", error);
      }
    }
  }

  async saveTasksToFile() {
    const tasks = {};
    for (const id in this.scheduledTasks) {
      const job = this.scheduledTasks[id];
      tasks[id] = {
        time: `${job.nextInvocation().getHours()}:${job
          .nextInvocation()
          .getMinutes()}`,
        taskFunction: this.taskFunctions[id].toString(),
      };
    }

    await fs
      .writeFile(filePath, JSON.stringify(tasks, null, 2))
      .then((e) => {});
  }

  async scheduleTask(id, time, task, saveToFile = true) {
    if (this.scheduledTasks[id]) {
      this.scheduledTasks[id].cancel();
    }

    const [hour, minute] = time.split(":").map(Number);
    const rule = new schedule.RecurrenceRule();
    rule.hour = hour;
    rule.minute = minute;

    const job = schedule.scheduleJob(rule, task);
    this.scheduledTasks[id] = job;
    this.taskFunctions[id] = task; // Store the task function

    if (saveToFile) {
      await this.saveTasksToFile();
    }

    // console.log(`Task ${id} scheduled for ${time}`);
  }

  async cancelTask(id) {
    if (this.scheduledTasks[id]) {
      this.scheduledTasks[id].cancel();
      delete this.scheduledTasks[id];
      delete this.taskFunctions[id];
      await this.saveTasksToFile();
    } else {
      console.log(`No task with ID ${id} to cancel`);
    }
  }

  rescheduleTask(id, time, task) {
    this.scheduleTask(id, time, task);
    console.log(`Task ${id} rescheduled for ${time}`);
  }
}

export default new SchedulingUtility();
