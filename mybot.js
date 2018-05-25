const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const yt = require('ytdl-core');
var gd = require('node-gd');
var bemvindo = config.bemvindo;


let queue = {};


//****************************************************************
//* Neste bloco o bot vai iniciar e dar a resposta de status dele*
//****************************************************************
client.on("ready", () => {
  // Este evento vai iniciar o bot, e logar, com sucesso.
  console.log(`Iniciei normalmente, com ${client.users.size} usuarios, em ${client.channels.size} canais do ${client.guilds.size} guildas.`);
  console.log(process.version);
  // Exemplo de mudar o que o bot esta jogando por algo util. `client.user` é a referencia para "ClientUser".

  console.log(client.user.username);
  //depois de adicionar o bot de musica esta dando erro
  //client.user.setActivity(`${client.users.size} usuarios...`);
  client.user.setActivity('!ajuda para ajuda');
  client.user.setStatus('online');
  /*Status do bot disponivel
  online
  idle
  invisible
  dnd (do not disturb)
  */
  //comando original client.user.setGame(`Em ${client.guilds.size} servidores`);

});

//**************************************************
//este comando faz o console colocar saida de debug*
//**************************************************
  client.on("error", (e) => console.error(e));
  client.on("warn", (e) => console.warn(e));
  client.on("debug", (e) => console.info(e));

//******************
// Inicia o prefixo*
//******************
const prefix = "!";
client.on("message", (message) => {

  // Nesta linha ele nao faz o restante do comando caso nao tiver o prefixo inicial, e depois do OU || ele nao retorna para msg com bots
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  //aqui estou tentando colocar uma pasta de comandos separados,a pasta commands vai receber todos os comandos e executar conforme estiver escrito la
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
   try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }

});


//**************************************************************************************************************************
//nesta parte começa a contagem de pontos dos usuarios no servidor, ainda esta apresentando algum erro mas esta funcionando*
//**************************************************************************************************************************
let points = JSON.parse(fs.readFileSync("./util/pontos.json", "utf8"));
client.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };
  let userData = points[message.author.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`BIIIRRRLLL você subiu de nivel **${curLevel}**! olha o monstro saindo da jaula!`);
  }

  if (message.content.startsWith(prefix + "nivel")) {

    //nesta linha ele vai pegar a foto
  gd.openFile('/home/raspserver/Área\ de\ Trabalho/Motherfuckers-bot_certo/motherfuckers.jpeg', function(err, img) {
    if (err) {
    throw err;
  }
     var txtColor = img.colorAllocate(102, 153, 255);
     var fontPath = '/home/raspserver/Área\ de\ Trabalho/Motherfuckers-bot_certo/teste_fonte/stocky.ttf';
     img.stringFT(txtColor, fontPath, 24, 0, 10, 60, `Nivel: ${userData.level}`);
     img.stringFT(txtColor, fontPath, 24, 0, 10, 420, `Pontos: ${userData.points}`);
     img.saveFile('/home/raspserver/Área\ de\ Trabalho/Motherfuckers-bot_certo/motherfuckers2.jpeg', function(err) {
     img.destroy();
         if (err) {
        throw err;
    }
  });
});
     message.reply(`Seu nivel atual jovem padawan é ${userData.level}, com ${userData.points} pontos. Que a força esteja com você.`, {
     file: "./motherfuckers2.jpeg" 
});
    }
  fs.writeFile("./util/pontos.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
});

});


//*****************************************************************************
//entrada e saida de membros com bem vindo randomico linkado com o config.json*
//*****************************************************************************
function randomQuote() {
  return bemvindo[Math.floor(Math.random() * bemvindo.length)];
};
client.on('guildMemberAdd', member => {
  member.send(randomQuote());
  console.log(`${member.user.username} entrou no servidor`);
 });


//****************
//Seção da musica*
//****************
const commands = {
  'play': (msg) => {
    if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Adicione alguma musica primeiro na fila com o comando ${config.prefix}adicionar`);
    if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
    if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Ja estou cantando para você, veja se nao estou mutado...');
    let dispatcher;
    queue[msg.guild.id].playing = true;

    console.log(queue);
    (function play(song) {
      console.log(song);
      if (song === undefined) return msg.channel.sendMessage('A lista está vazia,vou ir deitar,quando quiser ouvir minha linda voz novamente me chame...').then(() => {

        //adicionado esta linha do status
        client.user.setActivity('!ajuda para ajuda');
        client.user.setStatus('online');
        //msg.member.voiceChannel.leave();
        queue[msg.guild.id].playing = false;
      });
      msg.channel.sendMessage(`Tocando: **${song.title}** pedido por: **${song.requester}**`);

      //adicionado esta linha do status
      client.user.setActivity(`Tocando ${song.title}`);
      client.user.setStatus('dnd');
      //client.setStreaming(`${song.title}', 'por ${song.requester}`, 1);

      dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : config.passes });
      let collector = msg.channel.createCollector(m => m);
      collector.on('message', m => {
        if (m.content.startsWith(config.prefix + 'pause')) {
          msg.channel.sendMessage('Pausado').then(() => {dispatcher.pause();});
        } else if (m.content.startsWith(config.prefix + 'voltar')){
          msg.channel.sendMessage('Voltando a tocar').then(() => {dispatcher.resume();});
        } else if (m.content.startsWith(config.prefix + 'passa')){
          msg.channel.sendMessage('Musica passada').then(() => {dispatcher.end();});
        } else if (m.content.startsWith(config.prefix + 'volume+')){
          if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
          dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
          msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
        } else if (m.content.startsWith(config.prefix + 'volume-')){
          if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
          dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
          msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
        } else if (m.content.startsWith(config.prefix + 'tempo')){
          msg.channel.sendMessage(`Tempo atual: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
        }
      });
      dispatcher.on('end', () => {
        collector.stop();
        play(queue[msg.guild.id].songs.shift());
      });
      dispatcher.on('error', (err) => {
        return msg.channel.sendMessage('error: ' + err).then(() => {
          collector.stop();
          play(queue[msg.guild.id].songs.shift());
        });
      });
    })(queue[msg.guild.id].songs.shift());
  },
    //comando desconectar apresentando erro de crashar o bot e apagar os pontos

    'dc': (msg) => {
    return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Nao pude conectar no canal de voz, verifique este erro com os adm...');
      voiceChannel.leave().then(connection => resolve(connection)).catch(err => reject(err));
    });
   },
  'join': (msg) => {
    return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Nao pude conectar no canal de voz, verifique este erro com os adm...');
      voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
    });
  },
  'adicionar': (msg) => {
    let url = msg.content.split(' ')[1];
    if (url == '' || url === undefined) return msg.channel.sendMessage(`Voce precisa adicionar uma url do YouTube ou o nome depois do comando ${config.prefix}adicionar`);
    yt.getInfo(url, (err, info) => {
      if(err) return msg.channel.sendMessage('Link do youtube invalido: ' + err);
      if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
      queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
      msg.channel.sendMessage(`Adicionado **${info.title}** para a lista`);
    });
  },
  'lista': (msg) => {
    if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Adicione alguma musica para a lista primeiro com o comando ${config.prefix}adicionar`);
    let tosend = [];
    queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Pedido por: ${song.requester}`);});
    msg.channel.sendMessage(`__**Servidor: ${msg.guild.name} \n Lista de musica:**__ Adicionado **${tosend.length}** musicas na lista ${(tosend.length > 15 ? '*[Só mostra as proximas 15]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
  },
  'ajudam': (msg) => {
    let tosend = ['```xl', config.prefix + 'entrar : "Faz o bot entrar no canal de musica"', config.prefix + 'adicionar : "Adiciona o link do Youtube a lista de musica"', config.prefix + 'conectar : "Chama o bot para o seu canal"', config.prefix + 'desconectar : "Desconecta o bot do canal de musica"',config.prefix + 'lista : "Mostra a lista de musica,consegue mostar ate 15 musicas na lista."', config.prefix + 'play : "Toca a musica na lista somente se você ja estiver na sala"', '', 'os proximos comandos so funcionam quando o comando tocar estiver funcionando:'.toUpperCase(), config.prefix + 'pause : "Pausa a musica"', config.prefix + 'voltar : "Faz a musica voltar a tocar de onde parou"', config.prefix + 'passa : "Passa para a proxima musica"', config.prefix + 'tempo : "Mostra o tempo atual da musica."',  'volume+(+++) : "aumenta o volume em 2%/+"',  'volume-(---) : "diminui o volume em  2%/-"',  '```'];
    msg.channel.sendMessage(tosend.join('\n'));
  },
  'reboot': (msg) => {
    channel.send('Resetando o main do bot....')
    .then(msg => client.destroy())
    .then(() => client.login(config.token));  }
};


client.on('message', msg => {
  if (!msg.content.startsWith(config.prefix)) return;
  if (commands.hasOwnProperty(msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0]](msg);
});


//*****************************************************************************
//Este processoreboota o bot, mas por algum motivo nao esta recarregando o bot*
//*****************************************************************************
// seta para aguardar o processo
client.on('message', message => {
    switch(message.content.toUpperCase()) {
        case '?RESET':
            resetBot(message.channel);
            break;

        //outros comdandos
    }
});

// Desliga o bot (destroi), depois liga ele devolta
function resetBot(channel) {
    // manda send channel a message that you're resetting bot [optional]
    channel.send('Resetando o main do bot....')
    .then(msg => client.destroy())
    .then(() => client.login(config.token));
}


//********************************************************
//esta função pega o token da config e faz o login do bot*
//********************************************************
client.login(config.token);
