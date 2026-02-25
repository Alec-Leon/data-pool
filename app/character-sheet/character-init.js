import { initCharacterUI } from './character-ui.js';

let characterInitialized = false;

export async function initCharacterModule() {
    if (characterInitialized) return;

    console.log("Initializing Character Sheet module...");
    initCharacterUI();

    characterInitialized = true;
}