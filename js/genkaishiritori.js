(function() {
  'use strict';

  var number = document.getElementById("number");
  var start = document.getElementById("start");

  const TIMELIMIT = 900000;

  var isPlaying = false;
  var isPaused = false;
  var workingTimer = "";
  var timerId;
  var timeLeft;
  var startTime;

  var nums = [];
  var numPos = 0;

  class PlayerButton {
    constructor(player) {
      this.timer = document.getElementById(player + "Timer");
      this.changeButton = document.getElementById(player + "Change");
      this.passButton = document.getElementById(player + "Pass");
      this.timerName = player + "Timer";
      this.timeToCountDown = TIMELIMIT;
      this.havePassed = false;
    }
    stopTimer() {
      this.timeToCountDown = timeLeft;
      clearTimeout(timerId);
    }
    startTimer() {
      workingTimer = this.timerName;
      startTime = Date.now();
      countDown(this.timeToCountDown);
      updateNumber();
      this.changeButton.focus();
    }
  }

  var player1 = new PlayerButton("player1");
  var player2 = new PlayerButton("player2");

  var ButtonState = {
    init: function() {
      player1.changeButton.disabled = true;
      player1.passButton.disabled = true;
      start.disabled = false;
      player2.changeButton.disabled = true;
      player2.passButton.disabled = true;
    },
    player1: function() {
      player1.changeButton.disabled = false;
      player1.passButton.disabled = player1.havePassed ? true : false;
      start.disabled = false;
      player2.changeButton.disabled = true;
      player2.passButton.disabled = true;
    },
    player2: function() {
      player1.changeButton.disabled = true;
      player1.passButton.disabled = true;
      start.disabled = false;
      player2.changeButton.disabled = false;
      player2.passButton.disabled = player2.havePassed ? true : false;
    },
    pause: function() {
      player1.changeButton.disabled = true;
      player1.passButton.disabled = true;
      start.disabled = false;
      player2.changeButton.disabled = true;
      player2.passButton.disabled = true;
    }
  };

  var shuffle = function(array) {
    let n = array.length, t, i;
    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
    return array;
  }

  var generateNumArray = function() {
    for (let i = 0; i < 4; i++) {
      for (let j = 2; j <= 10; j++) {
        nums.push(j);
      }
      nums.push("J");
    }
    shuffle(nums);
  }

  var updateNumber = function() {
    if (numPos >= nums.length) {
      nums = [];
      generateNumArray();
      numPos = 0;
      number.value = nums[numPos];
      numPos++;
    } else {
      number.value = nums[numPos];
      numPos++;
    }
  }

  var updateTimer = function(t) {
    var d = new Date(t);
    var m = d.getMinutes();
    var s = d.getSeconds();
    m = ("0" + m).slice(-2);
    s = ("0" + s).slice(-2);
    var timerString = m + ":" + s;
    if (workingTimer === "player1Timer") {
      player1.timer.value = timerString;
    } else if (workingTimer === "player2Timer") {
      player2.timer.value = timerString;
    } else {
      player1.timer.value = timerString;
      player2.timer.value = timerString;
    }
  }

  var countDown = function(timeToCountDown) {
    timerId = setTimeout(function() {
      timeLeft = timeToCountDown - (Date.now() - startTime);
      if (timeLeft < 0) {
        isPlaying = false;
        let winner = workingTimer === "player1Timer" ? "右側のプレイヤー" : "左側のプレイヤー";
        alert(`勝者は${winner}です！`);
        workingTimer = "";
        clearTimeout(timerId);
        ButtonState.init();
        player1.timeToCountDown = TIMELIMIT;
        player2.timeToCountDown = TIMELIMIT;
        updateTimer(TIMELIMIT);
        nums = [];
        numPos = 0;
        generateNumArray();
        player1.havePassed = false;
        player2.havePassed = false;
        number.value = "";
        start.innerHTML = "<i class=\"fas fa-play\"></i>";
        start.classList.remove("btn-danger");
        start.classList.add("btn-success");
        start.focus();
        return;
      }
      updateTimer(timeLeft);
      countDown(timeToCountDown);
    }, 10);
  }

  start.addEventListener('click', function() {
    if (isPlaying === false) {
      isPlaying = true;
      workingTimer = "player1Timer";
      startTime = Date.now();
      countDown(player1.timeToCountDown);
      ButtonState.player1();
      updateNumber();
      this.innerHTML = "<i class=\"fas fa-pause\"></i>";
      this.classList.remove("btn-success");
      this.classList.add("btn-danger");
      player1.changeButton.focus();
    } else {
      if (isPaused === false) {
        isPaused = true;
        ButtonState.pause();
        if (workingTimer === "player1Timer") {
          player1.timeToCountDown = timeLeft;
        } else if (workingTimer === "player2Timer") {
          player2.timeToCountDown = timeLeft;
        }
        clearTimeout(timerId);
        this.innerHTML = "<i class=\"fas fa-play\"></i>";
        this.classList.remove("btn-danger");
        this.classList.add("btn-info");
      } else {
        isPaused = false;
        startTime = Date.now();
        if (workingTimer === "player1Timer") {
          ButtonState.player1();
          countDown(player1.timeToCountDown);
          player1.changeButton.focus();
        } else if (workingTimer === "player2Timer") {
          ButtonState.player2();
          countDown(player2.timeToCountDown);
          player2.changeButton.focus();
        }
        this.innerHTML = "<i class=\"fas fa-pause\"></i>";
        this.classList.remove("btn-info");
        this.classList.add("btn-danger");
      }
    }
  });

  player1.changeButton.addEventListener('click', function() {
    player1.stopTimer();
    ButtonState.player2();
    player2.startTimer();
  });

  player1.passButton.addEventListener('click', function() {
    player1.havePassed = true;
    player1.stopTimer();
    ButtonState.player2();
    player2.startTimer();
  });

  player2.changeButton.addEventListener('click', function() {
    player2.stopTimer();
    ButtonState.player1();
    player1.startTimer();
  });

  player2.passButton.addEventListener('click', function() {
    player2.havePassed = true;
    player2.stopTimer();
    ButtonState.player1();
    player1.startTimer();
  });

  ButtonState.init();
  updateTimer(TIMELIMIT);
  number.value = "";
  generateNumArray();
  start.focus();

})();
