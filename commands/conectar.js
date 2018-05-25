exports.run = (client, message, args) => {

  // Pegar o nome do canal pelo ID
  let channel = client.channels.get('aqui_vai_entrar_o_id_da_sala');

  // ou pelo nome (menos persistente)
  channel = client.channels.find('name', 'aqui_entra_o_nome_da_sala');
  channel.join()

  //aqui estou tentando pegar o nome da sala e mostar no console,mas nao esta funcionando, esta aparecendo undefined
  .then(connection => console.log(`Bot conectado com sucesso no canal de audio ${client.channels.get}`.green))
  .catch(console.error);
};
