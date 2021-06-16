const io = require('socket.io-client')
const socket = io.connect('http://localhost:3005')
const faker = require('faker')

const driverPool = []

function driver(arr) {
  while (arr.length < 5) {
    let driver = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      available: true
    }
    arr.push(driver)
  }
  console.log(arr)
}

function available(arr) {
  for (let i = 0; i < arr.length; i++) {

    if (arr[i].available = true) {
      arr[i].available = false
      return arr[i]
    } else {
      return 'Drivers currently unavailable!'
    }
  }

}

// Has access to the connect event on load
socket.on("connect", () => {

  driver(driverPool)

  socket.send('Distribution line reporting for duty!!!')
})


socket.on("message", data => {
  console.log(data);
});



setInterval(function () {
  let newDriver = available(driverPool)
  socket.emit('available', newDriver)
}, 5000)


socket.on('delivery', payload => {
  socket.send(`${payload[0].name} delivering ${payload[1]._id}!`)

  setTimeout(() => {
    socket.send(`Package ${payload[1].item} delivered to ${payload[1].customer.name}! Heading back to distribution hub!`)
    console.log('Delivery Succeeded on our end')

    socket.emit('delivered', payload)

    for (let i = 0; i < driverPool.length; i++) {

      if (driverPool[i].name === payload[0].name) {
        driverPool[i].available = true
        console.log(driverPool[i])
      }
    }
  }, 10000)


})

socket.on('appreciation', payload => console.log(payload))
