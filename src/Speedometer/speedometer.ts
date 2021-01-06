function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const updateInterval = 60;

let speedo = mp.browsers.new("package://Speedometr/spedometr.html");
let showed = false;
var player = mp.players.local;

var timeNow = Date.now();

var veh = null;
var eng = false;

let lights = 1;
var vId = -1;
var vHp = 0;
var vKm = 0;
var vlight = 0;
var vMulti = 0;
var vFuel = 0;
var vFuelTank = 0;
var vFuelConsumption = 0;
var updateI = 0;



mp.events.add('render', () => {
  if (showed) {
    if (player.vehicle) {
      let veh = player.vehicle.getHealth();
      if (veh < 500) {
        player.vehicle.setEngineCanDegrade(true);
      }
      else {
        player.vehicle.setEngineCanDegrade(false);
      }
      let vel = player.vehicle.getSpeed() * 3.6;
      speedo.execute('updateHealth(' + veh.toFixed(0) + ');');
      speedo.execute('update(' + vel.toFixed(0) + ');');
    } else {
      speedo.execute("hide();");
      showed = false;
    }
  }
});

mp.keys.bind(0x48, true, function () {
  if (eng && showed && !mp.gui.cursor.showed) {
    lights++;
    switch (lights) {
      case 1:
        speedo.execute(`document.getElementById('light').classList.remove("dim");`);
        speedo.execute(`document.getElementById('highLight').classList.add("dim");`);
        break;
      case 2:
        speedo.execute(`document.getElementById('light').classList.add("dim");`);
        speedo.execute(`document.getElementById('highLight').classList.remove("dim");`);
        break;
      case 3:
        lights = 0;
        speedo.execute(`document.getElementById('highLight').classList.add("dim");`);
        break;
    }
  }
  else {
    lights = 0;
  }
});

mp.events.add('epm', (vMulti) => {
  mp.players.local.vehicle.setEnginePowerMultiplier(vMulti);
});

mp.events.add('vehicleEnter', (id, hp, km, multi, fuel, fuelTank, fuelConsumption) => {
  vId = id;
  vHp = hp;
  vKm = km;
  vMulti = multi;
  vFuel = fuel;
  vFuelTank = fuelTank;
  vFuelConsumption = fuelConsumption;
  veh = player.vehicle;

  if (!showed) {
    showed = true;
    speedo.execute("show();");
  }

  if (vFuel == 0) {
    mp.trigger(`HUD_Notify`, 'warning', "Бак Пуст!");
  }

  speedo.execute('updateG(' + (vFuel / vFuelTank * 100) + ',' + vKm.toFixed(2) + ');');

  mp.players.local.vehicle.setEnginePowerMultiplier(vMulti);

});


mp.events.add("playerEnterVehicle", (vehicle, seat) => {
  if (seat == -1) {
    if (!vehicle.getIsEngineRunning()) {
      vehicle.setEngineOn(false, false, true);
    }
  }

  vehicle.setLights(0);
});


mp.events.add("playerLeaveVehicle", () => {
  speedo.execute("hide();");
  showed = false;
  updateVeh();

  vId = -1;
  vHp = 0;
  vKm = 0;
  vMulti = 0;
  vFuel = 0;
  vFuelTank = 0;
  vFuelConsumption = 0;
  updateI = 0;
  eng = false;
});

function updateVeh() {
  if (vId != -1) {
    mp.events.callRemote("updateVehicle", vId, vKm, vFuel);
  }
}

function setEng(v, s) {
  if (v.getIsEngineRunning() != s) {
    v.setEngineOn(s, true, true);
  }
}

setInterval(
  function () {
    _intervalFunction();
  }, 1000);

function _intervalFunction() {
  let vehicle = player.vehicle;
  if (vehicle) {
    let speed = vehicle.getSpeed();
    let trip = speed / 1000;
    if (vFuel > 0) {
      vFuel = vFuel - (vFuelConsumption * trip);
      if (vFuel < 0) {
        vFuel = 0;
      }
      if (vFuel == 0) {
        updateVeh();
      }
    }

    vKm = vKm + trip;
    speedo.execute('updateG(' + (vFuel / vFuelTank * 100) + ',' + vKm.toFixed(2) + ');');
    updateI++;
    if (updateI == updateInterval) {
      updateI = 0;
      updateVeh();
    }
    eng = vehicle.getIsEngineRunning();
  }

};

function one(light) {
  if (light == 'left' && !left) return;
  if (light == 'right' && !right) return;
  if (light == 'signalx' && !signalx) return;
  let turn;
  if (light == 'left') turn = 'turnLeft';
  else if (light == 'right') turn = 'turnRight';
  else if (light == 'signalx') {
    speedo.execute(`document.getElementById('turnRight').classList.remove("dim");`);
    speedo.execute(`document.getElementById('turnLeft').classList.remove("dim");`);
    setTimeout(function () { two(light); }, 500);
    return;
  }
  else {
    return;
  }
  speedo.execute(`document.getElementById('${turn}').classList.remove("dim");`);
  setTimeout(function () { two(light); }, 500);
};

function two(light) {
  let turn;
  if (light == 'left') turn = 'turnLeft';
  else if (light == 'right') turn = 'turnRight';
  else if (light == 'signalx') {
    speedo.execute(`document.getElementById('turnRight').classList.add("dim");`);
    speedo.execute(`document.getElementById('turnLeft').classList.add("dim");`);
    setTimeout(function () { one(light); }, 500);
    return;
  }
  else {
    return;
  }
  speedo.execute(`document.getElementById('${turn}').classList.add("dim");`);
  setTimeout(function () { one(light); }, 500);
};


const localPlayer = mp.players.local;
let left, right, signalx;
let signalInter, signalOuter;

mp.keys.bind(0x25, true, function () {


  if (left && localPlayer.vehicle) {
    left = false;
    mp.events.call("HUD_Notify", 'info', 'Левый поворотник выключен');
    localPlayer.vehicle.setIndicatorLights(1, false);
  } else

    if (right && localPlayer.vehicle) {
      mp.events.call("HUD_Notify", 'info', 'Левый поворотник включен');
      localPlayer.vehicle.setIndicatorLights(0, false);
      localPlayer.vehicle.setIndicatorLights(1, true);
      left = true;
      right = false;
      one('left');
    } else if (localPlayer.vehicle) {
      mp.events.call("HUD_Notify", 'info', 'Левый поворотник включен');
      localPlayer.vehicle.setIndicatorLights(1, true);
      left = true;
      right = false;
      one('left');
    }
});

mp.keys.bind(0x27, true, function () {

  if (right && localPlayer.vehicle) {
    right = false;
    mp.events.call("HUD_Notify", 'info', 'Правый поворотник выключен');
    localPlayer.vehicle.setIndicatorLights(0, false);
  } else if (left && localPlayer.vehicle) {
    localPlayer.vehicle.setIndicatorLights(1, false);
    localPlayer.vehicle.setIndicatorLights(0, true);
    mp.events.call("HUD_Notify", 'info', 'Правый поворотник включен');
    left = false;
    right = true;
    one('right');
  } else if (localPlayer.vehicle) {
    localPlayer.vehicle.setIndicatorLights(0, true);
    mp.events.call("HUD_Notify", 'info', 'Правый поворотник включен');
    right = true;
    one('right');
  }
});

mp.keys.bind(0x58, true, function () {

  if (signalx && localPlayer.vehicle) {
    mp.events.call("HUD_Notify", 'info', 'Аварийка выключена');
    localPlayer.vehicle.setIndicatorLights(1, false);
    localPlayer.vehicle.setIndicatorLights(0, false);
    signalx = false;

  } else
    if (localPlayer.vehicle) {
      mp.events.call("HUD_Notify", 'info', 'Аварийка включена');
      localPlayer.vehicle.setIndicatorLights(1, true);
      localPlayer.vehicle.setIndicatorLights(0, true);
      signalx = true;
      one('signalx');
    }
});