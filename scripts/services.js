            var coords =[{x:-2,y:-2,z:-2},{x:-3,y:0,z:-1},{x:-2,y:2,z:-2},
                         {x:2,y:-2,z:-2},{x:3,y:0,z:-1},{x:2,y:2,z:-2},
                         {x:0,y:0,z:-10},{x:0,y:0,z:-10},{x:0,y:0,z:-10}];

            var grid =[{x:-2,y:-1,z:1.5},{x:0,y:-1,z:1.5},{x:2,y:-1,z:1.5},
                       {x:-2,y:0.25,z:1.5},{x:0,y:0.25,z:1.5},{x:2,y:0.25,z:1.5},
                       {x:-2,y:1.5,z:1.5},{x:0,y:1.5,z:1.5},{x:2,y:1.5,z:1.5}];

var servicesStructure = [
    {name:"Environmental Law",url:"",children:[
        {name:"Environmental Litigation, Contribution, & Cost Recovery",url:"",children:[]},
        {name:"Environmental Regulatory Practice",url:"",children:[]},
        {name:"Environmental Transactions, & Risk Management",url:"",children:[]},
        {name:"Natural Resources",url:"",children:[]},
        {name:"Contaminated Sediments",url:"",children:[]}
    ]},
    {name:"Litigation",url:"",children:[
        {name:"Appellate Practice",url:"",children:[]},
        {name:"Commercial Litigation",url:"",children:[]},
        {name:"Environmental Litigation",url:"",children:[]},
        {name:"Healthcare, Medical, & Pharmaceutical Litigation",url:"",children:[]},
        {name:"Insurance",url:"",children:[]},
        {name:"Personal Injury and Premises Liability",url:"",children:[]},
        {name:"Products Liability",url:"",children:[]},
        {name:"Construction Law",url:"",children:[]}
    ]},
    {name:"Industrial Accidents, Catastrophic Releases, & Emergency Response",url:"",children:[]},
    {name:"Railroad Operations & Litigation",url:"",children:[]},
    {name:"Oil & Gas / Pipeline Practice",url:"",children:[]},
    {name:"Ports & Port-Related Business",url:"",children:[]},
    {name:"Partnering Opportunities",url:"",children:[]}
];

var servicesObj = new THREE.Group();
var servicesList = [];
var childrenList = [];
var childrenObj = new THREE.Group();

function buildServices(){

    var parentsLength= servicesStructure.length;

    console.log(parentsLength);

    for(var i = 0; i<parentsLength; i++){

	    var cardM = new THREE.MeshBasicMaterial( { color: 0xFFFFFF} );
        cardM.side = THREE.DoubleSide;
        var cardG= new THREE.PlaneGeometry(1 *0.5,0.57 *0.5);
        var card = new THREE.Mesh(cardG,cardM);
        card.position.x = -3;
        card.position.z = -8;
        card.name = servicesStructure[i].name.toUpperCase();
        card.add(createText( servicesStructure[i].name.toUpperCase(),"tiny"));

        servicesObj.add(card);
        servicesList.push(card); 

            if(servicesStructure[i].children.length>0){

var obj = {};
                obj[servicesStructure[i].name.toUpperCase()] = [];

                for(var j = 0; j<servicesStructure[i].children.length; j++){
                    var childName = (servicesStructure[i].children[j].name.toUpperCase());
                    var c = makeCard(childName);
                    childrenObj.add(c);
                    obj[servicesStructure[i].name.toUpperCase()].push(c);
                }
                childrenList.push(obj);
            }

    };

    servicesObj.position.x= 1;
    servicesObj.position.y= 2;
    servicesObj.position.z= -2;

    childrenObj.position.x= 1;
    childrenObj.position.y= 2;
    childrenObj.position.z= -2.5;

    scene.add(servicesObj);
    scene.add(childrenObj);

}

function makeCard(namer){

    var cardM = new THREE.MeshBasicMaterial( { color: 0xFFFFFF} );
    cardM.side = THREE.DoubleSide;
    var cardG= new THREE.PlaneGeometry(1 *0.5,0.57 *0.5);
    var card = new THREE.Mesh(cardG,cardM);
    card.position.x = -3;
    card.position.z = -8;
    card.name = namer.toUpperCase();
    card.add(createText( namer.toUpperCase(),"tiny"));

    return card;

}

function gridServices(){
    var _objects = servicesList;

    for(var i = _objects.length-1; i>=0;i--){
            var newgrid = {z:0.8, y: -grid[i].y * 0.25+(0.125/2 ),x:grid[i].x * 0.3 - 3};
            tweenObject({obj:_objects[i],destination:newgrid,delay:i*100});
    }
}


function gridChildren(theList){

    var _objects = theList;
    console.log(objects);

    for(var i = 0; i<=_objects.length;i++){
            var newgrid = {z:0.2, y: -grid[i].y * 0.25+(0.125/2 ),x:grid[i].x * 0.3 - 3};
            tweenObject({obj:_objects[i],destination:newgrid,delay:i*100});
    }

}

function loadSection(namer){
// This needs a rewrite to make it use the json strucvture

    if(namer == "ENVIRONMENTAL LAW"){
        tweenCameraZoom();
      setTimeout( function(){ gridChildren(childrenList[0][namer]) }, 2000);
    }

}

