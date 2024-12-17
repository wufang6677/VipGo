//添加在：builder.json-> "artifactBuildCompleted": "./electron/config/artifactBuildCompleted.js"
//https://www.electron.build/hooks#artifactbuildcompleted
exports.default = async function (context) {
    // console.log(context)
    const fs = require('fs')
    console.log("===================artifactBuildCompleted->生成update.asar=======================")
    const asarFileDir = context.target.outDir + '/win-unpacked/resources/'
    const outZipPath = "F:\\Program Files\\test\\"

    const asarFilePath = asarFileDir + 'app.asar'
    const newAsarFilePath = asarFileDir + 'update.asar'
    const newZipFilePath = outZipPath + '/files/update.zip'

    fs.copyFile(asarFilePath, newAsarFilePath, () => {
    })

    const AdmZip = require('adm-zip')
    // 创建ZIP实例
    const zip = new AdmZip(null);
    zip.addLocalFile(newAsarFilePath)
    zip.writeZip(newZipFilePath, () => {
        fs.unlinkSync(newAsarFilePath)
    })

    const version = context["packager"]["appInfo"]["version"]
    const outZipInfoPath = outZipPath + "配置.json"
    fs.readFile(outZipInfoPath, "utf-8", function (err, data) {
        if (err) {
            console.error("读取文件失败!")
            console.error(err)
            return false
        }
        const json_data = JSON.parse(data)
        json_data['appUpdate'] = {
            "current": version,
            "desktop_app_URL": "http://127.0.0.1:10000/download/update.zip"
        }
        const json_str = JSON.stringify(json_data, null, 2)
        fs.writeFile(outZipInfoPath, json_str, 'utf-8', () => {
        })
    })
}
