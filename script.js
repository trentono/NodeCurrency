var socket = io.connect();
socket.on("message", function(msg){
    console.log("isDirty: " + msg);
});