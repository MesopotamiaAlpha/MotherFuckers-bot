exports.run = (client, message, args) => {
//este comando troca o status do bot e depois de um tempo ele altera novamente
/*Status do bot disponivel
  online
  idle
  invisible
  dnd (do not disturb)
  */
		client.user.setStatus('idle'); // Now idle
		client.user.setActivity(`${client.users.size} usuarios...`);
        setTimeout(() => { client.user.setStatus('online'); }, 10000); // Set the status back to online after 10 seconds.
 		setTimeout(() => { client.user.setStatus('dnd'); }, 10000);

}