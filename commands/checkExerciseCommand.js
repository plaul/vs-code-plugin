const vscode = require('vscode');
const path = require('path');
const { VM } = require("vm2")
const fs = require("fs")
const _ = require("lodash")
const { callOpenAI, callOpenAI2 } = require("../utils/openAiFacade")

async function checkExercise() {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const document = editor.document;
    const filePath = document.fileName;

    fs.readFile(filePath, 'utf8', async (err, fileContent) => {
      if (err) {
        vscode.window.showErrorMessage(`Error reading file: ${err.message}`);
        return;
      }

      // Create a new VM context.
      const vm = new VM({
        sandbox: {
          module: { exports: {} },
          require: (moduleName) => {
            if (moduleName === 'path') {
              return path;
            }
          },
        },
      });

      // Evaluate the content of the JavaScript file in the VM context.
      try {
        vm.run(fileContent);
        // Call the function `x` and get the return value.
        //const returnValue = vm.run('x();');
        const names = vm.run('module.exports.names;');
        const cloneArray = vm.run('module.exports.cloneArray;');

        //vscode.window.showInformationMessage(`Names: ${names.toString()}`);
        //vscode.window.showInformationMessage(`Return value: ${cloneArray}`);
        const outputChannel = vscode.window.createOutputChannel('Clone Test');
        outputChannel.show();
        const clonedNames = cloneArray(names);
        if (!isArray(clonedNames, outputChannel)) {
          return
        }
        //outputChannel.appendLine(cloneArray.toString())
        if (isAReference(clonedNames, names, outputChannel)) {
          return
        }
        if (_.isEqual(clonedNames, names)) {
          //outputChannel.appendLine('*******************************************');
          outputChannel.appendLine('You have returned a Real clone, congrats');
        }
        let score = await arrayAreEqual(clonedNames,names,outputChannel)

       if (score >= 3) {
            outputChannel.appendLine("")
            outputChannel.appendLine("***** NEW TASK ******")
            outputChannel.appendLine("Replace the declaration of names with the following")
            outputChannel.appendLine("const names=[{Name:'Paul',age:34},{Name:'Peter',age:24},{Name:'Jane',age:23}]")
            outputChannel.appendLine("And update your method to correctly clone also this kind of arrays")
        }
        
        if (_.isEqual(clonedNames, names) && score >= 4) {
          //Check if array contains names
          names[0].scores.push(100)
          const isDeepCopy = !_.isEqual(clonedNames, names);
          if (isDeepCopy) {
            outputChannel.appendLine("A deep copy YES")
          } else {
            outputChannel.appendLine("NOT A deep copy - try again")
          }
          return
          const reply1 = vm.run('module.exports.reply1;');
          if (!reply1) {
            vscode.window.showInformationMessage(`
          Since you got a score >= 4, add a textual explanation
          to describe what you did.

          Add your description to the reply1 String

          Limit it to 3-6 lines, but take it as it was an exam question
          `, { modal: true })
          } else {
            let res = await callOpenAI2(cloneArray.toString(), reply1)
            res = res.replace(/^\n+/, '')
            const lines = res.split("\n");
            outputChannel.appendLine("")
            outputChannel.appendLine("**** Feedback on your verbal description ****")
            lines.forEach(l => outputChannel.appendLine(l))

          }
        }
        if(isNotAClone(clonedNames,names,outputChannel)){
          return 
        }
        
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    });
  } else {
    vscode.window.showErrorMessage('No active text editor');
  }
  fs.close()
}

function isArray(arr, outputChannel) {
  if (!arr || !Array.isArray(arr)) {
    outputChannel.appendLine('*******************************************');
    outputChannel.appendLine('Your function does not return an array');
    outputChannel.appendLine('');
    outputChannel.appendLine('SCORE = 0 (Not accepted)');
    outputChannel.appendLine('');
    outputChannel.appendLine('TRY AGAIN');
    return false
  }
  return true
}

function isAReference(clone, original, outputChannel) {
  if (clone === original) {
    outputChannel.appendLine('*******************************************');
    outputChannel.appendLine('You have returned a reference, not a clone');
    outputChannel.appendLine('');
    outputChannel.appendLine('SCORE = 0 (Not accepted)');
    outputChannel.appendLine('');
    outputChannel.appendLine('TRY AGAIN');
    outputChannel.appendLine('*******************************************');
    return true
  }
  return false
}

function isNotAClone(clone,original,outputChannel){
  if (!_.isEqual(clone, original)) {
    let error = ""
    if (clone.length != original.length) {
      error = "The length of the two arrays are not equal"
    }
    outputChannel.appendLine('*******************************************');
    outputChannel.appendLine('You have NOT returned a clone');
    outputChannel.appendLine(error);
    outputChannel.appendLine('');
    outputChannel.appendLine('SCORE (so far) = 1');
    outputChannel.appendLine('');
    outputChannel.appendLine('TRY AGAIN');
    outputChannel.appendLine('*******************************************');
    return true
  }
  return false
}

async function arrayAreEqual(clone, original, outputChannel) {
  let score
  if (_.isEqual(clone, original)) {
    let res = await callOpenAI(clone.toString())
    res = res.replace(/^\n+/, '')
    const regex = /Score.*?(\d)\/\d/;
    const match = res.match(regex);
    if (match) {
      score = match[1];
    }
    outputChannel.appendLine(res)
    return Number(score)
  }
  return 0
}


module.exports = {
  checkExercise
}