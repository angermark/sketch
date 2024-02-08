import { Head } from "./head";
import { Canvas } from "./canvas";
import { GeoHead } from "./GeoHead";
import { MouseTracker } from "./mouseTracker";
import { BouncyCylinder } from "./bouncyCylinder";
import { ArbitraryHead } from "./ArbitraryHead";
import { ArbitraryHead2 } from "./ArbitraryHead2";

// Mous
const mouseTracker = new MouseTracker();

// Canvas
//const canvas = new Canvas("canvas.webgl", mouseTracker);

// Canvas 2
const canvas = new Canvas("canvas.webgl", mouseTracker);

/**
 * Model
 */
canvas.addMesh(ArbitraryHead2);
