#!/bin/bash
killall node; rm nohup.out; PORT=7000 nohup node bin/www&

