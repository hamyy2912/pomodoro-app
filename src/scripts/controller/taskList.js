import { patch } from '../helper/fetchApi';

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
export default class TaskListController {
  constructor(view, model) {
    this.view  = view;
    this.model = model;
    this.onUser = false;
  }

  init() {
    // Explicit this binding
    this.view.bindAddNewTask(this.onAddTask);
    this.view.bindClearAllTasks(this.onClearAllTasks);
    this.view.bindClearFinishedTasks(this.onClearFinishedTasks);
    this.view.bindSelectTask(this.model.taskListModel, this.onSelectTask);
    this.view.renderSelectedTaskLabel(this.model.selectedTask, this.model.taskListModel);
    this.renderTaskList();

    // Timer
    this.view.clockView.initClock();
    this.view.bindPomoMode(this.model.taskListModel);
    this.view.clockView.bindStartTimer(this.onIncreaseActPomo);
    this.view.clockView.bindFinishTimer(this.onIncreaseActPomo);
  }

  // Rerender task list view
  renderTaskList = () => {
    const handlers = {
      onEditTask: this.onEditTask,
      onDeleteTask: this.onDeleteTask, 
      onChangeTaskState: this.onChangeTaskState
    };
    this.view.displayTaskList(this.model.taskListModel, handlers);
    this.view.renderDataSection(this.model.taskListModel);
  };

  saveData = () => {
    if (this.model.onUser || this.model.onUser == 0) {
      patch({'taskList': this.model.taskListModel}, this.model.onUser);
    } else {
      this.model.taskListData.setItemLocalStorage(this.model.taskListModel);
    }
  };

  // Handle add task
  onAddTask = (newTask, estPomo) => {
    this.model.addTask(newTask, estPomo);
    this.renderTaskList();
    this.view.bindSelectTask(this.model.taskListModel, this.onSelectTask);
    this.saveData();
  };

  // Handle edit task
  onEditTask = (id, newTaskData) => {
    this.model.editTaskList(id, newTaskData);
    this.renderTaskList();
    this.saveData();
  };

  // Handle delete task
  onDeleteTask = (id) => {
    this.model.deleteTask(id);
    this.renderTaskList();
    this.saveData();
  };

  // Handle change task state
  onChangeTaskState = (id) => {
    this.model.changeTaskState(id);
    this.view.renderDataSection(this.model.taskListModel);
    this.saveData();
  };

  // Handle select task
  onSelectTask = (id) => {
    this.model.selectTask(id);
    if (this.model.onUser || this.model.onUser == 0) {
      patch({'selectedTask': this.model.selectedTask}, this.model.onUser);
    } else {
      this.model.selectTaskData.setItemLocalStorage(this.model.selectedTask);
    }
  };

  // Handle clear all tasks
  onClearAllTasks = () => {
    this.model.clearAllTasks();
    this.view.renderSelectedTaskLabel(0, this.model.taskListModel);
    this.saveData();
  };

  // Handle clear finished tasks
  onClearFinishedTasks = () => {
    this.model.clearFinishTasks();
    this.renderTaskList();
    this.saveData();
  };

  // Handle increase 1 pomo
  onIncreaseActPomo = () => {
    this.model.increaseActPomo();
    this.view.renderPomodoroNumber(this.model.taskListModel);
    this.view.renderDataSection(this.model.taskListModel);
    this.saveData();
  };
}
