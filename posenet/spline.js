//import { interpolate } from "b-spline";

var points = [
  [-1.0, 0.0],
  [-0.5, 0.5],
  [0.5, -0.5],
  [1.0, 0.0],
];
var plotPoints = [
  { x: -1.0, y: 0.0 },
  { x: -0.5, y: 0.5 },
  { x: 0.5, y: -0.5 },
  { x: 1.0, y: 0.0 },
];
var interpolated = [];
var plotinterpolated = [];
var degree = 2;

for (var t = 0; t < 1; t += 0.01) {
  interpolated.push(interpolate(t, degree, points));
}
interpolated.forEach((x) => plotinterpolated.push({ x: x[0], y: x[1] }));
console.log(plotinterpolated);
var chart = new CanvasJS.Chart("chartContainer", {
  animationEnabled: true,
  theme: "light2",
  title: {
    text: "Angle vs. Time",
  },
  data: [
    {
      type: "line",
      name: "unprocessed data",
      indexLabelFontSize: 16,
      dataPoints: plotPoints,
    },
    {
      type: "line",
      name: "processed data",
      indexLabelFontSize: 16,
      dataPoints: plotinterpolated,
    },
  ],
});
chart.render();
