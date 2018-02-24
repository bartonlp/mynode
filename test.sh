#!/bin/bash

killall node;
rm nohup.out

i=10;
until [ $i -lt 0 ] ;
do
  what=`ps | awk '{if($4 == "node") print $4;}'`; 
  if [ $what != "node" ]; then
        echo "Startin httpredirect.js";
        `PORT=7000 node ./httpredirect.js >>node.out`;
        sleep 2;
  fi;
  let i-=1;
done
