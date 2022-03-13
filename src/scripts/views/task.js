import { DELETE_TASK_CONFIRM, MARK_AS_DONE_WARN } from '../constants/messages';
import { createElement, getElementById } from '../helper/dom';

export default class TaskView {
  constructor() {
    this.taskList = getElementById('task-list-body');
    this.addTaskForm = getElementById('add-task-form');
    this.inputTaskName = getElementById('input-task-name');
    this.inputEstPomo = getElementById('input-est-pomo');
  }

  /**
   * Render a task view
   * @param {object} task 
   * @param {number} selectedTaskId 
   * @returns task <li> element
   */
  renderTask(task, selectedTaskId) {
    const taskElement = createElement('li');
    taskElement.id = `${task.id}-task-item`;
    taskElement.className = `task-item flex${task.id == selectedTaskId ? ' selected' : ''}`;

    taskElement.innerHTML = `
      <input class='check-box' id='${task.id}-check-box' type='checkbox' ${task.taskDone ? 'checked' : ''}/><span class='check-done'></span>
      <p class='task-name${task.taskDone ? ' task-done' : ''}' id='${task.id}-task-name'>${task.taskName}</p>
      <p class='pomo-count'>${task.actPomo}/${task.estPomo}</p>
      <button class='edit-btn edit-task-btn' id='${task.id}-edit-btn'></button>
    `;
    
    return taskElement;
  }

  /** 
   * Render "Edit task" form according to the task id which is selected
   * @param {number} id / id of the task which is selected
   * @param {array} taskListModel / task list array
   * @param {element} editTaskForm / "form" element
   */
  renderEditForm(task, editTaskForm) {
    editTaskForm.className = 'edit-task-form';
    editTaskForm.id = 'edit-task-form';
    editTaskForm.innerHTML = `
      <div class='input-group edit-input-group'>
        <input class='input-task-name' id='new-task-name' type='text' value='${task.taskName}' />
        <label>Act/Est Pomodoros</label>
        <input class='input-pomo' id='input-new-act-pomo' type='number' value='${task.actPomo}'  />/
        <input class='input-pomo' id='input-new-est-pomo' type='number' value='${task.estPomo}' />
      </div>
      <div class='btn-group flex'>
        <button id='delete-btn' class='delete-btn form-btn'>Delete</button>
        <div>
          <button class='cancel-btn form-btn' id='cancel-edit-btn'>Cancel</button>
          <input class='submit-btn form-btn' type='submit' value='Save'/>
        </div>
      </div>
    `;
  }

  /**
   * Assign "Remove edit task" form event to "Cancel" button
   * Display task element after close the form
   * @param {element} cancelEditBtn / "Cancel" button in the form
   * @param {number} id / task id which id selected
   */
  bindHideEditForm(cancelEditBtn, id) {
    const editTaskForms = getElementById('edit-task-form');
    const taskItem = getElementById(`${id}-task-item`);
    cancelEditBtn.addEventListener('click', (event) => {
      event.preventDefault();
      editTaskForms.remove();
      taskItem.classList.remove('hide');
    });
    window.addEventListener('mouseup', event => {
      if (!event.target.closest('.edit-task-form')) {
        event.preventDefault();
        editTaskForms.remove();
        if (taskItem) {
          taskItem.classList.remove('hide');
        }
      }
    });
  }

  /**
   * Assign "Edit task" event when submit "Edit task" form
   * @param {callback} handler / function for edit task in controller
   * @param {number} id / id of the task which is selected
   */
  bindEditTask(handler, id) {
    const editTaskForm = getElementById('edit-task-form');
    editTaskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get new task name, new estimated number of pomodoro, new acted number of pomodoro values 
      // from input fields
      const newEditTaskName = getElementById('new-task-name').value;
      const newEditEstPomo = getElementById('input-new-est-pomo').value;
      const newEditActPomo = getElementById('input-new-act-pomo').value;

      if (newEditTaskName || newEditEstPomo || newEditActPomo) {
        // Create an array to contain all new values of the task
        const newTaskData = {
          newEditTaskName: newEditTaskName, 
          newEditEstPomo: parseInt(newEditEstPomo), 
          newEditActPomo: parseInt(newEditActPomo)
        };
        handler(id, newTaskData);
        editTaskForm.reset();
      }
    });
  }

  /**
   * Assign "Delete task" event to "Delete" button 
   */
  bindDeleteTask(handler, id) {
    const deleteBtns = getElementById('delete-btn');
    deleteBtns.addEventListener('click', () => {
      if (confirm(DELETE_TASK_CONFIRM) == true) {
        handler(id);
      }
    });
  }

  /**
   * Assign "Show edit form" event to every "Edit task" button
   * Hide task element when open the "Edit task" form
   * @param {array} taskListModel / task list array
   * @param {handler} onEditTask / function for edit task data
   * @param {handler} onDeleteTask / function for delete task data
   */
  bindShowEditForm(task, onEditTask, onDeleteTask) {
    const editBtn = getElementById(`${task.id}-edit-btn`);
    const taskItem = getElementById(`${task.id}-task-item`);
    editBtn.addEventListener('click', () => {
      if (taskItem.getElementsByClassName('task-done').length == 0) {
        const editTaskForm = createElement('form');  // Create edit task form
        this.renderEditForm(task, editTaskForm);  // Render edit task form
        this.taskList.insertBefore(editTaskForm, taskItem.nextSibling); // Insert to task list table
        
        // Bind "Hide edit form" event to "Cancel" button
        const cancelEditBtn = getElementById('cancel-edit-btn');
        this.bindHideEditForm(cancelEditBtn, task.id);

        // Bind "Edit task" event to "Save" button
        this.bindEditTask(onEditTask, task.id);

        // Bind "Delete task" event to "Delete" button
        this.bindDeleteTask(onDeleteTask, task.id);

        taskItem.classList.add('hide');
      }
      else {
        alert(MARK_AS_DONE_WARN);
      }
    });
  }

  /**
   * Assign "Change task state" event when change state of the check box
   * @param {callback} handler function for changing state of the task
   * @param {array} taskListModel task list array
   */
  bindChangeState(task, handler) {
    const checkDoneBox = getElementById(`${task.id}-check-box`);
    const taskName = getElementById(`${task.id}-task-name`);

    checkDoneBox.addEventListener('change', () => {
      handler(task.id);
      this.renderChangeState(task, taskName);
    });
  }

  /**
   * Render task element when mark as done the task
   * Add class 'task-done'
   */
  renderChangeState(task, taskName) {
    if (!task.taskDone) {
      taskName.classList.remove('task-done');
    } else {
      taskName.classList.add('task-done');
    }
  }
}
