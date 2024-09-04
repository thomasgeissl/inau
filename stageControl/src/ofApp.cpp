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


  // _gui.setup(nullptr, false, ImGuiConfigFlags_ViewportsEnable | ImGuiConfigFlags_DockingEnable, true);

  ofSetEscapeQuitsApp(false);
  bGui.set("gui", true);
}

void ofApp::update()
{
  _mqttClient.update();
}

void ofApp::draw()
{
  _gui.Begin();
  if (_gui.BeginWindow(bGui))
	{
		_gui.AddLabelBig("Examples/\n01_\nWidgetsBasic");
		_gui.AddSpacingBig();

		_gui.AddMinimizerToggle();
		_gui.AddTooltip("This internal toggle is very useful \nconditioning hiding some stuff \nto simplify our gui layout.");
		if (_gui.isMaximized()) {
			_gui.AddAutoResizeToggle();
			_gui.Add(_gui.bGui_Aligners, OFX_IM_TOGGLE_ROUNDED_MINI);
		}

		_gui.AddSpacingSeparated();

		_gui.AddLabelBig("> Show \nWindows", true, true);
		_gui.AddSpacing();

		// _gui.Add(bGui_1, OFX_IM_TOGGLE_ROUNDED_BIG);
		// _gui.AddTooltip("Some widgets");

		// _gui.Add(bGui_2, OFX_IM_TOGGLE_ROUNDED_BIG);
		// _gui.AddTooltip("Some ImGui Raw");

		// _gui.Add(bGui_3, OFX_IM_TOGGLE_ROUNDED_BIG);
		// _gui.AddTooltip("H & V Sliders");

		// _gui.Add(bGui_4, OFX_IM_TOGGLE_ROUNDED_BIG);
		// _gui.AddTooltip("Sliders & Knobs");
		
		//--

		if (_gui.isMaximized()) {

			// An useful bundle of internal control/settings
			_gui.AddSpacingSeparated();
			_gui.DrawAdvancedBundle();
		}

		_gui.EndWindow();
	}
  _gui.End();
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