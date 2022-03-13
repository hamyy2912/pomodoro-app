import LocalStore from '../helper/storeData';
import TaskModel from './task';
/**
 * @class Model
 *
 * Manages the task list data of the application.
 */
export default class TaskListModel {
  constructor() {
    this.taskListData = new LocalStore('taskListData');
    this.selectTaskData = new LocalStore('selectedTaskData');
    this.taskListModel = this.getTaskListModel();
    this.selectedTask = this.getSelectedTask();
    this.onUser = null;
  }

  getTaskListModel(tasks) {
    const taskInstances = [];
    if (tasks) {
      tasks.forEach((task) => {
        const taskInstance = new TaskModel(task);
        taskInstances.push(taskInstance);
      });  
    } else {
      if (this.taskListData.getItemLocalStorage()) {
        let tasks = this.taskListData.getItemLocalStorage();
        tasks.forEach((task) => {
          const taskInstance = new TaskModel(task);
          taskInstances.push(taskInstance);
        });  
      }  
    }
    return taskInstances;
  }

  getSelectedTask() {
    let selectedTask = this.selectTaskData.getItemLocalStorage();
    if (selectedTask || selectedTask == 0) {
      selectedTask = parseInt(this.selectTaskData.getItemLocalStorage());
    } else {
      selectedTask = null;
    }
    return selectedTask;
  }

  addTask(taskName, estPomo) {
    const taskData = {
      id: this.taskListModel.length > 0 ? this.taskListModel[this.taskListModel.length - 1].id + 1 : 0,
      taskName: taskName,
      estPomo: parseInt(estPomo),
      actPomo: 0,
      taskDone: false,
    };
    const task = new TaskModel(taskData);
    this.taskListModel.push(task);
  }

  editTaskList(id, newTaskData) {
    this.taskListModel.forEach((task) => {
      if (task.id == id) {
        task.editTask(newTaskData);
      }
    });
  }

  deleteTask(id) {
    this.taskListModel.forEach((task) => {
      if (task.id == id) {
        this.taskListModel.splice(id, 1);
        if (this.selectedTask == id) {
          this.selectedTask = null;
        }
      }
    });
    let count = 0;
    this.taskListModel.forEach((task) => {
      task.id = count;
      count++;
    });
  }

  changeTaskState(id) {
    this.taskListModel.forEach((task) => {
      if (task.id == id) {
        task.changeTaskStage();
      }
    });
  }

  selectTask(id) {
    this.selectedTask = id;
  }

  clearAllTasks() {
    this.taskListModel = [];
    this.selectedTask = null;
  }

  clearFinishTasks() {
    this.taskListModel = this.taskListModel.filter((task) => !task.taskDone);
    let count = 0;
    this.taskListModel.forEach((task) => {
      task.id = count;
      count++;
    });
  }

  increaseActPomo() {
    this.taskListModel.forEach((task) => {
      if (task.id == this.selectedTask) {
        task.increaseActPomo();
      }
    });
  }
}
