// __mocks__/client.js

import { JSDOM } from "jsdom";

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = global.window.HTMLElement;
