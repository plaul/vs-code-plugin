
const vscode = require('vscode');
function makeExercise() {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('Please open a JavaScript file to insert the function.');
    return;
  }

  let doc = editor.document;
  if (doc.languageId !== 'javascript' || doc.lineCount > 1) {
    vscode.window.showErrorMessage('Please open an empty JavaScript file to insert the function.');
    return;
  }

  const functionText =`
//Exercise: Implement the required code so that cloneArray returns a clone of names
const names=['Paul','Peter','Jane']
function cloneArray(arr){\n//Return a clone of the array given as input
\n\}

const reply1=\`\`
const reply2 = \`\`	

//Don't change anything here
module.exports = {
cloneArray,
names,
reply1,
reply2
};`

  // const functionText = 'function myFunction() {\n\n}\n';
  editor.edit((editBuilder) => {
    editBuilder.insert(new vscode.Position(0, 0), functionText);
  });

  vscode.window.showInformationMessage('command 1');
}

module.exports = {
  makeExercise
}