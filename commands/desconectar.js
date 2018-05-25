exports.run = (client, message, args) => {

	let channel = client.channels.get('aqui_entra_o');
channel = client.channels.find('name', 'aqui_entra_o_nome_da_sala');
  channel.leave()
  console.log('Bot desconectado do canal de audio'.red)
  
};
