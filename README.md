# pri-parser
Parse PRI files using `makepri.exe`

Wrapper around `makepri.exe` for decompiling `.PRI` files, then parse resulting `.xml` file into useful JSON object.
`makepri.exe` can be downloaded by getting the [SDK](https://msdn.microsoft.com/en-us/windows/hardware/gg454513.aspx). After installing the SDK, the parser should be able to find `makepri.exe` in its default location.

## Usage

```
npm i pri-parser
```

##### `pri.parse(filePath[,config],callback)`

`config`: All properties are Optional.
- `makePriPath`: Absolute path to `makepri.exe`.  If not provided, will attempt to find it.
- `windowsVersion`: Used to select the appropriate version of `makepri.exe` when attempting to find it.
- `makePriArch`: Used to select the appropriate version of `makepri.exe` when attempting to find it.
- `xmlFileName`: Name of file for resulting XML file created by `makepri.exe`. Will be located in `./tmp`.
- `xmlFilePath`: Absolute path of file for resulting XML file created by `makepri.exe`. Overrides `xmlFileName`.
- `keepXml`: If truthy, the resulting XML will not be deleted after parsing is complete.
- `verbose`: If truthy, more info will get logged to console.
- `uriOnly`: If truthy, will return an Array of object containing resource name, uri and values. If falsy, will return object that looks more like the resulting XML file.


## Example

```javascript
var pri = require('pri-parser');

var filePath = 'full/path/to/file.pri';

var config = {
    uriOnly: true
};

pri.parse(filePath,config, function(data){
  console.log(JSON.stringify(data,null,2));
});

```
