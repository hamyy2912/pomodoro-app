import { getElementById } from '../helper/dom';

export default class AppView {
  constructor() {
    // Submenu
    this.showSubmenuBtn = getElementById('sub-menu-btn');
    this.submenu = getElementById('sub-menu');

    // Add task form
    this.addTaskBtn = getElementById('add-task-btn');
    this.addTaskForm = getElementById('add-task-form');
    this.cancelAddBtn = getElementById('cancel-add-task');
    this.inputTaskName = getElementById('input-task-name');
    this.inputEstPomo = getElementById('input-est-pomo');
    this.saveTaskBtn = getElementById('save-task-btn');
  }

  initAppView() {
    this.initSubmenu();
    this.bindShowAddForm();
    this.bindHideAddForm();
    this.bindDisableSaveBtn();
  }

  /**
   * Assign "Show submenu" event to edit button
   */
  initSubmenu() {
    this.showSubmenuBtn.addEventListener('click', () => {
      if (this.submenu.className.includes('hide')) {
        this.submenu.classList.remove('hide');
      } else {
        this.submenu.classList.add('hide');
      }
    });

    // Click outside to close submenu
    window.addEventListener('mouseup', (event) => {
      if (!event.target.closest('.menu')) {
        this.submenu.classList.add('hide');
      }
    });
  }

  /**
   * Attach "Show add task form" event to "Add task" button
   * Hide "Add task" button after display "Add task" form
   */
  bindShowAddForm() {
    this.addTaskBtn.addEventListener('click', () => {
      console.log(this.addTaskForm.classList);
      this.addTaskForm.classList.remove('hide');
      this.addTaskBtn.classList.add('hide');
    });
  }

  /**
   * Attach "Hide add task form" event to "Cancel" button in "Add task" form
   * Show "Add task" button after close "Add task" form
   */
  bindHideAddForm() {
    this.cancelAddBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.addTaskForm.reset();
      this.addTaskForm.classList.add('hide');
      this.addTaskBtn.classList.remove('hide');
    });
    // Click outside to hide the form
    window.addEventListener('mouseup', event => {
      if (!event.target.closest('#add-task-form')) {
        this.addTaskForm.reset();
        this.addTaskForm.classList.add('hide');
        this.addTaskBtn.classList.remove('hide');
      }
    });
  }

  /**
   * Disable "Save" button until input fields is filled
   */
  bindDisableSaveBtn() {
    this.addTaskForm.addEventListener('input', () => {
      if (this.inputTaskName.value && this.inputEstPomo.value)
      {
        this.saveTaskBtn.disabled = false;
      }
      else {
        this.saveTaskBtn.disabled = true;
      }
    });
  }
}
