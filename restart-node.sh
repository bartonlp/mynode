#!/bin/bash
killall node; rm nohup.out; 
nohup node ./httpredirect.js&

