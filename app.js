// let decreasingTime = 0;
const app = () => {
  const song = document.querySelector(".song");
  const finishSong = document.querySelector('.finishSong');
  const btnOpenSongsWIndow = document.querySelector(".openSound");
  const btnCloseSongsWindow = document.querySelector('.closeSoundPicker');
  const btnStopTime = document.querySelector(".stop");
  const btnStart_PauseTime = document.querySelector(".start");
  const btnNextTime = document.querySelector(".next");
  const btnOpenSettings = document.querySelector(".openSettings");
  const btnSloseSettings = document.querySelector(".closeSettings");
  const btnSave = document.querySelector(".save");
  const timeDisplay = document.querySelector(".time");
  const buttonContainers = document.querySelectorAll(".setting-time-picker");
  const songsContainer = document.querySelectorAll('.btn');
  const stopSoundBbtn = document.querySelector('.stopSoundBbtn');
  
  let sessionInput = document.querySelector(".selected-sessionTime");
  let breakInput = document.querySelector(".selected-breakTime");
  let isPlaying = false;
  const startIcon = '<i class="fas fa-play"></i>';
  const pauseIcon = '<i class="fas fa-pause"></i>';
  let decreasingTime = 0
  let timerId;
  const pomodoroTimes = [
    { time: 1200, active: true, name: "session time" },
    { time: 300, active: false, name: "break time" },
  ];

  btnStart_PauseTime.addEventListener("click", function () {
    onStartBtnClicked(this);
  });
  btnStopTime.addEventListener("click", () => {
    stopTime();
  });
  btnNextTime.addEventListener("click", () => {
    nextTime();
  });

  btnOpenSettings.addEventListener("click", () => {
    openAdditionalWindow('setting-time');
    btnOpenSettings.style.visibility = 'hidden'

    // set active values to input values
    sessionInput.value = pomodoroTimes[0].time / 60;
    breakInput.value = pomodoroTimes[1].time / 60;
  });

  btnSloseSettings.addEventListener('click', () => {
    closeAdditionalWindow('setting-time');
    btnOpenSettings.style.visibility = 'visible'
  });

//   Events on up & down buttons 
  buttonContainers.forEach((container) => {
    container.addEventListener("click", function (e) {
      if (e.target.closest("button")) {
        if (e.target.classList.contains("fa-chevron-circle-up")) {
          const input = this.querySelector("input");
          input.value < 90 ? input.value++ : "90";
        } else {
          const input = this.querySelector("input");
          input.value > 1 ? input.value-- : (input.value = "1");
        }
      }
    });
  });

  btnOpenSongsWIndow.addEventListener('click', () => {
    openAdditionalWindow('sound-picker__sounds');
    btnOpenSongsWIndow.style.visibility = 'hidden';
  });

  btnCloseSongsWindow.addEventListener('click', () => {
    closeAdditionalWindow('sound-picker__sounds');
    btnOpenSongsWIndow.style.visibility = 'visible';
  });

  const openAdditionalWindow = elem => {
    const windowToOpen = document.querySelector(`.${elem}`);
    windowToOpen.style.visibility = "visible";
  }

  const closeAdditionalWindow = elem => {
    const windowToOpen = document.querySelector(`.${elem}`);
    windowToOpen.style.visibility = "hidden";
  }

  const onSaveBtnClicked = () => {
    if (parseFloat(sessionInput.value) && +sessionInput.value >= 1) {
      pomodoroTimes[0].time = sessionInput.value * 60;
    }
    if (parseFloat(breakInput.value) && +breakInput.value >= 1) {
      pomodoroTimes[1].time = breakInput.value * 60;
    }
    stopTime();
  };

  btnSave.addEventListener("click", onSaveBtnClicked);

  songsContainer.forEach(btn => {
    btn.addEventListener('click', function() {
      song.src = this.dataset.sound;
      if(isPlaying) song.play()
    });
  });

  stopSoundBbtn.addEventListener('click', () => {
    song.pause()
    song.src = '';
  });

  const nextTime = () => {
    const activeTime = pomodoroTimes.find((time) => time.active);
    const nonactiveTime = pomodoroTimes.find((time) => time.active == false);

    // change showing time
    activeTime.active = !activeTime.active;
    nonactiveTime.active = !nonactiveTime.active;
  
    stopTime();
  };

  const stopTime = () => {
    onStop_PauseBtnClicked();
    init();

    // change type and icon start btn
    btnStart_PauseTime.innerHTML = startIcon;
    btnStart_PauseTime.dataset.type = "start";
  };

  onStop_PauseBtnClicked = () =>{
    clearInterval(timerId);
    if(song.src) song.pause();
    isPlaying = false;
  }

  const toZero = (time) => {
    return time >= 10 ? time : "0" + time;
  };
  const displayClock = (time) => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    timeDisplay.innerHTML = `${toZero(min)}:${toZero(sec)}`;
  };

  const startTime = () => {
    timerId = setInterval(() => {
      decreasingTime--;
      displayClock(decreasingTime);
      isTimeOut(decreasingTime);
    }, 1000);
  };

  const isTimeOut = (time) => {
    if(time <= 0) {
     clearInterval(timerId);
     song.pause();
     finishSong.play();
     setTimeout(nextTime, 4000)
    }
  }
  const onStartBtnClicked = btn => {
    if (btn.dataset.type === "start") {
      btn.innerHTML = pauseIcon;
      btn.dataset.type = "pause";

      startTime(decreasingTime);

      isPlaying = true;
      if(song.src) song.play();
    } else {
      btn.innerHTML = startIcon;
      btn.dataset.type = "start";

      onStop_PauseBtnClicked();
    }
  };

  const init = () => {
    const activeTime = pomodoroTimes.find((time) => time.active);
    decreasingTime = activeTime.time;
    displayClock(decreasingTime);
  };

  init();
};

app();
