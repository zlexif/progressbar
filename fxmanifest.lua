fx_version 'cerulean'
lua54 'yes'
game 'gta5'

author 'zlexif'
description 'Revamp of default qbcore progressbar'
version '1.0.0'


ui_page 'html/index.html'


shared_script {
    'shared/config.lua',
    '@ox_lib/init.lua'
}
client_script 'client/main.lua'
client_script 'client/exports.lua'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/public/audio/alert.mp3'
}

dependency 'ox_lib'
