# markdonw Editor

Markdownエディタアプリ

## dev

デバックを行う場合はブラウザで行う方が楽な場合がある。ただし、ブラウザ上で動作するためnode.js-API(ファイル操作など)は利用できない

```bash
npm install
npm run ng:serve:web
```

Windowアプリで開発を行う場合は`npm start`をする。画面のリフレッシュには`ctrl + r`を行う。

```bash
npm install
npm start
```

### debug

`F5`

## make exe

```bash
npm run electron:windows
```

## License

Licensed under the MIT license.

## Acknowledgements

* https://github.com/vscode-icons/vscode-icons
