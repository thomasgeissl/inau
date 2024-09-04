#include "ofApp.h"

void ofApp::setup()
{
  ofSetFrameRate(60);
  // mqtt
  ofAddListener(_mqttClient.onOnline, this, &ofApp::onOnline);
  ofAddListener(_mqttClient.onOffline, this, &ofApp::onOffline);
  ofAddListener(_mqttClient.onMessage, this, &ofApp::onMessage);
  // tuio
  ofAddListener(_tuio.touchDown, this, &ofApp::touchDown);
  ofAddListener(_tuio.touchUp, this, &ofApp::touchUp);
  ofAddListener(_tuio.touchMoved, this, &ofApp::touchMoved);

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

    _tuio.connect(_config["tuioPort"]);
  }

  // _g_gui.setup(nullptr, false, ImGuiConfigFlags_ViewportsEnable | ImGuiConfigFlags_DockingEnable, true);

  ofSetEscapeQuitsApp(false);
  _showPreferences.set("preferences", true);

  setupParameters();

  cam.setupPerspective();
  cam.setNearClip(0.0001);
  cam.setFarClip(1000);
  cam.setDistance(35);
  cam.lookAt(glm::vec3(0, 0, 0));

  //--

  setupImGui();
}

void ofApp::update()
{
  _mqttClient.update();
}

void ofApp::draw()
{	updateScene();
	drawScene();

	//----

	drawImGui();


  // _g_gui.Begin();
  // if (_g_gui.BeginWindow(_showPreferences))
  // {
  //   _g_gui.AddLabelBig("Examples/\n01_\nWidgetsBasic");
  //   _g_gui.AddSpacingBig();

  //   _g_gui.AddMinimizerToggle();
  //   _g_gui.AddTooltip("This internal toggle is very useful \nconditioning hiding some stuff \nto simplify our gui layout.");
  //   if (_g_gui.isMaximized())
  //   {
  //     _g_gui.AddAutoResizeToggle();
  //     _g_gui.Add(_g_gui._showPreferences_Aligners, OFX_IM_TOGGLE_ROUNDED_MINI);
  //   }

  //   _g_gui.AddSpacingSeparated();

  //   _g_gui.AddLabelBig("> Show \nWindows", true, true);
  //   _g_gui.AddSpacing();

  //   // _g_gui.Add(_showPreferences_1, OFX_IM_TOGGLE_ROUNDED_BIG);
  //   // _g_gui.AddTooltip("Some widgets");

  //   // _g_gui.Add(_showPreferences_2, OFX_IM_TOGGLE_ROUNDED_BIG);
  //   // _g_gui.AddTooltip("Some ImGui Raw");

  //   // _g_gui.Add(_showPreferences_3, OFX_IM_TOGGLE_ROUNDED_BIG);
  //   // _g_gui.AddTooltip("H & V Sliders");

  //   // _g_gui.Add(_showPreferences_4, OFX_IM_TOGGLE_ROUNDED_BIG);
  //   // _g_gui.AddTooltip("Sliders & Knobs");

  //   //--

  //   if (_g_gui.isMaximized())
  //   {

  //     // An useful bundle of internal control/settings
  //     _g_gui.AddSpacingSeparated();
  //     _g_gui.DrawAdvancedBundle();
  //   }

  //   _g_gui.EndWindow();
  // }
  // _g_gui.End();
}

void ofApp::keyPressed(int key)
{
	if (key == 'g') _showPreferences = !_showPreferences;
	if (key == ' ') bFlagDockingRandom = true;
	if (key == OF_KEY_BACKSPACE) bFlagDockingReset = true;

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

void ofApp::touchDown(ofTouchEventArgs &touch)
{
  ofLogNotice("ofApp::touchDown") << " cursor added: " + ofToString(touch.id) +
                                         " X: " + ofToString(touch.x) +
                                         " Y: " + ofToString(touch.y);
}

void ofApp::touchUp(ofTouchEventArgs &touch)
{
  ofLogNotice("ofApp::touchUp") << " cursor removed: " + ofToString(touch.id) +
                                       " X: " + ofToString(touch.x) +
                                       " Y: " + ofToString(touch.y);
}

void ofApp::touchMoved(ofTouchEventArgs &touch)
{
  ofLogNotice("ofApp::touchMoved") << " cursor updated: " + ofToString(touch.id) +
                                          " X: " + ofToString(touch.x) +
                                          " Y: " + ofToString(touch.y);
}

void ofApp::setupParameters() {
	params1.setName("paramsGroup1");
	params1.add(speed.set("speed1", 0.5f, 0, 1));
	params1.add(bPrevious.set("<", false));
	params1.add(bNext.set(">", false));
	params1.add(bEnable.set("Enable", true));
	params1.add(bMode1.set("bMode1", false));
	params1.add(bMode2.set("bMode2", true));
	params1.add(bMode3.set("bMode3", false));
	params1.add(bMode4.set("bMode4", false));
	params1.add(lineWidth.set("width1", 0.5f, 0, 1));
	params1.add(separation.set("sep1", 50, 1, 100));
	params1.add(shapeType.set("shape1", 0, -50, 50));
	params1.add(size.set("size1", 100, 0, 100));
	params1.add(amount.set("amount1", 10, 0, 25));

	params2.setName("paramsGroup2");
	params2.add(shapeType2.set("shape2", 0, -50, 50));
	params2.add(size2.set("size2", 100, 0, 100));
	params2.add(amount2.set("amnt2", 10, 0, 25));

	params3.setName("paramsGroup3");
	params3.add(lineWidth3.set("width3", 0.5f, 0, 1));
	params3.add(separation3.set("sep3", 50, 1, 100));
	params3.add(speed3.set("speed3", 0.5, 0, 1));
}

//--------------------------------------------------------------
void ofApp::setupImGui() {
	// Docking Raw mode
	// (Without Layout Presets engine)
	// Setup steps:

	//--

	// 1. Initiate

	// NOTICE that
	// To enable the "raw docking" workflow
	// is mandatory to pass an argument:
	_gui.setup(IM_GUI_MODE_INSTANTIATED_DOCKING_RAW);

	//--

	// 2. Queue Special Windows

	// Add the "target" windows just with a name:
	// You will use these added windows easily,
	// but you must remember his index order!
	// Each window will be added to the "Layout Presets Engine" and auto handled too.
	// The engine will auto create internal bool param toggles
	// (like the _showPreferences we used before)
	// to handle the show/hide window states.
	// Notice that is important to remember the index sorting when queuing!

	_gui.addWindowSpecial("Main"); // index 0
	_gui.addWindowSpecial("Audio"); // index 1
	_gui.addWindowSpecial("Video1"); // index 2
	_gui.addWindowSpecial("Video2"); // index 3
	_gui.addWindowSpecial("Expert"); // index 4

	// Extra windows to be auto included in windows menu
	_gui.addWindowExtra(_showPreferences);
	_gui.addWindowExtra(bGui_DockingHelp);

	//--

	// 3. Startup:

	_gui.startup();

	//--

	// Optional:
	// After startup

	//--

	// Customize Help info

	// App
	string s = "This is an Example to learn \nthe Docking features.\n";
	s += "\nShift drag windows \nto different windows zones to dock.\n";
	s += "\nEnjoy!";

	//_gui.setEnableHelpApp();//not required if text settled after
	_gui.setHelpAppTitle("Example 23_DockingRaw");
	_gui.setHelpAppText(s);

	// Internal
	_gui.setEnableHelpInternal(); //disabled/hidden by default
}


void ofApp::drawImGui() {
	// Gui Manager with Docking features:
	// In between here (Begin/End)
	// we can render ImGui windows and widgets,
	// and all the docking magic.

	//--

	_gui.Begin();
	{
		//--

		// 1. Docking magic

		// We can access all the docking space
		// here (between BeginDocking/EndDocking)
		// but just after the main _gui.Begin call.
		// This snippet it's required to be copied into our projects.

		_gui.BeginDocking();
		{
			// Our custom docking related functions
			// to customize the docking layout on runtime by code.
			updateImGuiDockingHelpers();
		}
		_gui.EndDocking();

		//----

		// 2.1 An extra window with helpers

		// An extra window with some triggers
		// for hard-coded layout modifications.
		if (bGui_DockingHelp) drawImGuiDockingHelp();

		//--

		// 2.2 Populate the visible toggles
		drawImGuiApp();

		//--

		// 3. The Special Windows

		// The windows previously queued to the manager on setup(),
		// that are controlled by the Layout Presets Engine.
		// Render ImGui Windows and Widgets now!
		{
			drawImGuiSpecialWindows();
		}

		//--
	}
	_gui.End();
}

//----

//--------------------------------------------------------------
void ofApp::drawImGuiApp() {
	// for all the queued especial windows in setup()!
	if (_gui.BeginWindow(_showPreferences)) {
		_gui.drawWidgetsSpecialWindowsManager();
		_gui.AddSpacingSeparated();

		_gui.Add(bGui_DockingHelp, OFX_IM_TOGGLE_BIG_XXL_BORDER_BLINK);
		_gui.EndWindow();
	}
}

void ofApp::drawImGuiSpecialWindows() {
	drawImGuiSpecialWindow0();
	drawImGuiSpecialWindow1();
	drawImGuiSpecialWindow2();
	drawImGuiSpecialWindow3();
	drawImGuiSpecialWindow4();
}

void ofApp::drawImGuiSpecialWindow0() {
	if (_gui.BeginWindowSpecial(0)) {
		_gui.AddLabelHuge("Window 0", false);

		_gui.Add(bGui_DockingHelp, OFX_IM_TOGGLE_BIG_BORDER_BLINK);

		_gui.Add(_gui.bHelp, OFX_IM_TOGGLE_BUTTON_ROUNDED_BIG);
		_gui.AddTooltip("Help enables some Tooltips \nand the Help Box on this Window!");
		_gui.Add(bEnable, OFX_IM_TOGGLE_BUTTON_ROUNDED_MEDIUM);
		_gui.AddTooltip("Activate sep1 animation");
		_gui.AddTooltip("This is a Help Tool tip! \nIt's " + (string)(bEnable ? "TRUE" : "FALSE"));
		_gui.Add(_gui.bLog, OFX_IM_TOGGLE_BIG_BORDER);
		_gui.AddTooltip("Show Log Window");

		_gui.AddSpacingBigSeparated();

		_gui.Add(speed, OFX_IM_HSLIDER_BIG);
		_gui.AddTooltip("Speed controls the auto populated Log window speed");
		_gui.Add(amount, OFX_IM_HSLIDER);
		_gui.AddTooltip("Speed up separation animator \nwhen bEnable is TRUE");

		_gui.AddSpacingBigSeparated();

		ImGui::PushButtonRepeat(true); // pushing for repeats trigs
		{
			_gui.refreshLayout();

			if (_gui.Add(bPrevious, OFX_IM_BUTTON_BIG, 2)) {
				bPrevious = false;

				lineWidth -= 0.1f;
				lineWidth = ofClamp(lineWidth, lineWidth.getMin(), lineWidth.getMax());
			}
			_gui.AddTooltip("Decrease lineWidth " + ofToString(lineWidth));

			ImGui::SameLine();

			if (_gui.Add(bNext, OFX_IM_BUTTON_BIG, 2)) {
				bNext = false;

				lineWidth += 0.1f;
				lineWidth = ofClamp(lineWidth, lineWidth.getMin(), lineWidth.getMax());
			}
			_gui.AddTooltip("Increase lineWidth " + ofToString(lineWidth));
		}
		ImGui::PopButtonRepeat();

		_gui.AddSpacingBigSeparated();

		_gui.Add(lineWidth, OFX_IM_HSLIDER_SMALL);
		_gui.AddTooltip(ofToString(lineWidth));
		_gui.Add(lineWidth);
		_gui.AddTooltip(ofToString(lineWidth));
		_gui.Add(lineWidth, OFX_IM_STEPPER);
		_gui.AddTooltip(ofToString(lineWidth));
		_gui.Add(lineWidth, OFX_IM_KNOB_DOTKNOB);
		_gui.AddTooltip(ofToString(lineWidth));

		_gui.AddSpacingBigSeparated();

		_gui.Add(separation, OFX_IM_HSLIDER_BIG); // default style
		_gui.AddTooltip(ofToString(separation));

		_gui.EndWindowSpecial();
	}
}

void ofApp::drawImGuiSpecialWindow1() {
	if (_gui.BeginWindowSpecial(1)) {
		_gui.AddLabelHuge("Window 1", false);
		_gui.Add(bGui_DockingHelp, OFX_IM_TOGGLE_BIG_BORDER_BLINK);
		_gui.AddGroup(params1);

		_gui.EndWindowSpecial();
	}
}

//--------------------------------------------------------------
void ofApp::drawImGuiSpecialWindow2() {
	/*
		// Constraints do not works on docking!
		if (_gui.getIsWindowSpecialVisible(index))
		{
			IMGUI_SUGAR__WINDOWS_CONSTRAINTSW;
		}
		*/

	if (_gui.BeginWindowSpecial(2)) {
		_gui.BeginColumns(4);

		_gui.AddLabelHuge("Window 2", false);
		_gui.NextColumn();

		_gui.Add(bGui_DockingHelp, OFX_IM_TOGGLE_BIG_XXXL_BORDER_BLINK);
		_gui.NextColumn();

		_gui.AddGroup(params2, ImGuiTreeNodeFlags_DefaultOpen, OFX_IM_GROUP_DEFAULT);
		_gui.NextColumn();

		// Tabs
		if (ImGui::BeginTabBar("_myTabs")) {
			if (ImGui::BeginTabItem("Video")) {
				_gui.AddLabelBig("Blah Blah");
				string str = R"(
Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
)";
				_gui.AddLabel(str.c_str());
				_gui.AddSpacingBigSeparated();
				_gui.AddGroup(params1);

				ImGui::EndTabItem();
			}

			if (ImGui::BeginTabItem("Audio")) {
				_gui.AddSpacingBig();
				_gui.AddLabelHuge("Blah Blah");
				string str = R"(
It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
)";
				_gui.AddLabelBig(str.c_str());

				ImGui::EndTabItem();
			}

			if (ImGui::BeginTabItem("Controls")) {
				_gui.AddSpacingBig();
				_gui.AddLabelHuge("Pump Up");
				_gui.AddLabelBig("the Volume!");
				_gui.AddSpacingBig();

				_gui.AddGroup(params3, ImGuiTreeNodeFlags_DefaultOpen, OFX_IM_GROUP_HIDDEN_HEADER);

				_gui.DrawAdvancedBundle();

				ImGui::EndTabItem();
			}

			ImGui::EndTabBar();
		}
		_gui.EndColumns();

		//--

		_gui.EndWindowSpecial();
	}
}

void ofApp::drawImGuiSpecialWindow3() {
	if (_gui.BeginWindowSpecial(3)) {
		_gui.BeginColumns(3);
		_gui.AddLabelHuge("Window 3");
		_gui.AddSpacingBig();
		_gui.NextColumn();

		_gui.Add(bGui_DockingHelp, OFX_IM_TOGGLE_BIG_XXXL_BORDER_BLINK);
		_gui.AddLabelHuge("Hello, down Huge!", false, true);
		_gui.NextColumn();

		_gui.AddLabelBig("Hello, down Big!", false, true);
		_gui.AddLabelBig("Hello, down Big! \nHello, down! Hello, down!");
		_gui.AddLabelBig("Hello, down Big!", false, true);
		_gui.EndColumns();

		_gui.AddSpacingHugeSeparated();

		_gui.AddGroup(params3, ImGuiTreeNodeFlags_DefaultOpen, OFX_IM_GROUP_HIDDEN_HEADER);
		_gui.AddLabelHuge("Hello, down Huge! \nHello, down! Hello, down!");

		_gui.EndWindowSpecial();
	}
}

void ofApp::drawImGuiSpecialWindow4() {
	//TODO: Fix sizing bug
	if (_gui.getIsWindowSpecialVisible(4)) {
		IMGUI_SUGAR__WINDOWS_CONSTRAINTSW_SMALL_LOCKED_RESIZE;
	}

	if (_gui.BeginWindowSpecial(4)) {
		_gui.AddLabelHuge("Window 4", false);

		_gui.BeginColumns(3);

		_gui.Add(bGui_DockingHelp, OFX_IM_TOGGLE_BIG_BORDER_BLINK);
		_gui.AddLabelHuge("Hello, left Huge!", true, true);
		_gui.NextColumn();

		_gui.AddLabelHuge("Hello, left Huge!", false, false);
		_gui.AddLabelBig("Hello, left Big!");
		_gui.NextColumn();

		_gui.AddLabel("Hello, left!", false, true);
		_gui.AddLabelBig("Hello, left Big!", false);
		_gui.EndColumns();

		_gui.EndWindowSpecial();
	}
}



//----

// Useful Docking snippets

// On runtime, the user session could design his layout using shift+mouse dragging.
// But we can setup the docking layout using hard-coded methods.

void ofApp::updateImGuiDockingHelpers() {
#if 0
	// Reset layout once o startup/first frame call.
	// Called only once!
	if (bModeDockingResetAtStartup)
	{
		static bool b = false;
		if (!b) {
			b = true;

			doDockingReset();
		}
	}
#endif

	//----

	// Reset layout by a button
	if (bFlagDockingReset) {
		bFlagDockingReset = false;

		doDockingReset();
	}

	//--

	// Random layout by a button
	if (bFlagDockingRandom) {
		bFlagDockingRandom = false;

		doDockingRandom();
	}
}



void ofApp::updateScene() {
    if (!_gui.isDebug()) return;
    if (!bEnable) return;
    if (!_gui.bLog && !_gui.bNotifier) return;

}

void ofApp::drawScene() {
    // cam using central docking space as viewport
    if (cam.getMouseInputEnabled()) {
        if (_gui.isMouseOverGui()) {
            cam.disableMouseInput();
        }
    } else if (!_gui.isMouseOverGui()) {
        cam.enableMouseInput();
    }

    cam.begin();
    ofPushMatrix();
    ofPushStyle();

    // Draw the backplane
    ofColor c = ofColor(ofColor::green, 64);
    ofSetColor(c);
    ofDrawRectangle(-0.5, -0.5, 1, 1);

    // Draw the floor
    ofRotateXDeg(90);
  ofTranslate(0, 0.5, -0.5);
    c = ofColor(ofColor::red, 64);
    ofSetColor(c);
    ofDrawRectangle(-0.5, -0.5, 1, 1);

    ofPopStyle();
    ofPopMatrix();
    cam.end();
}





//----

// Custom Helpers widgets

//--------------------------------------------------------------
void ofApp::drawImGuiDockingHelp() {
	if (!bGui_DockingHelp) return;

	string s;

	//TODO: Fix sizing bug
	IMGUI_SUGAR__WINDOWS_CONSTRAINTSW_SMALL_LOCKED_RESIZE;

	if (_gui.BeginWindow(bGui_DockingHelp)) {
		//--

		s = "Layout";
		_gui.AddLabelBig(s);

		// Reset docking layout

		if (_gui.AddButton("Reset", OFX_IM_BUTTON, 2, true)) {
			bFlagDockingReset = true;
			// Flag to call on a precise draw point,
			// inside the draw begin/end context
		}
		s = "Layout Reset Docking \nto a hard-coded layout.";
		_gui.AddTooltip(s);

		//--

		// Randomize docking layout

		if (_gui.AddButton("Random", OFX_IM_BUTTON, 2)) {
			bFlagDockingRandom = true;
			// Flag to call on a precise draw point,
			// inside the draw begin/end context
		}
		s = "Layout Reset Docking \nto a randomized layout.";
		_gui.AddTooltip(s);

		_gui.AddSpacingSeparated();

		//--

		s = "Manager";
		_gui.AddLabelBig(s);

		if (_gui.AddButton("Load", OFX_IM_BUTTON_SMALL, 2)) {
			_gui.loadLayout(path);
		}
		_gui.SameLine();

		if (_gui.AddButton("Save", OFX_IM_BUTTON_SMALL, 2)) {
			_gui.saveLayout(path);
		}

		_gui.AddSpacingSeparated();

		//--

		s = "Internal";
		_gui.AddLabelBig(s);

		_gui.AddMinimizerToggle();
		if (_gui.isMaximized()) {
			_gui.AddAutoResizeToggle();
			_gui.AddKeysToggle();
			_gui.AddDebugToggle();
			_gui.AddExtraToggle();
			_gui.AddHelpInternalToggle();
			_gui.AddMenuBarToggle();
			_gui.AddAdvancedToggle();

			_gui.AddSpacingSeparated();

			_gui.AddLogToggle();
			_gui.AddNotifierToggle();
		}

		_gui.EndWindow();

		// Debug
		_gui.DrawWindowAdvanced();
	}
}

// Custom Helpers functions

void ofApp::doDockingReset() {
	ofLogNotice(__FUNCTION__);

	ImGuiViewport * viewport = ImGui::GetMainViewport();
	ImGuiID dockspace_id = ImGui::GetID("MyDockSpace");
	static ImGuiDockNodeFlags dockspace_flags = ImGuiDockNodeFlags_PassthruCentralNode;

	ImGui::DockBuilderRemoveNode(dockspace_id); // clear any previous layout
	ImGui::DockBuilderAddNode(dockspace_id, dockspace_flags | ImGuiDockNodeFlags_DockSpace);
	ImGui::DockBuilderSetNodeSize(dockspace_id, viewport->Size);

	// Split the dockspace into 2 nodes --
	// DockBuilderSplitNode takes in the following args in the following order
	// window ID to split, direction, fraction (between 0 and 1),
	// the final two setting let's us choose which id we want (which ever one we DON'T set as NULL,
	// will be returned by the function)
	// out_id_at_dir is the id of the node in the direction we specified earlier,
	// out_id_at_opposite_dir is in the opposite direction

	// Fixed sizes
	const float v1 = 0.2f;
	const float v2 = 0.34f;
	const float v3 = 0.13f;
	const float v4 = 0.13f;

	auto dock_id_top = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Up, v1, nullptr, &dockspace_id);
	auto dock_id_down = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Down, v2, nullptr, &dockspace_id);
	auto dock_id_left = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Left, v3, nullptr, &dockspace_id);
	auto dock_id_right = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Right, v4, nullptr, &dockspace_id);

	//--

	// We now dock our windows into the docking node we made above

	// A Autogetting names
	// We can get the window names by the index to rename easy, just in one place when added on setup.
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(0).c_str(), dock_id_left);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(1).c_str(), dock_id_right);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(2).c_str(), dock_id_right);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(3).c_str(), dock_id_top);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(4).c_str(), dock_id_down);

	// B Hardcoded names
	//ImGui::DockBuilderDockWindow("Main Window", dock_id_top);
	//ImGui::DockBuilderDockWindow("Audio Window", dock_id_right);
	//ImGui::DockBuilderDockWindow("Video 2", dock_id_down);
	//ImGui::DockBuilderDockWindow("Video 3", dock_id_left);
	//ImGui::DockBuilderDockWindow("Advanced", dock_id_right);

	ImGui::DockBuilderFinish(dockspace_id);
}

void ofApp::doDockingRandom() {
	ofLogNotice(__FUNCTION__);

	ImGuiViewport * viewport = ImGui::GetMainViewport();
	ImGuiID dockspace_id = ImGui::GetID("MyDockSpace");
	static ImGuiDockNodeFlags dockspace_flags = ImGuiDockNodeFlags_PassthruCentralNode;

	ImGui::DockBuilderRemoveNode(dockspace_id); // clear any previous layout
	ImGui::DockBuilderAddNode(dockspace_id, dockspace_flags | ImGuiDockNodeFlags_DockSpace);
	ImGui::DockBuilderSetNodeSize(dockspace_id, viewport->Size);

	// Randomized sizes
	float min = 0.2;
	float max = 0.3;
	const float v1 = ofRandom(min, max);
	const float v2 = ofRandom(min, max);
	const float v3 = ofRandom(min, max);
	const float v4 = ofRandom(min, max);

	auto dock_id_top = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Up, v1, nullptr, &dockspace_id);
	auto dock_id_down = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Down, v2, nullptr, &dockspace_id);
	auto dock_id_left = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Left, v3, nullptr, &dockspace_id);
	auto dock_id_right = ImGui::DockBuilderSplitNode(dockspace_id, ImGuiDir_Right, v4, nullptr, &dockspace_id);

	int idice = (int)ofRandom(3);

	// We now dock our windows into the docking node we made above
	// We can get the window names by the index to rename easy, just in one place when added on setup.
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(0).c_str(), (idice == 0) ? dock_id_top : dock_id_down);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(1).c_str(), (idice == 1) ? dock_id_right : dock_id_left);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(2).c_str(), (idice == 2) ? dock_id_down : dock_id_top);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(3).c_str(), (idice == 0) ? dock_id_left : dock_id_right);
	ImGui::DockBuilderDockWindow(_gui.getWindowSpecialName(4).c_str(), (idice == 1) ? dock_id_right : dock_id_left);

	ImGui::DockBuilderFinish(dockspace_id);
}
