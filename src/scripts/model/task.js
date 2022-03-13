export default class TaskModel {
  constructor(taskData) {
    const {id, taskName, estPomo, actPomo, taskDone} = taskData;
    this.id = id;
    this.taskName = taskName;
    this.estPomo = estPomo;
    this.actPomo = actPomo;
    this.taskDone = taskDone;
  }

  editTask(newTaskData) {
    const {newEditTaskName, newEditEstPomo, newEditActPomo} = newTaskData;

    this.taskName = newEditTaskName ? newEditTaskName : this.taskName;
    this.estPomo = (newEditEstPomo || newEditEstPomo == 0) ? newEditEstPomo : this.estPomo;
    this.actPomo = (newEditActPomo || newEditActPomo == 0) ? newEditActPomo : this.actPomo;
  }

  changeTaskStage() {
    this.taskDone = !this.taskDone;
  }

  increaseActPomo() {
    this.actPomo++;
  }
}
