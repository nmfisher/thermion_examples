import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:math';
import 'package:thermion_dart/thermion_dart/compatibility/web/interop/thermion_viewer_dart_bridge.dart';
import 'package:web/web.dart';
import 'package:thermion_dart/thermion_dart.dart';

void main(List<String> arguments) async {
  final canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var viewer = ThermionViewerWasm();

  var mousedown = (JSObject event) {
    var x = event.getProperty("clientX".toJS) as JSNumber;
    var y = event.getProperty("clientY".toJS) as JSNumber;
    viewer.rotateStart(x.toDartDouble, y.toDartDouble);
  };

  canvas.addEventListener("mousedown", mousedown.toJS);

  var mousemove = (JSObject event) {
    var x = event.getProperty("clientX".toJS) as JSNumber;
    var y = event.getProperty("clientY".toJS) as JSNumber;
    viewer.rotateUpdate(x.toDartDouble, y.toDartDouble);
  };

  canvas.addEventListener("mousemove", mousemove.toJS);

  var mouseup = (JSObject event) {
    viewer.rotateEnd();
  };

  canvas.addEventListener("mouseup", mousedown.toJS);

  await viewer.initialized;
  var width = window.innerWidth;
  var height = window.innerHeight;
  await viewer.initialize(width, height);
  await viewer.setBackgroundColor(0.0, 1.0, 1.0, 1.0);
  // await viewer.loadSkybox("assets/default_env_skybox.ktx");
  // await viewer.loadIbl("assets/default_env_ibl.ktx");
  // await viewer.loadGltf("assets/FlightHelmet.gltf", "assets");

  await viewer.setPostProcessing(true);
  // await viewer.setRendering(true);

  var jsWrapper = ThermionViewerJSDartBridge(viewer);
  jsWrapper.bind();
  final random = Random();
  while (true) {
    await Future.delayed(Duration(milliseconds: 16));
    // await viewer.setBackgroundColor(random.nextDouble(), random.nextDouble(), random.nextDouble(), random.nextDouble());
    await viewer.setBackgroundColor(0.0, 1.0, 1.0, 1.0);
    await viewer.render();
  }
}
