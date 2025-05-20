// @ts-nocheck

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import VConsole from 'vconsole';
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.global = window;
window.process = process;
window.global = window;

new VConsole();

createRoot(document.getElementById('root')!).render(
  <App />
)
