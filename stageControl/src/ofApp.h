#pragma once

#include "ofMain.h"
#include "ofxMQTT.h"
#include "ofxDmx.h"
#include "ofxMidi.h"
#include "ofxTuioClient.h"
#include "ofxSurfingImGui.h"



class ofApp : public ofBaseApp
{
public:
    void setup();
    void update();
    void draw();

    void keyPressed(int key);
    void keyReleased(int key);
    void mouseMoved(int x, int y);
    void mouseDragged(int x, int y, int button);
    void mousePressed(int x, int y, int button);
    void mouseReleased(int x, int y, int button);
    void mouseEntered(int x, int y);
    void mouseExited(int x, int y);
    void windowResized(int w, int h);
    void dragEvent(ofDragInfo dragInfo);
    void gotMessage(ofMessage msg);

    void onOnline();
    void onOffline();
    void onMessage(ofxMQTTMessage &msg);



    void touchDown(ofTouchEventArgs & touch);
    void touchUp(ofTouchEventArgs & touch);
    void touchMoved(ofTouchEventArgs & touch);

    ofxMQTT _mqttClient;
    ofxDmx _dmx;
    ofxMidiOut _midiOut;
    ofxTuioClient _tuio;

    ofJson _config;
    std::string _showId;
    std::string _showBaseTopic;

    ofxSurfingGui _gui;
    ofParameter<bool> _showPreferences;


    ofFbo _floorFbo;
    ofFbo _wallFbo;

    
	void setupImGui();
	void drawImGui();
	void drawImGuiApp();
	void drawImGuiSpecialWindows();
	void drawImGuiSpecialWindow0();
	void drawImGuiSpecialWindow1();
	void drawImGuiSpecialWindow2();
	void drawImGuiSpecialWindow3();
	void drawImGuiSpecialWindow4();
    	// Scene Parameters
	ofParameterGroup params1;
	ofParameter<bool> bEnable;
	ofParameter<bool> bPrevious;
	ofParameter<bool> bMode1;
	ofParameter<bool> bMode2;
	ofParameter<bool> bMode3;
	ofParameter<bool> bMode4;
	ofParameter<bool> bNext;
	ofParameter<float> lineWidth;
	ofParameter<float> separation;
	ofParameter<float> speed;
	ofParameter<int> shapeType;
	ofParameter<int> amount;
	ofParameter<int> size;
	ofParameterGroup params2;
	ofParameter<int> shapeType2;
	ofParameter<int> amount2;
	ofParameter<int> size2;
	ofParameterGroup params3;
	ofParameter<float> lineWidth3;
	ofParameter<float> separation3;
	ofParameter<float> speed3;
	ofParameter<int> shapeType3;


    ofParameter<bool> bGui_DockingHelp{ "DOCKING HELP", true };


    void setupParameters();
	// To learning purposes 
	// but also to be used as template for your projects.
	void updateImGuiDockingHelpers();
	void drawImGuiDockingHelp();

	// An extra window with some triggers
	// for hard-coded layout modifications. 
	void doDockingReset(); // Reset the layout to a hard-coded default layout.
	void doDockingRandom(); // Random the layout.

	// Flags
	bool bFlagDockingReset = false;
	bool bFlagDockingRandom = false;

	//--

	// Manager to Save/Load Layout manually

	string path = "myLayout.ini";
	
	//--

	// Scene functions

	void updateScene(); // Generates random messages to test the Log window.
	void drawScene();// Draws a Central Rectangle getting from the docking layout.

	ofEasyCam cam;

};
