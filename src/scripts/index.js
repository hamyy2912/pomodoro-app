import TaskListController from './controllers/taskList';
import TaskListModel from './models/taskList';
import TaskListView from './views/taskList';
import TaskView from './views/task';
import UserTaskListView from './views/authentication';
import UserTaskListController from './controllers/authentication';
import Clock from './views/clock';
import AppView from './views/app';

(function initApp() {
  const taskListModel = new TaskListModel();

  const clockView = new Clock();
  const taskView = new TaskView();
  const taskListView = new TaskListView(taskView, clockView);
  const AuthenticationView = new UserTaskListView(taskView, clockView);

  const taskListController = new TaskListController(taskListView, taskListModel);
  const AuthenticationController = new UserTaskListController(AuthenticationView, taskListModel, taskListController);

  const appView = new AppView();
  
  taskListController.init();
  AuthenticationController.init();
  appView.initAppView();
})();
