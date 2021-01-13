# RageMP SweetLifeRP Server UI #1
RageMP SweetLifeRP Server Server UI #1

## Requirements
1. [RageMP client](https://rage.mp)
2. [Node.js](https://nodejs.org/en)
3. [SweetLifeRP Server](https://github.com/SweetLifeRP/server)

## Recommended VS Code extensions
- [Visual Studio Keymap](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vs-keybindings)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [Russian - Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-russian)

## TypeScript setup
1. Install global dependencies via NPM using next command:
```
npm install -g typescript tslint webpack webpack-cli webpack-dev-server
```

## Style guides
1. [HTML/CSS style guide](./HtmlCssStyleGuide.md)

## CEF Debugging
1. Open `regedit.msc`
2. Add `9222 ` as `String value` in `HKEY_CURRENT_USER\SOFTWARE\RAGE-MP`
3. Open [DevTools](chrome://inspect/#devices) in Chrome
4. Click `inspect` on needed CEF element in `Devices` tab on `Remote Target` section