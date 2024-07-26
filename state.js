const section = document.querySelector('section')

const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

const activeCanvas = document.getElementById('active-canvas')
const activeCtx = activeCanvas.getContext('2d')

const coolTimeCanvas = document.getElementById('cool-time-canvas')
const coolCtx = coolTimeCanvas.getContext('2d')

const audio = document.querySelector('audio')
const musicBtn = document.querySelector('.controller .music')

const info = document.querySelector('.info')

const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

if (windowWidth < windowHeight) {
    canvas.width = windowWidth
    canvas.height = windowWidth
    activeCanvas.width = windowWidth
    activeCanvas.height = windowWidth
} else {
    canvas.width = windowHeight
    canvas.height = windowHeight
    activeCanvas.width = windowHeight
    activeCanvas.height = windowHeight
}

let tower = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 15,
    range: 150,
    color: '#fff',
    sides: 3,
    rotationSpeed: 0.01,
    angle: 0,
    currentHp : 0,
    hp: 100,
    hpRegen: 1,
    currentMp : 0,
    mp: 100,
    mpRegen: 1,

    inventories : [],
    weapons: [],

    whiteMissiles : [],
    isWPA : true, // white-possible-attack
    WDA : 0.5, // white-double-attack

    blueMissiles: [],
    isBPA : true, // blue-possible-attack
    BDA : 0.2, // blue-double-attack
    frizingTime : 2000,

    redMissile: null,
    isRPA : true,
    redDoubleAttack : 0,
    burningTime: 3000,
    burnDamage : 20,

    greenMissile: null,
    isGPA : true,
    greenDoubleAttack : 0,
    poisoningTime : 3000,
    poisonDamage : 10,

    isChaining: true,
}

let WM = { //white missile
    color: 'white',
    damage: 5, // 데미지
    speed: 2, // 투사체 속도
    radius : 5,
    attackCoolTime : 0,
    attackDelay : 1000,
    doubleAttack : 0.00 // 2번 공격할 확률
}

let BM = { // blue missile
    color : 'blue',
    damage : 5,
    speed: 2,
    radius : 16,
    attackCoolTime : 0,
    attackDelay : 2000,
    doubleAttack : 0.00
}

let RM = { // red missile
    color: 'red',
    damage : 10,
    speed: 5,
    radius : 5,
    attackCoolTime : 0,
    attackDelay : 3000,
    doubleAttack : 0.00
}

let GM = { // green missile
    color: 'yellowgreen',
    damage : 2,
    speed: 2,
    radius : 5,
    attackCoolTime : 0,
    attackDelay : 2000,
    doubleAttack : 0.00
}

let chainCharging = 3000
let useChaining = 0

let enemies = []
let spawnInterval = 2000
let lastSpawnTime = Date.now()

let activeSkill = {
    thunder : false
}

let isActive = false
let activeThunder = null
let thunderPoint = null
let thunderTimer = null


