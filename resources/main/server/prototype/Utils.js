import * as alt from "alt-server";
import { register } from "../chat.js";
import Clock from "../class/Clock.js";

alt.Utils.registerCommand = register;

alt.Utils.clock = new Clock(12, 0);
