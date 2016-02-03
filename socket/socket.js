/**
 * Created by Duy.AnhNguyen on 2/3/2016.
 */
module.exports = function(io, rooms){
    var chatrooms = io.of('/roomlist').on('connection', function(socket) {
       console.log('Connection Established on the Server !');

        socket.on('newroom', function(data){
           rooms.push(data);
            console.log(rooms);
            socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
            socket.emit('roomupdate', JSON.stringify(rooms));
        });
    });

    var messages = io.of('/messages').on('connection', function(socket) {
        console.log('Connected to the chatroom !');

        socket.on('joinroom', function(data) {
            console.log('joinroom');
            console.log(data);
            socket.username = data.user;
            socket.userPic = data.userPic;
            socket.join(data.room);

            updateUserList(data.room, true);
        });

        socket.on('newmessage', function(data) {
            socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
        });

        function  updateUserList(room, updateAll) {
            console.log('updateUserList');
            var getUsers = io.of('/messages').clients(room);
            var userlist = [];

            console.log(getUsers);
            for(var i in getUsers) {
                userlist.push({user: getUsers[i].username, userPic: getUsers[i].userPic});
            }

            if(updateAll) {
               socket.broadcast.to(room).emit('updateUsersList', JSON.stringify(userlist));
            } else {
                socket.to(room).emit('updateUsersList', JSON.stringify(userlist));
            }

        }

        socket.on('updateList', function(data) {
            console.log('updateList');
           updateUserList(data.room, false);
        });
    });
}
