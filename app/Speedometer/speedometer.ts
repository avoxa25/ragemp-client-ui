function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const updateInterval = 60;

let speedo = mp.browsers.new("package://Speedometr/spedometr.html");
let showed: boolean = false;
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