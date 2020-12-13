
var json = require('./data.json');
const IP_ADDR = '127.0.0.1'
const UDP_PORT = 49161
const OSC_PORT = 49162

const dgram = require('dgram')
const udpserver = dgram.createSocket('udp4')

const osc = require('node-osc')
const oscserver = new osc.Server(OSC_PORT, IP_ADDR)

console.log(`Started Listener\n\nUDP:${UDP_PORT}\nOSC:${OSC_PORT}\n`)

// Error

udpserver.on('error', (err) => {
	console.log(`UDP server:\n${err.stack}`)
	udpserver.close()
})

oscserver.on('error', (err) => {
	console.log(`OSC server:\n${err.stack}`)
	oscserver.close()
})

// Message

udpserver.on('message', (msg, rinfo) => {
	console.log(`UDP server: ${msg} from ${rinfo.address}:${rinfo.port}`)
	if (msg.toString()[0] >= '0' && msg.toString()[0] <= '9' && msg.toString()[1] == '#')
	{
		let full_addr = json.UPD_list[msg.toString()[0]].toString().split(':');
		console.log(`Special command ${json.UPD_list[msg.toString()[0]]}`);
		console.log(`IP ${full_addr[0]}`);
		console.log(`PORT ${full_addr[1]}`);
		console.log(`Concat msg ${msg.toString().substr(2)}`);
		udpserver.send(`${msg.toString().substr(2)}`, 0,
			msg.toString().substr(2).length, full_addr[1], full_addr[0]);
	}
	else
	{
		let full_addr = json.UPD_list['0'].toString().split(':');
		console.log(`IP ${full_addr[0]}`);
		console.log(`PORT ${full_addr[1]}`);
		udpserver.send(`${msg}`, 0,
			msg.length, full_addr[1], full_addr[0]);
	}
	console.log();
})

oscserver.on('message', (msg, rinfo) => {
	console.log(`OSC server: ${msg} from ${rinfo.address}:${rinfo.port} at ${msg[0]}`)
})

udpserver.bind(UDP_PORT)

// Send a run message to orca

udpserver.send('run', 0, 3, 49160, IP_ADDR)
