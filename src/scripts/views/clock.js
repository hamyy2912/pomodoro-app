import { FINISH_TIMER_CONFIRM, RESET_TIMER_CONFIRM } from '../constants/messages';
import { getElementById } from '../helper/dom';

export default class Clock {
  constructor() {
    this.mainTimer = getElementById('main-timer');
    this.resetBtn = getElementById('reset-btn');
    this.pomoModeBtn = getElementById('pomo-btn');
    this.breakModeBtn = getElementById('break-btn');
    this.selectedTask = getElementById('task-name');
    this.startBtn = getElementById('start-btn');
    this.finishBtn = getElementById('finish-btn');
    this.active = false;
    this.onTask = false;
    this.currentTime = 10;
    this.setIntervalTimer;
    this.setTimeOutTimer;
    this.pomoMode = true;
  }

  initClock() {
    this.displayClock(this.currentTime);
    this.bindResetTimer();
    this.bindBreakMode();
    this.bindPomoMode();
  }

  /**
   * Display clock
   * @param {number} secs / milliseconds
   */
  displayClock(secs) {
    const minutes = parseInt(secs / 60);
    const seconds = secs - minutes * 60;
    const showMinute = minutes < 10 ? '0' + minutes : minutes;
    const showSecond = seconds < 10 ? '0' + seconds : seconds;
    this.mainTimer.innerText = `${showMinute}:${showSecond}`;
  }

  /**
   * Switch between "Break" mode and "Pomodoro" mode
   * @param {boolean} pomoMode 
   * @returns 
   */
  changeToPomoMode() {
    if (this.pomoMode) {
      document.body.className = 'break-mode';
      return false;
    } else {
      document.body.className = 'pomodoro-mode';
      return true;
    }
  }

  /**
   * Assign "Change to Pomodoro mode" event to button
   */
  bindPomoMode() {
    this.pomoModeBtn.addEventListener('click', () => {
      this.pomoMode = this.changeToPomoMode(true);
      this.resetTimer();
    });
  }

  /**
   * Assign "Change to Break mode" event to button
   */
  bindBreakMode() {
    this.breakModeBtn.addEventListener('click', () => {
      this.pomoMode = this.changeToPomoMode(false);
      this.resetTimer();
      this.selectedTask.textContent = 'Time to break!';
    });
  }

  /**
   * Count down timer function
   */
  stepDown() {
    if (this.currentTime > 0) {
      this.currentTime--;
      this.displayClock(this.currentTime);
    }
  }

  /**
   * Reset timer
   */
  resetTimer() {
    clearInterval(this.setIntervalTimer);
    clearTimeout(this.setTimeOutTimer);
    this.startBtn.innerText = 'Start';
    if (this.pomoMode) {
      this.currentTime = 10;
    } else {
      this.currentTime = 5;
    }
    this.displayClock(this.currentTime);
    this.active = false;
    this.onTask = false;
  }

  /**
   * Assign "Reset timer" event to "Reset" button
   */
  bindResetTimer() {
    this.resetBtn.addEventListener('click', () => {
      if (confirm(RESET_TIMER_CONFIRM)){
        this.resetTimer();
        this.onTask = false;
      }
    });  
  }

  /**
   * Start the timer and increase 1 act pomo after finish a pomodoro interval
   * Switch between "Break" mode and "Pomodoro" mode
   * @param {callback} handler / function for increase 1 act pomo
   * @param {array} taskListModel 
   */
  startTimer(handler) {
    if (!this.active) {
      this.onTask = true;
      this.startBtn.innerText = 'Pause';
      this.setIntervalTimer = setInterval(() => {this.stepDown();}, 1000);
      this.setTimeOutTimer = setTimeout(() => {
        this.onTask = false;
        if (this.pomoMode) {
          handler();
          this.pomoMode = this.changeToPomoMode(false);
          this.resetTimer();
          this.selectedTask.textContent = 'Time to break!';
        } else {
          this.pomoMode = this.changeToPomoMode(true);
          this.resetTimer();
          this.selectedTask.textContent = 'Time to focus!';
        }
      }, this.currentTime*1000);
      this.active = true;
    } else {
      this.startBtn.innerText = 'Resume';
      clearInterval(this.setIntervalTimer);
      clearTimeout(this.setTimeOutTimer);
      this.active = false;
    }
  }

  /**
   * Finish the pomodoro interval and increase 1 act pomo
   * Switch between "Break" mode and "Pomodoro" mode
   * @param {callback} handler / function for increase 1 act pomo
   */
  finishTimer(handler) {
    if (this.active) {
      this.onTask = false;
      if (this.pomoMode) {
        if (confirm(FINISH_TIMER_CONFIRM)) {
          this.pomoMode = this.changeToPomoMode(false);
          handler();
          this.resetTimer();
          this.selectedTask.textContent = 'Time to break!';
        }
      } else {
        if (confirm(FINISH_TIMER_CONFIRM)) {
          this.pomoMode = this.changeToPomoMode(true);
          this.resetTimer();
          this.selectedTask.textContent = 'Time to focus!';
        }
      }
    }
  }

  /**
   * Start the timer and increase 1 act pomo after finish a pomodoro interval
   * Switch between "Break" mode and "Pomodoro" mode
   * @param {callback} handler / function for increase 1 act pomo
   * @param {array} taskListModel 
   */
  bindStartTimer(handler) {
    this.startBtn.addEventListener('click', () => {
      this.startTimer(handler);  
    });
  }

  /**
   * Finish the pomodoro interval and increase 1 act pomo
   * Switch between "Break" mode and "Pomodoro" mode
   * @param {callback} handler / function for increase 1 act pomo
   */
  bindFinishTimer(handler) {
    this.finishBtn.addEventListener('click', () => {
      this.finishTimer(handler);
    });
  }
}
