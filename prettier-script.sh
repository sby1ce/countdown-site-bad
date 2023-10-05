#!/bin/bash
npx prettier --write scripts/main.mjs
npx prettier --write scripts/storageModule.mjs
npx prettier --write scripts/timersModule.mjs
npx prettier --write __tests__/timers.test.js
