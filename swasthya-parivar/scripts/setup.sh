#!/bin/bash
echo "Setting up Swasthya Parivar dependencies..."
cd frontend && npm install
cd ../backend && npm install
cd ../ai-services && pip install -r requirements.txt
echo "Done!"