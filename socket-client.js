document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
        console.log('Connected to server');

        socket.emit('sendMessage', {
            sender: '666317aa109cfd264d99d2bb',
            receiver: '666317ba109cfd264d99d2bf',
            message: 'Hello from client!'
        });

        socket.emit("user1", "666317aa109cfd264d99d2bb");
    });

    socket.on('receiveMessage', (message) => {
        console.log('Received message from server:', message);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on("online-users", (data) => {
        console.log("Online users:", data.onlineUsers);
    });
});
