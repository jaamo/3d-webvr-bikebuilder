/**
 * Round wall displaying some posts.
 */
var SomeWall = new Function();

SomeWall.prototype.photos = [];

SomeWall.prototype.photoUrls = [
  "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-15/e35/12132794_873034149416897_250108284_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/e35/12070985_872548602798780_1872277037_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/12106116_156285378056520_1306113811_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/12081295_400402366822443_33975820_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11875533_1629755913964929_598998137_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xpa1/t51.2885-15/e35/10299845_1640630499544255_1906612771_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11849799_1501607900157858_1748086892_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xfp1/t51.2885-15/e35/10932541_1698658517030457_1692532502_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11934838_1143369622358758_910677731_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11910012_773377706104735_1230128410_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/e35/11925812_1499703676993504_920113922_n.jpg",
  "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/e35/11910447_1189631594397423_834910542_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/e35/11909930_642378569234621_1065505154_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11950491_176250022709362_1502438562_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11950491_176250022709362_1502438562_n.jpg",
  "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/e35/11820574_142022229476622_378643065_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11856621_564755940340145_1025873530_n.jpg",
  "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/e35/11364000_881349411954278_1881839794_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11371038_1645315705709508_1962714941_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11821753_1138070909594164_636181219_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/e35/11899565_709751739158300_1497238020_n.jpg",
  "https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/e35/11850132_889375141139808_1459830269_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11899723_1678515712367414_1503811903_n.jpg",
  "https://scontent-arn2-1.cdninstagram.com/hphotos-xaf1/t51.2885-15/e35/11850063_889537167768795_450001829_n.jpg"
];



SomeWall.prototype.init = function(scene, successCallback) {


	this.photos = [];
	var max = 15;
	var maxRows = 10;
	var rowSpacing = 25;
	var distance = 1000;
	var boxSize = 400;
	var rowOffset = maxRows * (boxSize + rowSpacing) / 2;
	for (var row = 0; row < maxRows; row++) {

		for (var i = 0; i < max; i++) {

			var progress = i / max;

			var geometry = new THREE.PlaneGeometry(boxSize, boxSize, 1);
			var material = new THREE.MeshPhongMaterial({
				color: 0xffff00 + (progress * 0x0000ff),
				side: THREE.DoubleSide
			});
			var plane = new THREE.Mesh(geometry, material);
			//plane.parent = cube;
			plane.position.x = distance * Math.sin(2 * Math.PI * progress);
			plane.position.z = distance * Math.cos(2 * Math.PI * progress);
			plane.position.y = row * (boxSize + rowSpacing) - rowOffset;
			plane.rotation.y = 2 * Math.PI * progress + Math.PI;

			scene.add(plane);
			this.photos.push(plane);

			// Instantiate a loader.
			var loader = new THREE.TextureLoader();
			loader.crossOrigin = "Anonymous";

			// Randomize url.
			var index = Math.floor(Math.random() * (this.photoUrls.length - 1));
			var url = this.photoUrls[index];

			// Load texture.
			(function(photo) {

				loader.load(
					url,
					function(texture) {
						var material = new THREE.MeshPhongMaterial({
							map: texture,
							side: THREE.DoubleSide
						});
						photo.material = material;
					},
					function(xhr) {
						console.log('Texture load failed.');
					}
				);

			})(plane);

		}

	}


}
