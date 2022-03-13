import { getUserById } from '../helper/fetchApi';

export default class AuthenticationController {
  constructor(view, model, taskListController) {
    this.view = view;
    this.model = model;
    this.taskList = taskListController;
  }

  init() {
    this.view.bindOpenLoginModal();
    this.view.bindCloseLoginModal();
    this.view.bindCreateAccount();

    // Login  
    this.view.bindLogin(this.onLogin);
    this.view.bindLogout(this.onLogout);
  }

  // Handle login
  onLogin = async (id) => {
    this.model.onUser = id;
    const user = await getUserById(id);
    this.model.taskListModel = this.model.getTaskListModel(user.taskList);
    this.model.selectedTask = user.selectedTask;
    this.taskList.renderTaskList();
    this.view.renderSelectedTaskLabel(this.model.selectedTask, this.model.taskListModel);
  };

  // Handle logout
  onLogout = () => {
    this.model.taskListModel = this.model.getTaskListModel();
    this.model.selectedTask = parseInt(this.model.selectTaskData.getItemLocalStorage());
    this.model.onUser = null;
    this.taskList.renderTaskList();
    this.view.renderSelectedTaskLabel(this.model.selectedTask, this.model.taskListModel);
  };
}
