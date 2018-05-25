exports.run = (client, message, args) => {

	let channel = client.channels.get('421445329641013258');
channel = client.channels.find('name', 'Geral');
  channel.leave()
  console.log('Bot desconectado do canal de audio'.red)
  
};
