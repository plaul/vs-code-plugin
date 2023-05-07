// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {makeExercise} = require("./commands/makeExerciseCommand")
const {checkExercise} = require("./commands/checkExerciseCommand")

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension is now active!');
	let d1 = vscode.commands.registerCommand('helloworld.command1', makeExercise);
	let d2 = vscode.commands.registerCommand('helloworld.command2', checkExercise );
	context.subscriptions.push(d1);
	context.subscriptions.push(d2);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
