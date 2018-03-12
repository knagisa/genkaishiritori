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
      this.DownNumButton = document.getElementById(player + "DownNum");
      this.FinishNButton = document.getElementById(player + "FinishN");
      this.AudienceButton = document.getElementById(player + "Audience");
      this.timerName = player + "Timer";
      this.timeToCountDown = TIMELIMIT;
      this.isDownNumButtonUsed = false;
      this.isFinishNButtonUsed = false;
      this.isAudienceButtonUsed = false;
    }
    disabledAllButton() {
      this.changeButton.disabled = true;
      this.DownNumButton.disabled = true;
      this.FinishNButton.disabled = true;
      this.AudienceButton.disabled = true;
    }
    disabledUsedSubButton() {
      this.DownNumButton.disabled = this.isDownNumButtonUsed ? true : false;
      this.FinishNButton.disabled = this.isFinishNButtonUsed ? true : false;
      this.AudienceButton.disabled = this.isAudienceButtonUsed ? true : false;
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
    }
    downNumber() {
      let currentNum = (nums[numPos-1] === 'J') ? 11 : nums[numPos-1];
      if (currentNum === 2) {
        alert("今は使えません。")
        return;
      }
      let numDown;
      let f = false;
      while (true) {
        numDown = prompt(`何文字減らす？ (1~${currentNum - 2})`);
        if (numDown === null) {
          break;
        } else if (numDown) {
          if(numDown.match(/^[1-9]$/)) {
            this.isDownNumButtonUsed = true;
            f = true;
            break;
          }
        }
      }
      if (f) {
        let newNum = currentNum - Number(numDown);
        number.value = newNum;
        let nextNum = (nums[numPos+1] === 'J') ? (11 + Number(numDown)) : (nums[numPos+1] + Number(numDown));
        nums[numPos+1] = (nextNum >= 11) ? 'J' : nextNum;
      }
    }
  }

  var player1 = new PlayerButton("player1");
  var player2 = new PlayerButton("player2");

  var ButtonState = {
    init: function() {
      player1.disabledAllButton();
      start.disabled = false;
      player2.disabledAllButton();
    },
    player1: function() {
      player1.changeButton.disabled = false;
      player1.changeButton.focus();
      player1.disabledUsedSubButton();
      start.disabled = false;
      player2.disabledAllButton();
    },
    player2: function() {
      player1.disabledAllButton();
      start.disabled = false;
      player2.changeButton.disabled = false;
      player2.changeButton.focus();
      player2.disabledUsedSubButton();
    },
    pause: function() {
      player1.disabledAllButton();
      start.disabled = false;
      player2.disabledAllButton();
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
      number.value = nums[numPos++];
    } else {
      number.value = nums[numPos++];
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
        player1.isDownNumButtonUsed = false;
        player1.isFinishNButtonUsed = false;
        player1.isAudienceButtonUsed = false;
        player2.isDownNumButtonUsed = false;
        player2.isFinishNButtonUsed = false;
        player2.isAudienceButtonUsed = false;
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

  player1.DownNumButton.addEventListener('click', function() {
    player1.stopTimer();
    player1.downNumber();
    startTime = Date.now();
    countDown(player1.timeToCountDown);
    ButtonState.player1();
  });

  player1.FinishNButton.addEventListener('click', function() {
    player1.isFinishNButtonUsed = true;
    ButtonState.player1();
  });

  player1.AudienceButton.addEventListener('click', function() {
    player1.isAudienceButtonUsed = true;
    ButtonState.player1();
  });

  player2.changeButton.addEventListener('click', function() {
    player2.stopTimer();
    ButtonState.player1();
    player1.startTimer();
  });

  player2.DownNumButton.addEventListener('click', function() {
    player2.stopTimer();
    player2.downNumber();
    startTime = Date.now();
    countDown(player2.timeToCountDown);
    ButtonState.player2();
  });

  player2.FinishNButton.addEventListener('click', function() {
    player2.isFinishNButtonUsed = true;
    ButtonState.player2();
  });

  player2.AudienceButton.addEventListener('click', function() {
    player2.isAudienceButtonUsed = true;
    ButtonState.player2();
  });

  ButtonState.init();
  updateTimer(TIMELIMIT);
  number.value = "";
  generateNumArray();
  start.focus();

})();
