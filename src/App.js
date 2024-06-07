import React from "react";
import './App.css'
const padBankOne = [
  { keyCode: 81, keyTrigger: "Q", id: "Heater-1", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
  { keyCode: 87, keyTrigger: "W", id: "Heater-2", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
  { keyCode: 69, keyTrigger: "E", id: "Heater-3", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
  { keyCode: 65, keyTrigger: "A", id: "Heater-4", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
  { keyCode: 83, keyTrigger: "S", id: "Clap", url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
  { keyCode: 68, keyTrigger: "D", id: "Open-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
  { keyCode: 90, keyTrigger: "Z", id: "Kick-n'-Hat", url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
  { keyCode: 88, keyTrigger: "X", id: "Kick", url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
  { keyCode: 67, keyTrigger: "C", id: "Closed-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" }
];

const padBankTwo = [
  { keyCode: 81, keyTrigger: "Q", id: "Chord-1", url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3" },
  { keyCode: 87, keyTrigger: "W", id: "Chord-2", url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3" },
  { keyCode: 69, keyTrigger: "E", id: "Chord-3", url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3" },
  { keyCode: 65, keyTrigger: "A", id: "Shaker", url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3" },
  { keyCode: 83, keyTrigger: "S", id: "Open-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3" },
  { keyCode: 68, keyTrigger: "D", id: "Closed-HH", url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3" },
  { keyCode: 90, keyTrigger: "Z", id: "Punchy-Kick", url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3" },
  { keyCode: 88, keyTrigger: "X", id: "Side-Stick", url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3" },
  { keyCode: 67, keyTrigger: "C", id: "Snare", url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3" }
];

const activeStyle = {
  backgroundColor: "orange",
  boxShadow: "0 3px orange",
  height: 77,
  marginTop: 13
};

const inactiveStyle = {
  backgroundColor: "grey",
  marginTop: 10,
  boxShadow: "3px 3px 5px black"
};

const DrumPad = ({ clipId, clip, keyTrigger, power, updateDisplay }) => {
  const [padStyle, setPadStyle] = React.useState(inactiveStyle);

  const playSound = () => {
    if (power) {
      const audio = document.getElementById(keyTrigger);
      audio.currentTime = 0;
      audio.play();
      updateDisplay(clipId.replace(/-/g, " "));
      activatePad();
      setTimeout(() => activatePad(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === keyTrigger.charCodeAt(0)) {
      playSound();
    }
  };

  const activatePad = () => {
    setPadStyle((prevState) => (prevState.backgroundColor === "orange" ? inactiveStyle : activeStyle));
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="drum-pad" id={clipId} onClick={playSound} style={padStyle}>
      <audio className="clip" id={keyTrigger} src={clip}></audio>
      {keyTrigger}
    </div>
  );
};

const PadBank = ({ currentPadBank, power, updateDisplay }) => {
  const padBank = currentPadBank.map((pad) => (
    <DrumPad
      key={pad.id}
      clip={pad.url}
      clipId={pad.id}
      keyTrigger={pad.keyTrigger}
      power={power}
      updateDisplay={updateDisplay}
    />
  ));
  return <div className="pad-bank">{padBank}</div>;
};

const App = () => {
  const [power, setPower] = React.useState(true);
  const [display, setDisplay] = React.useState(String.fromCharCode(160));
  const [currentPadBank, setCurrentPadBank] = React.useState(padBankOne);
  const [currentPadBankId, setCurrentPadBankId] = React.useState("Heater Kit");
  const [sliderVal, setSliderVal] = React.useState(0.3);

  const powerControl = () => {
    setPower((prevPower) => !prevPower);
    setDisplay(String.fromCharCode(160));
  };

  const selectBank = () => {
    if (power) {
      if (currentPadBankId === "Heater Kit") {
        setCurrentPadBank(padBankTwo);
        setCurrentPadBankId("Smooth Piano Kit");
        setDisplay("Smooth Piano Kit");
      } else {
        setCurrentPadBank(padBankOne);
        setCurrentPadBankId("Heater Kit");
        setDisplay("Heater Kit");
      }
    }
  };

  const displayClipName = (name) => {
    if (power) {
      setDisplay(name);
    }
  };

  const adjustVolume = (e) => {
    if (power) {
      setSliderVal(e.target.value);
      setDisplay(`Volume: ${Math.round(e.target.value * 100)}`);
      setTimeout(() => setDisplay(String.fromCharCode(160)), 1000);
    }
  };

  React.useEffect(() => {
    const audioElements = document.getElementsByClassName("clip");
    Array.from(audioElements).forEach((audio) => {
      audio.volume = sliderVal;
    });
  }, [sliderVal]);

  const powerSlider = power ? { float: "right" } : { float: "left" };
  const bankSlider = currentPadBank === padBankOne ? { float: "left" } : { float: "right" };

  return (
    <div className="inner-container" id="drum-machine">
      <PadBank currentPadBank={currentPadBank} power={power} updateDisplay={displayClipName} />
      <div className="logo">
        <div className="inner-logo">FCC {String.fromCharCode(160)}</div>
        <i className="inner-logo fa fa-free-code-camp"></i>
      </div>
      <div className="controls-container">
        <div className="control">
          <p>Power</p>
          <div className="select" onClick={powerControl}>
            <div className="inner" style={powerSlider}></div>
          </div>
        </div>
        <p id="display">{display}</p>
        <div className="volume-slider">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sliderVal}
            onChange={adjustVolume}
          />
        </div>
        <div className="control">
          <p>Bank</p>
          <div className="select" onClick={selectBank}>
            <div className="inner" style={bankSlider}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
