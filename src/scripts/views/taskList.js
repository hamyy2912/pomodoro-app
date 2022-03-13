import { getElementById, getElementsByClassName } from '../helper/dom';
import { calculateFinishTime } from '../helper/time';
import { 
  DELETE_ALL_TASKS_CONFIRM, 
  DELETE_FINISHED_TASKS_CONFIRM,
  SWITCH_TASK_CONFIRM
} from '../constants/messages';
/**
 * @class View
 *
 * Visual representation of the task list model.
 */
export default class TaskListView {
  constructor(taskView, clockView) {
    this.taskView = taskView;
    this.clockView = clockView;
    /**
     * Body elements
     */
    // Task list element
    this.taskList = getElementById('task-list-body');
    
    // Add task
    this.addTaskForm = getElementById('add-task-form');
    this.inputTaskName = getElementById('input-task-name');
    this.inputEstPomo = getElementById('input-est-pomo');
    
    // Submenu
    this.clearAllTaskBtn = getElementById('clear-all-task'); 
    this.clearFinishedTaskBtn = getElementById('clear-finished-task');

    // Selected task label
    this.selectedIdLabel = getElementById('task-id');
    this.selectedTask = getElementById('task-name');
    this.SelectedId;

    // Data section
    this.dataSection = getElementById('data-section');

    /**
     * Clock elements
     */
    this.pomoModeBtn = getElementById('pomo-btn');
  }

  /**
   * Render task list table
   * @param {array} taskListModel / task list array
   * @param {number} selectedTaskId / selected task id
   */ 
  displayTaskList(taskListModel, handlers) {
    // Delete all nodes
    while (this.taskList.firstChild) {
      this.taskList.removeChild(this.taskList.firstChild);
    }
    const { onEditTask, onDeleteTask, onChangeTaskState } = handlers;

    // Create new nodes
    taskListModel.forEach((task) => {
      const taskElement = this.taskView.renderTask(task, this.selectedId, handlers);
      this.taskList.appendChild(taskElement);
      this.taskView.bindShowEditForm(task, onEditTask, onDeleteTask);
      this.taskView.bindChangeState(task, onChangeTaskState);
    });
  }

  /**
   * Get new task name
   */
  get newTaskName() {
    return this.inputTaskName.value;
  }
  
  /**
   * Get new estimated pomodoro
   */
  get newEstPomo() {
    return parseInt(this.inputEstPomo.value);
  }

  /**
   * Assign add task when submit "Add task" form, then reset the form
   * @param {callback} handler / function for add task
   */
  bindAddNewTask(handler) {
    this.addTaskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.newTaskName && this.newEstPomo)
      {
        handler(this.newTaskName, this.newEstPomo);
        this.addTaskForm.reset();
      }
    });
  }

  /**
   * Render selected task label when click a task
   */
  renderSelectedTaskLabel(id, taskListModel) {
    // If there are tasks, show the task id and task name
    if (taskListModel[id]) {
      this.selectedId = id;
      this.selectedIdLabel.textContent = `#${id + 1}`;
      this.selectedTask.textContent = taskListModel[id].taskName; 
    } else {
      this.selectedId = null;
      this.selectedIdLabel.textContent = '#1';
      this.selectedTask.textContent = 'Time to focus!';
    }
  }

  /**
   * Add "selected" class to the task element when user click that task
   * @param {number} id task id which is selected
   */
  renderSelectedTaskStyle(id) {
    const taskItems = getElementsByClassName('task-item');
    for (let i = 0; i < taskItems.length; i++) {
      const taskId = parseInt(taskItems[i].id);
      taskItems[i].classList.remove('selected');
      if (taskId == id) {
        taskItems[i].classList.add('selected');
      }
    } 
  }

  /**
   * Bind "Select task" event to each task
   * Render "Selected task label" and add "selected" class to the task when click it
   * @param {*} taskListModel 
   * @param {*} handler 
   */
  bindSelectTask(taskListModel, handler) {
    this.taskList.addEventListener('click', (event) => { 
      if (event.target.closest('.task-item')) {
        const id = parseInt(event.target.closest('.task-item').id);
        if (this.clockView.onTask && id != this.selectedId) {
          if (confirm(SWITCH_TASK_CONFIRM)) {
            this.clockView.resetTimer();
            handler(id);
            this.renderSelectedTaskLabel(id, taskListModel);
            this.renderSelectedTaskStyle(id);    
          }
        } else {
          handler(id);
          this.renderSelectedTaskLabel(id, taskListModel);
          this.renderSelectedTaskStyle(id);
        }
      }
    });
  }

  /**
   * Render data section only when there are at least 1 task
   * Render acted pomodoro, estimated pomodoro, estimated finish time
   */
  renderDataSection(taskListModel) {
    if (this.taskList.childElementCount != 0) {
      let currentActPomo = 0;
      let totalEstPomo = 0;
      taskListModel.forEach((task) => {
        if (!task.taskDone) {
          currentActPomo += task.actPomo;
          totalEstPomo += task.estPomo;
        }
      });
      const [estHour, estMinute] = calculateFinishTime(currentActPomo, totalEstPomo);
      this.dataSection.classList.remove('hide');
      this.dataSection.innerHTML = `
      <p>Act: <span class='act-pomo'>${currentActPomo}</span></p>
      <p>Est: <span class='est-pomo'>${totalEstPomo}</span></p>
      <p>Finish at: <span class='finish-time'>${estHour}:${estMinute}</span></p>
    `;
    } else {
      this.dataSection.classList.add('hide');
    }
  }

  /**
   * Clear all task elements
   */
  renderClearAllTasks() {
    while (this.taskList.firstChild) {
      this.taskList.removeChild(this.taskList.firstChild);
    }
    this.selectedId = null;
  }

  /**
   * Assign "Clear all task" event to button
   * @param {callback} handler function for clear all tasks
   */
  bindClearAllTasks(handler) {
    this.clearAllTaskBtn.addEventListener('click', () => {
      this.clearAllTaskBtn.closest('#sub-menu').classList.add('hide');
      if (confirm(DELETE_ALL_TASKS_CONFIRM) == true) {
        handler();
        this.renderClearAllTasks();
        this.renderDataSection(0, 0);  
      }
    });
  }

  /**
   * Bind "Clear all finished tasks" to button
   */
  bindClearFinishedTasks(handler) {
    this.clearFinishedTaskBtn.addEventListener('click', () => {
      this.clearAllTaskBtn.closest('#sub-menu').classList.add('hide');
      if (confirm(DELETE_FINISHED_TASKS_CONFIRM) == true) {
        handler();
      }
    });
  }

  /**
   * Assign "Change to Pomodoro mode" event to button
   * @param {array} taskListModel / task list array
   */
  bindPomoMode(taskListModel) {
    this.pomoModeBtn.addEventListener('click', () => {
      this.renderSelectedTaskLabel(this.selectedId, taskListModel);
    });
  }

  /**
   * Render only pomodoro data
   * @param {array} taskListModel 
   */
  renderPomodoroNumber(taskListModel) {
    const taskItems = getElementsByClassName('task-item');
    const pomoCount = getElementsByClassName('pomo-count');
    for (let i = 0; i < taskItems.length; i++) {
      if (i == this.selectedId) {
        pomoCount[i].innerText = `${taskListModel[i].actPomo}/${taskListModel[i].estPomo}`;
      }
    }
  }
}
