// scheduler.js
import cron from "node-cron";
import storage from "node-persist";

class SchedulingUtility {
  constructor() {
    if (!SchedulingUtility.instance) {
      this.scheduledTasks = new Map();
      this.taskFunctions = new Map();
      this.initStorage();
      SchedulingUtility.instance = this;
    }

    return SchedulingUtility.instance;
  }

  async initStorage() {
    await storage.init({
      dir: "res/schedules",
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: "utf8",
      logging: false,
      continuous: true,
      interval: false,
      ttl: false,
      fileExtension: ".json",
      file: "scheduled_tasks.json",
    });
    await this.loadTasksFromStorage();
  }

  async loadTasksFromStorage() {
    const tasks = await storage.valuesWithKeyMatch(/^task_/);
    //console.log(tasks);
    for (const task of tasks) {
      if (!task) {
        console.error("Invalid task object:", task);
        continue;
      }

      const id = task.id;
      const { datetime, taskFunction } = task;
      const taskFn = new Function("id", `return ${taskFunction}`)();
      // console.error("Valid task object:", task);
      this.scheduleTask(id, datetime, taskFn, false);
    }
  }

  async saveTaskToStorage(id, datetime, taskFunction) {
    const cronTime = this.getCronExpressionFromDateTime(datetime);
    await storage.setItem(`task_${id}`, {
      id,
      datetime,
      taskFunction: taskFunction.toString(),
      cronTime,
    });
  }

  async removeTaskFromStorage(id) {
    await storage.removeItem(`task_${id}`);
  }

  scheduleTask(id, datetime, task, saveToFile = true) {
    console.log(this.scheduledTasks.has(id));
    if (this.scheduledTasks.has(id)) {
      this.scheduledTasks.get(id).stop();
    }

    const cronTime = this.getCronExpressionFromDateTime(datetime);

    console.log(cronTime);

    const job = cron.schedule(cronTime, () => task(id));

    this.scheduledTasks.set(id, job);
    this.taskFunctions.set(id, task);
    console.log(this.scheduledTasks);
    console.log(this.taskFunctions);
    if (saveToFile) {
      this.saveTaskToStorage(id, datetime, task);
    }
    // console.log(this.scheduledTasks);
  }

  async cancelTask(id) {
    if (this.scheduledTasks.has(id)) {
      this.scheduledTasks.get(id).stop();
      this.scheduledTasks.delete(id);
      this.taskFunctions.delete(id);
      await this.removeTaskFromStorage(id);
    } else {
      console.log(`No task with ID ${id} to cancel`);
    }
  }

  rescheduleTask(id, datetime, task) {
    this.scheduleTask(id, datetime, task, true);
    //console.log(`Task ${id} rescheduled for ${datetime}`);
  }

  getCronExpressionFromDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const minutes = date.getMinutes();
    const hours = date.getHours();
    return `${minutes} ${hours} * * *`;
  }
}

const instance = new SchedulingUtility();
Object.freeze(instance);

export default instance;
