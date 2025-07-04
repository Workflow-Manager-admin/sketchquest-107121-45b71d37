#!/bin/bash
cd /home/kavia/workspace/code-generation/sketchquest-107121-45b71d37/frontend_web
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

