//this will export one function that speaks to your vscode Extension and makes the file available for use

import * as vscode from 'vscode';
import * as fs from 'fs';

const Aesop = vscode.extensions.getExtension('aesop');

const AesopChronicle = () => {
  const thisFile = module.filename;
  const stories = module.exports;
}

AesopChronicle();

module.exports = {
  Aesop,
  AesopChronicle
}