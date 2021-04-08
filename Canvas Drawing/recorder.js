    // place your javascript code here

    "use strict";

    var mousepressed = false;
    var ctx;
    var canvas;
    var lastX, lastY;
    var head = null;
    var tail = null;
    var record = false;
    var recordfile;
    var replay = false;
    var recordingName, timer,playSpeed;
    var pause = false;

    window.addEventListener('load', function (e) {
        main();
    });


    class LinkedList {
 

        // A constructor that takes a comparison function as parameter that is used to find elements in the list.
        constructor(x,y,penSettings,comparator) {  //NEED TO IMPLEMENT THE COMPARATOR
            this.penSettings = penSettings;
            this.data = [x,y];
            this.next = null;
            this.comparator = comparator;
        }

        // Add element to the front of the list.
        addToFront (newNode) {

            // check if it's empty
            if (head == null) {
                head = newNode;
                tail = newNode;
                
            } else {
                let temp = head;
                newNode.next = temp;
                head = newNode;

            }

        }

        // Add element to the end of the list.
        addToEnd(newNode) {

            // check if empty
            if (head == null) {
                head = newNode;
                tail = newNode;
            } else {
                tail.next = newNode;
                tail = newNode;

            }
        }

        // Add element in the middle of the list.
        addToMiddle(newNode,index) {
            let curr = head;
            let counter = 0;
            
            while (counter != index){
                curr = curr.next;
                counter++;
            }

            newNode.next = curr.next;
            curr.next = newNode;
        }

        // Find element
        get(data) {
            let curr = head;
            let found = false;
            while (data[0] !== curr.data[0] && data[1] !== curr.data[1] && curr.next !== null) {
                curr = curr.next;
            }
            if (data[0] == curr.data[0] && data[1] == curr.data[1]){
                return curr;
            } else {return null;}

        }

        // Size of the list
        getSize () {
            let counter = 1;
            let curr = head;
            while (curr.next !== null) {
                counter++;
            }
            return counter;
        }
    }



    function main() {
        canvas  = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
    
        sessionStorage.clear();

        // Add saved recordings on refresh
        for (var i = 0; i < localStorage.length ;i++){
            document.getElementById('recordinglist').add(new Option(localStorage.key(i)));
        }

        // Playback Speed slider event listener
        document.getElementById('speed').addEventListener('input', function () { 
        let speed = document.getElementById('speed').value;
        speed = 100- document.getElementById('speed').value;
        playSpeed = speed;
    });

        // pause
        document.getElementById('pause').addEventListener('click', function () {
            pause = true;

        });

        // Edit


        // start recording
        document.getElementById('startRecord').addEventListener('click', function () {
            record = true;
            document.getElementById('startRecord').style.backgroundColor = 'lightcoral';
            canvasMessage('Recording Started.');
        });

        // retrieve recording
        document.getElementById('recordinglist').addEventListener('change', function () {
            clearCanvas();
            replay = true;
            recordingName = document.getElementById('recordinglist').value;
            canvasMessage(`${recordingName} loaded.`);
        });
        
        // delete recording
        document.getElementById('delete').addEventListener('click', function () {
            let name = document.getElementById('recordinglist').value;
            confirm(`Are you sure you want to delete ${name}? This will permanently delete the recording.`)
            clearCanvas();
            if (localStorage.getItem(name) !== null) {
                canvasMessage(`Deleting ${name}.`);
                localStorage.removeItem(name);
                document.getElementById('recordinglist').remove(name.slice(9,name.length)+1);
                document.getElementById('recordinglist').selectedIndex = 0;
            } 
            
        });


        // stop recording
        document.getElementById('stopRecord').addEventListener('click', function () {
            if (record){
            sessionStorage.clear();
            record = false;
            sessionStorage.setItem('recording',JSON.stringify(head));
            clearCanvas();
            canvasMessage('Recording Stopped.');
            document.getElementById('startRecord').style.backgroundColor = '';

            // reset head and tail pointer
            head = null;
            tail = null;
        }
        });
        

        // Event listener when mouse is pressed
        canvas.addEventListener('mousedown', function (e) {
            mousepressed = true;
            processDraw(e,false);
            });

        // Event listener when mouse moves
        canvas.addEventListener('mousemove', function (e) {
            if (mousepressed) {
                processDraw(e,true);
            }
            });

        // Even listener when mouse is released 
        canvas.addEventListener('mouseup', function (e) {
        mousepressed = false;
        if (record) {
            const newNode = new LinkedList(undefined,undefined);
            tail.next = newNode;
            tail = newNode;
        }
    });

        // Event Listener when mouse leaves the canvas
        canvas.addEventListener('mouseleave', function (e) {
        mousepressed = false;
        if (record) {
            const newNode = new LinkedList(undefined,undefined);
            tail.next = newNode;
            tail = newNode;
        }
    });


    // Collapsible function
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
        content.style.display = "none";
        } else {
        content.style.display = "block";
        }
    });
    }

    }

    function processDraw(e,isDown) {
        var rect = canvas.getBoundingClientRect();
        var x,y;

        if (isDown){
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;

            // start recording
            if (record){
                const newNode = new LinkedList(x,y,[document.getElementById('pencolor').value,document.getElementById('penWidth').value]);
                if (head == null ) {
                    head = newNode;
                    tail = newNode;
                } else {
                    head.addToEnd(newNode);
                }
            } else {

            }
            draw(x,y);

        } 

        lastX = x; lastY = y;
    }

    function draw(x,y){
        ctx.beginPath();
        ctx.strokeStyle = document.getElementById('pencolor').value;
        ctx.lineWidth = document.getElementById('penWidth').value;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

    // clear the canvas
    function clearCanvas() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        document.getElementById('pencolor').value = '#000000';
    }

    // play
    function play(){
        playSpeed = (100 - document.getElementById('speed').value);

        if (!replay && pause == false ) {
            clearCanvas();
            recordfile = JSON.parse(sessionStorage.getItem('recording'));   

            lastX = undefined;
            lastY = undefined;
        
            timeout(); 
        } else if (pause == true) {
            timeout();
            pause = false
        } else {
            if (recordfile !== null)
            recordfile = JSON.parse(localStorage.getItem(recordingName));
             

            lastX = undefined;
            lastY = undefined;

            timeout();            

            document.getElementById('recordinglist').value = 'Saved Recordings';
            replay = false;

        }
} 

    function timeout () {
 
        timer = setTimeout(() => {
        if (recordfile.next !== null && recordfile.data[0] !== null && pause == false) {
            document.getElementById('penWidth').value = recordfile.penSettings[1];
            document.getElementById('pencolor').value = recordfile.penSettings[0];

            draw(recordfile.data[0],recordfile.data[1])
            lastX = recordfile.data[0];
            lastY = recordfile.data[1];
            recordfile = recordfile.next;
            timeout();
        } else if (recordfile.next !== null && recordfile.data[0] == null && pause == false) {
            lastX = undefined;
            lastY = undefined;
            recordfile = recordfile.next;

            timeout();
        } else if (pause == true) {
            clearTimeout(timer);
            return;
        }

    }, playSpeed);  

    }

    function eraser() {
        document.getElementById('pencolor').value = '#FFFFFF';
    }


    // Event listener when save recording is clicked
    function save() {
        if (confirm('Are you sure you want to save the recording?')){
        let name = prompt('Enter a name of your recording')
        if (localStorage.getItem(name)== null) {
        document.getElementById('recordinglist').add(new Option(name));
        localStorage.setItem(name, sessionStorage.getItem('recording'));
        head = null;
        tail = null;
        sessionStorage.removeItem('recording');
        } else {alert('The name you entered already exists. Please try again and enter a different name.')}
        }
    }

    function smallCanvas(){
        canvas.width = 600;
        canvas.height = 310;
    }

    function mediumCanvas() {
        canvas.width = 800;
        canvas.height = 500;
    
}
    function largeCanvas() {
        canvas.width = 1500;
        canvas.height = 700;

    }

    function canvasMessage(message){
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'blue';
        ctx.font = '25px Arial';
        ctx.strokeText(`${message}`, 300, 250,500);
        ctx.fillText(`${message}`,300, 250,500);
        
        setTimeout(function(){
            clearCanvas();
        }, 800);
    }