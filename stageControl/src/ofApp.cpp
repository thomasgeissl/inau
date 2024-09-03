#include "ofApp.h"

void ofApp::setup()
{
  ofSetFrameRate(60);
  ofAddListener(_mqttClient.onOnline, this, &ofApp::onOnline);
  ofAddListener(_mqttClient.onOffline, this, &ofApp::onOffline);
  ofAddListener(_mqttClient.onMessage, this, &ofApp::onMessage);

  ofFile file(ofToDataPath("config.json"));
  if (file.exists())
  {
    file >> _config;

    std::string showId = _config["showId"];
    _showId = showId;
    _showBaseTopic = "inau/" + showId + "/stage";
    ofLogNotice() << "successfully loaded config for show " << showId;

    std::string broker = _config["broker"];
    int brokerPort = _config["brokerPort"];

    _mqttClient.begin(broker, brokerPort);
    std::string clientId = "stageControl_";
    clientId += ofRandom(1024);
    _mqttClient.connect(clientId, "public", "public");
  }
}

void ofApp::update()
{
  _mqttClient.update();
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

void ofApp::onOnline()
{
  ofLogNotice() << "successfully connected to mqtt broker";

  std::string resultsTopic = _showBaseTopic + "/scene/results";
  std::string introTopic = _showBaseTopic + "/scene/intro";

  ofLogNotice() << "subscribing to topic " << resultsTopic;
  ofLogNotice() << "subscribing to topic " << introTopic;
  _mqttClient.subscribe(resultsTopic);
  _mqttClient.subscribe(introTopic);
}

void ofApp::onOffline()
{
  ofLogNotice() << "disconnected from broker";
}

void ofApp::onMessage(ofxMQTTMessage &msg)
{
  std::string resultsTopic = _showBaseTopic + "/stage/scene/results";

  ofJson payload = ofJson::parse(msg.payload);

  ofLog() << "message: " << msg.topic << " - " << msg.payload;
  if (msg.topic == resultsTopic)
  {
    // TODO: get scene id
    // e.g. set stage lights based on results
    // check if it makes sense to use ofxFixture
    // send out midi cc based on results
  }
}