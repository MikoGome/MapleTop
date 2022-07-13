const commonPoses = [
  'standingOneHanded', 
  'alert',
  'sitting',
  'walkingOneHanded',
  'walkingOneHanded',
  'walkingOneHanded',
]

const commonEmotes = [
  'default',
  'smile',
  'troubled',
  'angry', 
  'bewildered', 
  'stunned'
]

const poses = [
  'standingOneHanded', 
  'alert',
  'sitting',
  'walkingOneHanded',
  'lyingDown', 
  'lyingDownStabbing', 
  'firingBow', 
  'firingCrossbow', 
  'firingBigBow',
  'stabbingOneHanded',
  'thrustingOneHanded',
  'stabbingTwoHanded',
  'thrustingTwoHanded',
  'throwingBackhanded',
  'throwingDownward',
  'throwingForehanded',
  'bashing',
  'smashing',
  'slashingBehind',
  'slashingFront',
  'slashingUpward',
  'spinningSlash'
];

const emotes = [
  'default', 
  'hit', 
  'smile', 
  'troubled', 
  'cry', 
  'angry', 
  'bewildered', 
  'stunned'
];

class Mapler {
  constructor(name, body) {
    this.name = name;
    this.body = body;
    this.right = Math.random() < 0.5 ? true : false;
    this.faceFrame = 0;
    this.poseFrame = 0;
    this.lifeRef = null;
    this.faceEmote = null;
    this.pose = null;
    this.content = {};
    this.intervalRef = null;
    fetchPose(this, this.body, 'default', 'jumping');
    for(const emote of ['hit', 'angry', 'pain']) {
      justFetch(this, this.body, emote, 'lyingDown');
    }
    makeAlive(this);
  }

  changePose(pose) {
    if(Array.isArray(pose)) pose = pose[Math.floor(Math.random() * pose.length)];
    const randPose = pose || poses[Math.floor(Math.random() * poses.length)];
    this.poseFrame = 0;
    fetchPose(this, this.body, this.faceEmote, randPose);
  }

  changeEmote(emote) {
    if(Array.isArray(emote)) emote = emote[Math.floor(Math.random() * emote.length)];
    const randEmote = emote || emotes[Math.floor(Math.random() * emotes.length)];
    this.faceFrame = 0;
    fetchPose(this, this.body, randEmote, this.pose);
  }

  changeBoth(emote, pose) {
    if(Array.isArray(pose)) pose = pose[Math.floor(Math.random() * pose.length)];
    if(Array.isArray(emote)) emote = emote[Math.floor(Math.random() * emote.length)];
    const randPose = pose || poses[Math.floor(Math.random() * poses.length)];
    const randEmote = emote || emotes[Math.floor(Math.random() * emotes.length)];
    this.poseFrame = 0;
    this.faceFrame = 0;

    fetchPose(this, this.body, randEmote, randPose);
  }

  walk() {
    this.changePose('walkingOneHanded')
  }

  delife() {
    clearTimeout(this.lifeRef);
    this.lifeRef = null;
  }

  animate(target) {
    let poseIncreasing = true;
    let poseFps = 2.5;
    let now = Date.now();
    let then = null;
    const animation = () => {
      console.log('test3');
      const poseArr = this.content[this.faceEmote][this.pose];
      const faceEmoteArr = this.content[this.faceEmote];
      if(this.pose === 'walkingOneHanded') {
        this.char.style.transitionDuration = '400ms';
        this.char.style.transitionTimingFunction = 'linear';
      } else {
        this.char.style.transitionDuration = null;
        this.char.style.transitionTimingFunction = null;
      }
      if(['standingOneHanded', 'alert', 'flying'].includes(this.pose)) {
        if(this.poseFrame + 1 >= poseArr.length) {
          poseIncreasing = false;
        } else if(this.poseFrame - 1 < 0) {
          poseIncreasing = true;
        }
    
        if(poseIncreasing) {
          this.poseFrame++;
        } else {
          this.poseFrame--;
        }
      } else {
        this.poseFrame++;
        this.poseFrame %= poseArr.length;
      }
      if(this.pose === 'walkingOneHanded') {
        const pos = parseInt(this.char.style.left);
        const speed = 30;
        const {x, width} = this.char.getBoundingClientRect();

        if(x < 0 && !this.right) {
          this.turn();
        } else if(x + width > innerWidth && this.right) {
          this.turn();
        }

        if(this.right) {
          this.char.style.left = pos + speed + 'px';
        } else {
          this.char.style.left = pos - speed + 'px';
        }
      }
      const currPose = poseArr[this.poseFrame];
      target.setAttribute('src', currPose);
    }


    this.intervalRef = setInterval(animation, 400);
  }

  turn() {
    if(this.right) {
      this.right = false;
      this.sprite.classList.remove('right');
    } else {
      this.right = true;
      this.sprite.classList.add('right');
    }
  }

  logOut() {
    this.delife();
    clearInterval(this.intervalRef);
    this.char.remove();
  }
}