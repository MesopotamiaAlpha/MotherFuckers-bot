exports.run = (client, message, args) => {
        message.channel.send({embed: {
    color: 3444003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Comandos disponiveis",
    
    description: "Aqui esta os comandos disponiveis para o bot até momento.",
    fields: [{
        name: "ping",
        value: "Este comando por enquanto só retorna uma mensagem de pong, breve ele vai mostrar a latencia entre o servidor e você."
      },
      {
        name: "convite",
        value: "O bot vai te entrega um convite temporario para o servidor *atenção* **__É TEMPORARIO__** , use com sabedoria."
      },
      {
        name: "recarregar",
        value: "Usado para recarregar algum comando alterado no servidor **SOMENTE PARA USO DO ADMIN."
      },
      {
        name: "estavivo",
        value: "Comando para o bot se apresentar a você e ver se ele esta funcionando corretamente."
      },
      {
        name: "ajudam",
        value: "Mostra todos os comandos do bot de musica do MotherFuckers."
      },
      {
        name: "sorteio",
        value: "Ele usa o comando do Discord para randomicamente selecionar algum usuario do servidor."
      },
      {
        name: "nivel",
        value: "Mostra o seu nivel no servidor."
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "!!Bot em desenvolvimento!! V 1.0.0"
    }
  }
});
}