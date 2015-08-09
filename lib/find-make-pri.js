var fs = require('fs');

//URL to get Dev Kits: https://msdn.microsoft.com/en-us/windows/hardware/gg454513.aspx
// should only need the SDK

var windowsKits = 'C:\\Program Files (x86)\\Windows Kits';


function find(windows_version, arch){

    arch = arch || process.arch;

    if(!fs.existsSync(windowsKits))
        throw 'Could not find Windows Kit Directory';

    if(!windows_version){

        //check 10, then 8.1 then 8
        if(fs.existsSync(windowsKits+'\\10')){
            windows_version = '10';
        } else if(fs.existsSync(windowsKits+'\\8.1')){
            windows_version = '8.1';
        } else if(fs.existsSync(windowsKits+'\\8')){
            windows_version = '8';
        } else {
            throw 'Could not find Windows Kit for Windows 10, 8.1 nor 8';
        }

    } else {
        windows_version = windows_version.toString();
        if(windows_version !== '10' || windows_version !== '8.1' || windows_version !== '8'){
            throw 'Invalid windows version, must be 10, 8.1 or 8';
        }
    }

    return windowsKits+'\\'+ windows_version +'\\bin\\'+arch+'\\makepri.exe';

}

module.exports = find;
