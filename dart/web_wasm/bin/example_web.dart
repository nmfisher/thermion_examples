import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'package:web/web.dart';

void main(List<String> arguments) async {
  final canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var resourceLoader = thermion_dart_web_get_resource_loader_wrapper();

  var viewer = ThermionViewerFFI(resourceLoader: resourceLoader);

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
  await viewer.createSwapChain(width.toDouble(), height.toDouble());
  await viewer.setBackgroundColor(0.0, 1.0, 1.0, 1.0);
  print("LOADING SKYBOX");
  await viewer.loadSkybox("assets/default_env/default_env_skybox.ktx");
  print("LOADING IBL");
  await viewer.loadIbl("assets/default_env/default_env_ibl.ktx");
  print("LOADING GLTF");
  await viewer.loadGltf(
      "assets/FlightHelmet/FlightHelmet.gltf", "assets/FlightHelmet");
  await viewer.updateViewportAndCameraProjection(
      width.toDouble(), height.toDouble());
  await viewer.setPostProcessing(true);
  await viewer.setRendering(true);

  while (true) {
    await Future.delayed(Duration(milliseconds: 16));
  }
}
