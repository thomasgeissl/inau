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

};
