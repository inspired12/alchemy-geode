            var structure = {pages:["Our Firm","Our Attorneys","Areas of Practice","Firm News","In The Community", "Contact Us"]};

            var animateCube = false;

            var counter = 0;
            var wall;

			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

            var linesObj = new THREE.Group();
            var cardsObj = new THREE.Group();
            var bioObj = new THREE.Group();

            var HOME = new THREE.Object3D();
            var TARGET = new THREE.Object3D();
            var MODIFY = new THREE.Object3D();
            var OFFSET = new THREE.Object3D();

            var totalObjects = 6;


            var raycaster;
            var mouse;

            var EASE = TWEEN.Easing.Quintic.InOut;

            var objects = [];

			var renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});

            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );

			var geometry,material,cube,controls;

var camPos = [{x: 0,y:-15,z:1},
              {x: 0,y:3,z: 5},
              {x:-5,y:-2,z:5}
             ];

var selected = true;
var firstClick = true;


            init();
            animate();

            Path.listen();
            Path.root("#/");

            function createText(message,size) {

                  var textObj = new THREE.Object3D();

                  var w = message.length;
                  var config = {font:_font,size:0.1,height:0.0125};

                  if(size == "tiny"){
                    config = {font:_font,size:0.018,height:0.0125*0.35};
                  }

                    var ar = message.split(" ");
if(ar.length>3){
    ar = message.split(",");
    var offset = (ar.length/10)*0.1;
                    for(var i = 0; i<ar.length; i++){

                             // var shape = new THREE.TextGeometry(message,config);
                              var shape = new THREE.TextGeometry(ar[i],config);
                              var wrapper = new THREE.MeshBasicMaterial( { color: 0x000000} );
                              var words = new THREE.Mesh(shape, wrapper);
                              var box = new THREE.Box3().setFromObject(words);
                              words.position.z=config.height*1.5;
                              words.position.x=-box.size().x/2;
                              words.position.y= 0 - (i*(config.size+0.01)) + offset;

                              textObj.add(words);
                    }
                     //         return words;
}else{


                              var shape = new THREE.TextGeometry(message,config);
                            //  var shape = new THREE.TextGeometry(ar[i],config);
                              var wrapper = new THREE.MeshBasicMaterial( { color: 0x000000} );
                              var words = new THREE.Mesh(shape, wrapper);
                              var box = new THREE.Box3().setFromObject(words);
                              words.position.z=config.height*1.5;
                              words.position.x=-box.size().x/2;
                              words.position.y=0;

                              textObj.add(words);

}

                  return textObj;

            }


         function init(){

                camera.position.x = camPos[0].x;
                camera.position.y = camPos[0].y;
                camera.position.z = camPos[0].z;

                scene.fog = new THREE.Fog(0xDDDDDD, 1, 30);

                loadFont();// then build cards and services
                loadEvents();

                buildCube();
                buildWall();

                buildTargets();
                buildBios();
                buildLines();

                setTimeout(function(){ 
                        tweenCameraHome();
                },3000);

        }

function loadEvents(){

                        //controls = new THREE.OrbitControls( camera, renderer.domElement );
                       // controls.enableDamping = true;
                       // controls.dampingFactor = 0.25;

            document.addEventListener( 'mousedown', onDocumentMouseDown, false );
            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            document.addEventListener( 'touchstart', onDocumentTouchStart, false );
            window.addEventListener( 'resize', onWindowResize, false );
            mouse = new THREE.Vector2();
            raycaster = new THREE.Raycaster();
}


function buildTargets(){

    HOME.position.x = camPos[0].x;
    HOME.position.y = camPos[0].y;
    HOME.position.z = 6;

    OFFSET.position.x = 0;
    OFFSET.position.y = 0;
    OFFSET.position.z = 0;

    scene.add(TARGET);
    scene.add(MODIFY);
    scene.add(OFFSET);

}
function buildTextSprite(){

    var spritey = makeTextSprite( " Hello, ", 
        { fontsize: 12, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
    spritey.position.set(0,0,0);
    scene.add( spritey );

}

        function setLights(){

            var light = new THREE.DirectionalLight( 0xFFFF00, 1 );
            light.position.set( 0, 0,2 );
            var targ = new THREE.Object3D(); 

            targ.position.x =0;
            targ.position.y =0;
            targ.position.z =0;

            light.target = targ;
            light.castShadow = true;
            light.shadowDarkness = 0.5;

            scene.add( light );

            var spotLight = new THREE.SpotLight( 0xFFDDDD);
            spotLight.position.set( 0, 0, 1000 );

            spotLight.intensity = 0.25;
            spotLight.castShadow = true;
            spotLight.onlyShadow = true;

            spotLight.shadowMapWidth = 1024*4;
            spotLight.shadowMapHeight = 1024*4;

            spotLight.shadowCameraNear = 500;
            spotLight.shadowCameraFar = 1500;
            spotLight.shadowCameraFov = 60;

            scene.add( spotLight );

        }

        function tweenObject(params){

            var obj = params.obj;
            var _current = params.obj.position;
            var _speed = params.speed || 500;
            var _dest = params.destination;
            var _delay = params.delay; 

            var tween = new TWEEN.Tween(_current).to(_dest, _speed);

            tween.easing(EASE);

            tween.onUpdate(function(){
                obj.position.x = _current.x;
                obj.position.y = _current.y;
                obj.position.z = _current.z;
            });

            tween.delay(_delay);
            tween.start();

        }

        function extrudeObject(params){

            var obj = params.obj;
            var _current = params.obj.scale;
            var _speed = params.speed || 500;
            var _dest = params.destination;
            var _delay = params.delay; 

            var tween = new TWEEN.Tween(_current).to(_dest, _speed);

           // tween.easing(TWEEN.Easing.Exponential.InOut);
            tween.easing(EASE);

            tween.onUpdate(function(){
                obj.scale.x = _current.x;
                obj.scale.y = _current.y;
                obj.scale.z = _current.z;
            });

            tween.delay(_delay);
            tween.start();

        }


        function gridBio(){

            var _objects = bioObj.children;

            for(var i = 0; i<_objects.length ;i++){
                    var newgrid = {z:0, y:grid[i].y * 0.25 - 0.05 ,x:grid[i].x * 0.3 - 3};
                    tweenObject({obj:_objects[i],destination:newgrid,delay:i*100});
            }
          //  hideAll();

        }
        function hideBio(){

            var _objects = bioObj.children;

            for(var i = 0; i<_objects.length ;i++){

                    var newgrid = {};
                    newgrid.z = -10;
                    newgrid.y = 0;
                    newgrid.x = 0;
                    tweenObject({obj:_objects[i],destination:newgrid,delay:i*100});
            }

            restoreAll();

        }


        function restoreAll(_obj){

            var tween = new TWEEN.Tween(camera.position).to({
                x: camPos[0].x,
                y: camPos[0].y ,
                z:  camPos[0].z,
            },2000).easing(EASE).onUpdate(function () {
               // camera.lookAt(TARGET.position);
            }).onComplete(function () {
            //    camera.lookAt(selectedObject.position);
            }).start();

        }

        function onDocumentTouchStart( event ) {
                    
                event.preventDefault();
                
                event.clientX = event.touches[0].clientX;
                event.clientY = event.touches[0].clientY;
                onDocumentMouseDown( event );

            }   

            function onDocumentMouseMove( event ) {

                        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
                        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

            }

            function bringDownMenu(){
                var menu = document.getElementById("header");
                menu.className = "header active";
            }
            function bringUpMenu(){
                var menu = document.getElementById("header");
                menu.className = "header passive";
            }
            function bringSidebar(){
                var menu = document.getElementById("sidebar");
                menu.className = "sidebar active";
            }

            function hideSidebar(){
                var menu = document.getElementById("sidebar");
                menu.className = "sidebar passive";
            }

            function onDocumentMouseDown( event ) {


                event.preventDefault();


                        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
                        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

                        raycaster.setFromCamera( mouse, camera );

                        var intersects = raycaster.intersectObjects( objects );
                        var intersectsCards = raycaster.intersectObjects( servicesList );

                        if ( intersectsCards.length > 0 ) {

                            var theobj = intersectsCards[0].object;
                            console.log(theobj.name);
                            loadSection(theobj.name);
                        } else if ( intersects.length > 0 ) {

                            var theobj = intersects[0].object;
 //                           theobj.material.color.setHex(0x000000);

                                if(selected){
                                        tweenCameraToObject({obj:theobj});

                                        console.log(theobj.name);

                                        bringDownMenu();

                                        if(theobj.name == "OUR ATTORNEYS"){
                                            setTimeout(function(){ gridBio() }, 2000);
                                        }
                                        if(theobj.name == "AREAS OF PRACTICE"){
                                            setTimeout(function(){ gridServices() }, 2000);
                                        }
                                        if(theobj.name == "OUR FIRM"){
                                            tweenCameraSide();
                                            setTimeout(function(){ bringSidebar(); }, 2000);                            
                                        }

                                        selected = !selected;

                                }else{
                                        tweenCameraHome();
                                        setTimeout(bringUpMenu,2000);
                                }




                        }else{
                            tweenCameraHome();
                            setTimeout(bringUpMenu,2000);
                        }

            }

            function buildWall(){

                    var cardM = new THREE.MeshBasicMaterial( { color: 0xdddddd} );
                    var cardG = new THREE.BoxGeometry(20,20,0.5);

                    cardM.side = THREE.DoubleSide;
                    wall = new THREE.Mesh(cardG,cardM);

                    wall.position.z = -8;

                    wall.castShadow = false;
                    wall.receiveShadow = true;

                    scene.add(wall);

            }

        function loadFont() {
                var loader = new THREE.FontLoader();
                loader.load( 'scripts/Open Sans Light_Regular.js', function ( response ) {
                    _font = response;

             //       buildCards();
                      buildBlocks();
                      buildServices();

                } );
        }

function buildBios(){
    var bioObjectList=[];

    for(var i = 0; i<9; i++){

        var loader = new THREE.TextureLoader();
        // load a resource
        loader.load(
            // resource URL
        'textures/pro/bio- '+(i+1)+'.jpg',
            // Function when resource is loaded
            function ( texture ) {
                // do something with the texture
                var cardM = new THREE.MeshBasicMaterial( {
                    map: texture,transparent:true
                 } );

                cardM.side = THREE.DoubleSide;
                var cardG= new THREE.PlaneGeometry(1 *0.5,0.57 *0.5);
                var card = new THREE.Mesh(cardG,cardM);
                card.position.z = -8;
                card.position.x = -3;
                bioObj.add(card);
                bioObjectList.push(card);
            },

            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );

    };

    scene.add(bioObj);

}

function buildCards(){

    for(var i = 0; i<totalObjects; i++){
	    var cardM = new THREE.MeshBasicMaterial( { color: 0xFFFFFF} );
        cardM.side = THREE.DoubleSide;
        var	cardG = new THREE.BoxGeometry(2,1.25 , 0.125);
        var card = new THREE.Mesh(cardG,cardM);
        var xpos = (Math.round(Math.random()*2-1)*4);

/*
        var egh2 = new THREE.EdgesHelper( card, 0x888888 );
        egh2.material.linewidth = 2;
        scene.add( egh2 ); 
*/
/*
        card.castShadow = true;
        card.receiveShadow = false;
*/

        card.position.x = coords[i].x;
        card.position.y = coords[i].y;
        card.position.z = coords[i].z;

        card.name = structure.pages[i].toUpperCase();
        card.add(createText(structure.pages[i].toUpperCase()));

        cardsObj.add(card);
        objects.push(card);
    };

    scene.add(cardsObj);

}

function buildCube(){
        geometry = new THREE.BoxGeometry(1.25,1.25 , 1.25);
        material = new THREE.MeshBasicMaterial( { color: 0xbbbbbb} );

/*
        cube = new THREE.Mesh( geometry, material );

        cube.castShadow = true;
        cube.receiveShadow = false;
*/



        // instantiate a loader
        var loader = new THREE.TextureLoader();

        // load a resource
        loader.load(
            // resource URL
        'textures/icons/bw.png',
            // Function when resource is loaded
            function ( texture ) {
                // do something with the texture
                var logoM = new THREE.MeshBasicMaterial( {
                    map: texture,transparent:true
                 } );

         //       logoM.side = THREE.DoubleSide;

        cube = new THREE.Mesh( geometry, logoM );

        var egh = new THREE.EdgesHelper( cube, 0x888888 );
        egh.material.linewidth = 2;
        scene.add( egh ); 
                  scene.add( cube );
                  animateCube = true;
                  render();
            },

            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );
}

function buildLogo(){

// instantiate a loader
var loader = new THREE.TextureLoader();

// load a resource
loader.load(
    // resource URL
'textures/icons/logo.png',
    // Function when resource is loaded
    function ( texture ) {
        // do something with the texture
        var logoM = new THREE.MeshBasicMaterial( {
            map: texture,transparent:true
         } );

        logoM.side = THREE.DoubleSide;

          var logoG = new THREE.PlaneGeometry(0.75,1);
          var logo = new THREE.Mesh(logoG,logoM);
          logo.position.z =1.25;
          scene.add(logo);
          render();

    },

    // Function called when download progresses
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    // Function called when download errors
    function ( xhr ) {
        console.log( 'An error happened' );
    }
);

}

function buildLines(){

            /*
                color: 0xf3f3f3, opacity: 0.7, transparent: true
                color: 0x5794B3, opacity: 0.3, transparent: true
            */

            var lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xf3f3f3
            });

            var total = 24;

            for(var i = 0; i<30; i++){
               var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(-30, 0, 0));
                geometry.vertices.push(new THREE.Vector3(30, 0, 0));
                var line = new THREE.Line(geometry, lineMaterial);
                line.position.y = (-30/2)+i*1;
                line.position.z = -2+Math.round(Math.random()*4)-5;
                linesObj.add(line);
            }


            for(var i = 0; i<100; i++){
               var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0, 20, 0));
                geometry.vertices.push(new THREE.Vector3(0, -20, 0));
                var line = new THREE.Line(geometry, lineMaterial);
                line.position.x = (-100/2)+i*1;
                line.position.z = -2+Math.round(Math.random()*4)-5;
                linesObj.add(line);
            }

            var lineMaterial = new THREE.LineBasicMaterial({
                color: 0x5794B3, opacity: 0.3, transparent: true
            });

            for(var i = 0; i<6; i++){
               var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(-30, 0, 0));
                geometry.vertices.push(new THREE.Vector3(30, 0, 0));
                var line = new THREE.Line(geometry, lineMaterial);
                line.position.y = (-6/2)+i*1;
                line.position.z = -2+Math.round(Math.random()*4)-5;
                linesObj.add(line);
            }


            for(var i = 0; i<10; i++){
               var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0, 20, 0));
                geometry.vertices.push(new THREE.Vector3(0, -20, 0));
                var line = new THREE.Line(geometry, lineMaterial);
                line.position.x = (-10/2)+i*1;
                line.position.z = -2+Math.round(Math.random()*4)-5;
                linesObj.add(line);
            }


            scene.add(linesObj);
}

        function animate() {
          requestAnimationFrame( animate );

            if(animateCube){
                    counter ++;

                    TARGET.position.x += ((MODIFY.position.x - TARGET.position.x )*0.12);// + OFFSET.x;
                    TARGET.position.y += ((MODIFY.position.y - TARGET.position.y )*0.12);// + OFFSET.y;
                    TARGET.position.z += ((MODIFY.position.z - TARGET.position.z )*0.12);// + OFFSET.z;

                    cube.rotation.y += 0.005;
                    cube.rotation.x =  Math.sin(counter*0.02)*0.25;

                    MODIFY.position.x = mouse.x;
                    MODIFY.position.y = mouse.y;
            }

          camera.lookAt(TARGET.position);

          render();

          // controls.update();
          TWEEN.update();

        }

        function tweenCameraToObject(params){

            var selectedObject = params.obj;

            var tween = new TWEEN.Tween(camera.position).to({
                x: selectedObject.position.x,
                y: selectedObject.position.y,
                z: selectedObject.position.z + 1.95 
            },2000).easing(EASE).onUpdate(function () {
               // camera.lookAt(TARGET.position);
             //   camera.lookAt(camera.target);
             //   camera.lookAt(selectedObject.position);
            }).onComplete(function () {
               // camera.lookAt(TARGET.position);
             //   camera.lookAt(selectedObject.position);
            }).start();

            var viewDest = {}
            viewDest.x = selectedObject.position.x;
            viewDest.y = selectedObject.position.y;
            viewDest.z = selectedObject.position.z;

            console.log(viewDest);

            MODIFY.position.z = -100*0.75;

 //           tweenCamObject({obj:TARGET,destination:viewDest,speed:2000});

        }

        function tweenCamObject(params){

            var tween = new TWEEN.Tween(TARGET.position).to({
                x: params.destination.x,
                y: params.destination.y,
                z:  params.destination.z -10
            },2000).easing(EASE).onUpdate(function () {
               // camera.lookAt(TARGET.position);
            }).onComplete(function () {
               // camera.lookAt(TARGET.position);
            //    camera.lookAt(selectedObject.position);
            }).start();

        }
        function tweenCameraZoom(){

            var tween = new TWEEN.Tween(camera.position).to({
                x: camera.position.x,
                y: camera.position.y,
                z:  -1.25
            },2000).easing(EASE).onUpdate(function () {
               // camera.lookAt(TARGET.position);
            }).onComplete(function () {
            //    camera.lookAt(selectedObject.position);
            }).start();

 //           MODIFY.position.z = 0;
 //           MODIFY.position.z = 2

        }

        function tweenCameraSide(){

            var tween = new TWEEN.Tween(camera.position).to({
                x: camPos[2].x,
                y: camPos[2].y,
                z: camPos[2].z,
            },2000).easing(EASE).onUpdate(function () {
               // camera.lookAt(TARGET.position);
            }).onComplete(function () {
            //    camera.lookAt(selectedObject.position);
            }).start();

 //           MODIFY.position.z = 0;
            MODIFY.position.z = 2

        }

        function tweenCameraHome(){

            selected = true;
            hideSidebar();

            var tween = new TWEEN.Tween(camera.position).to({
                x: 0,
                y: 0,
                z: 7,
            },2000).easing(EASE).onUpdate(function () {
               // camera.lookAt(TARGET.position);
            }).onComplete(function () {
            //    camera.lookAt(selectedObject.position);
            }).start();

            var viewDest = {}
            viewDest.x = 0;
            viewDest.y = 0;
            viewDest.z = 0;

            MODIFY.position.z = 0;

        }


        function render() {
          renderer.render( scene, camera );
        }


        function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }

function buildBlocks(){

    for(var i = 0; i<totalObjects; i++){

	    var blockM = new THREE.MeshBasicMaterial( { color: 0x333333,opacity:0.3,transparent:true} );
        var blockG = new THREE.BoxGeometry(2,1,5);
        blockM.side = THREE.DoubleSide;
        var block = new THREE.Mesh(blockG,blockM);
        var xpos = (Math.round(Math.random()*2-1)*4);
        block.position.x = coords[i].x;
        block.position.y = coords[i].y;
        block.position.z = coords[i].z;

        block.scale.z = 0.1;

        // Build houses

        for(var j = 0; j< 5; j++){
	    var blockM = new THREE.MeshBasicMaterial( { color: 0x888888,opacity:0.15,transparent:true} );
            var house = new THREE.Mesh(blockG,blockM);
            house.position.x = Math.random()*18-9;
            house.position.y = Math.random()*10-5;
            house.position.z = -2;
            house.scale.x = 0.4;
            house.scale.y = 0.7;
            house.scale.z = 0.4;
            block.add(house);
        }

        var egh2 = new THREE.EdgesHelper( block, 0xFFFFFF);
        egh2.material.linewidth = 2;
        scene.add( egh2 ); 

	    var cardM = new THREE.MeshBasicMaterial( { color: 0xFFFFFF} );
        cardM.side = THREE.DoubleSide;
 //       var	cardG = new THREE.BoxGeometry(2,1, 0.125);
        var cardG = new THREE.PlaneGeometry(2,1);
        var card = new THREE.Mesh(cardG,cardM);

        card.add(createText(structure.pages[i].toUpperCase()));
        card.position.z = 2.52;

        block.name = structure.pages[i].toUpperCase();
        block.add(card);

        cardsObj.add(block);
        objects.push(block);

        extrudeObject({obj:block,destination:{x:1,y:1,z:1},speed:4000,delay:i*100+1000});

    };

    scene.add(cardsObj);

}

