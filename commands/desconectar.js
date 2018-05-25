exports.run = (client, message, args) => {

	let channel = client.channels.get('397109089878016011');
	channel = client.channels.find('name', 'Musicas S/🎤');
	channel.leave()
	.then(connection => console.log('Desconectado'))
	.catch(console.error);
};