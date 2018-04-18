var gd = require('node-gd');

//nesta linha ele vai pegar a foto
gd.openFile('/home/jose/Desktop/motherfuckers.jpeg', function(err, img) {
  if (err) {
    throw err;
  }

 //aqui ele vai setar a cor da fonte
 var txtColor = img.colorAllocate(255, 0, 255);
 
// Aqui preciso do caminho completo de onde estiver a fonte
var fontPath = '/home/jose/Desktop/bot_teste_motherfuckers/teste_fonte/stocky.ttf';

// Aqui renderiza a string na imagem              
img.stringFT(txtColor, fontPath, 24, 0, 10, 60, 'Texto 1!');
img.stringFT(txtColor, fontPath, 24, 0, 180, 220, 'Texto 2!');

  //e aqui ele salva a imagem
  img.saveFile('/home/jose/Desktop/newFile.bmp', function(err) {
    img.destroy();
    if (err) {
      throw err;
    }
  });
});