var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', function()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
} );

controls = new THREE.OrbitControls( camera, renderer.domElement );

var light = new THREE.AmbientLight( 0xd3d3d3 );
scene.add( light );

//obj
var objLoader = new THREE.OBJLoader();
objLoader.setPath('model/');
objLoader.load('model.obj', 
    function(object)
    {
        // object.position.y -= 60;
        scene.add(object);
    }
);

camera.position.z = 5;

var update = function()
{

};
var render = function()
{
    renderer.render( scene, camera);
};
var GameLoop = function()
{
    requestAnimationFrame(GameLoop);

    update();
    render();

}

GameLoop();