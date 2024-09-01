#include "ofApp.h"

void ofApp::setup()
{
  _mqttClient.begin("public.cloud.shiftr.io", 1883);
  _mqttClient.connect("openframeworks", "public", "public");

  ofAddListener(_mqttClient.onOnline, this, &ofApp::onOnline);
  ofAddListener(_mqttClient.onOffline, this, &ofApp::onOffline);
  ofAddListener(_mqttClient.onMessage, this, &ofApp::onMessage);
}

void ofApp::update()
{
}

void ofApp::draw()
{
}

void ofApp::keyPressed(int key)
{
  switch (key)
  {
  case ' ':
  {
    break;
  }
  default:
    break;
  }
}

void ofApp::keyReleased(int key)
{
}

void ofApp::mouseMoved(int x, int y)
{
}

void ofApp::mouseDragged(int x, int y, int button)
{
}

void ofApp::mousePressed(int x, int y, int button)
{
}

void ofApp::mouseReleased(int x, int y, int button)
{
}

void ofApp::mouseEntered(int x, int y)
{
}

void ofApp::mouseExited(int x, int y)
{
}

void ofApp::windowResized(int w, int h)
{
}

void ofApp::dragEvent(ofDragInfo dragInfo)
{
}

void ofApp::gotMessage(ofMessage msg)
{
}

void ofApp::onOnline(){
  ofLog() << "online";

  _mqttClient.subscribe("hello");
}

void ofApp::onOffline(){
  ofLog() << "offline";
}

void ofApp::onMessage(ofxMQTTMessage &msg){
  ofLog() << "message: " << msg.topic << " - " << msg.payload;
}