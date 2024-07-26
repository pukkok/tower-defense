const controller = document.querySelector('.controller')
const starter = controller.querySelector('.starter')
const moreBtnImg = `<img src="./public/more.png" alt="">`

starter.addEventListener('click', () => {
    gameLoop()
    starter.style.display = 'none'
    tower.currentHp = tower.hp
    tower.currentMp = tower.mp
    towerStatusChangeHandler()
    audio.play()
})

function towerStatusChangeHandler () {
    info.innerHTML = ''
    info.append(
        buildTowerCard(), buildInventoryCard()
    )
}

function weaponStatusChangeHandler () { // 무기 상태 관리
    info.innerHTML = ''
    info.append(
        buildMissileCard(WM), buildMissileCard(BM), 
        buildMissileCard(RM), buildMissileCard(GM)
    )
}

const tabBtns = document.querySelectorAll('.tab-box button')
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        if(btn.dataset.tab === 'weapon') weaponStatusChangeHandler()
        if(btn.dataset.tab === 'tower') towerStatusChangeHandler()
    })
})

// 타워 정보
function buildTowerCard () {
    const div = document.createElement('div')
    div.className = 'card'
    const title = document.createElement('h3')
    title.innerText = '타워 정보'

    // 장착 슬롯
    const slot = document.createElement('p')
    const slotSpan = document.createElement('span')
    slotSpan.innerText = tower.sides
    const slotBtn = document.createElement('button')
    slotBtn.innerHTML = moreBtnImg
    slotBtn.addEventListener('click', () => {
            tower.sides += 1
            repositionBalls()
            towerStatusChangeHandler()
    })
    if(tower.sides === 8){
        slotBtn.disabled = true
    }
    slot.append('슬롯 개수', slotSpan, slotBtn)

    // 사거리
    const range = document.createElement('p')
    const rangeSpan = document.createElement('span')
    rangeSpan.innerText = tower.range
    const rangeBtn = document.createElement('button')
    rangeBtn.innerHTML = moreBtnImg
    rangeBtn.addEventListener('click', () => {
        tower.range += 10
        towerStatusChangeHandler()
    })
    range.append('사거리', rangeSpan, rangeBtn)
    
    const hp = document.createElement('p')
    const hpSpan = document.createElement('span')
    hpSpan.innerText = tower.hp
    const hpBtn = document.createElement('button')
    hpBtn.innerHTML = moreBtnImg
    hpBtn.addEventListener('click', () => {
        tower.hp += 10
        towerStatusChangeHandler()
    })
    hp.append('체력', hpSpan, hpBtn)
    
    const hpRegen = document.createElement('p')
    const hpRegenSpan = document.createElement('span')
    hpRegenSpan.innerText = tower.hpRegen
    const hpRegenBtn = document.createElement('button')
    hpRegenBtn.innerHTML = moreBtnImg
    hpRegenBtn.addEventListener('click', () => {
        tower.hpRegen += 10
        towerStatusChangeHandler()
    })
    hpRegen.append('체력 재생', hpRegenSpan, hpRegenBtn)
    
    const mp = document.createElement('p')
    const mpSpan = document.createElement('span')
    mpSpan.innerText = tower.mp
    const mpBtn = document.createElement('button')
    mpBtn.innerHTML = moreBtnImg
    mpBtn.addEventListener('click', () => {
        tower.mp += 10
        towerStatusChangeHandler()
    })
    mp.append('마나', mpSpan, mpBtn)
    
    const mpRegen = document.createElement('p')
    const mpRegenSpan = document.createElement('span')
    mpRegenSpan.innerText = tower.mpRegen
    const mpRegenBtn = document.createElement('button')
    mpRegenBtn.innerHTML = moreBtnImg
    mpRegenBtn.addEventListener('click', () => {
        tower.mpRegen += 10
        towerStatusChangeHandler()
    })
    mpRegen.append('마나', mpRegenSpan, mpRegenBtn)

    div.append(title, slot, range, hp, hpRegen, mp, mpRegen)
    return div
}

// 인벤토리 정보
function buildInventoryCard () {
    const div = document.createElement('div')
    div.className = 'card'
    const title = document.createElement('h3')
    title.innerText = '인벤토리'
    div.append(title)
    const items = [
        {color : 'white', type : 'normal', piece : '⚪'},
        {color : 'blue', type : 'normal', piece: '🔵'},
        {color : 'yellowgreen', type : 'normal', piece: '🟢'},
        {color : 'red', type : 'normal', piece: '🔴'},
        {color : 'yellow', type : 'special', piece: '🟡'}
    ]
    const activeItems = [
        {color : 'yellow', type: 'active', piece : '⚡'}
    ]
    items.forEach((item)=>{
        const { color, type, piece } = item
        const btn = document.createElement('button')
        btn.innerText = piece
        btn.addEventListener('click', () => {
            equippedItem(color, type)
        })
        div.append(btn)
    })

    activeItems.forEach(item => { // 임시
        const {color, type, piece} = item
        const btn = document.createElement('button')
        btn.innerText = piece
        btn.addEventListener('click', () => {
            isActive = true
            mousemoveHandler()
        })
        div.append(btn)
    })
    return div
}

// 무기 정보
function buildMissileCard (missile) {
    let info = ''
    
    if (missile.color === 'white') info = '기본(⚪)' 
    if (missile.color === 'blue') info = '빙결(🔵)'
    if (missile.color === 'red') info = '불꽃(🔴)'
    if (missile.color === 'yellowgreen') info = '독성(🟢)'
    const div = document.createElement('div')
    div.className = `card ${missile.color}`
    const ballInfo = document.createElement('h3')
    ballInfo.innerText = `${info} 미사일`
    
    const damage = document.createElement('p')
    const damageSpan = document.createElement('span')
    damageSpan.innerText = missile.damage
    const damageBtn = document.createElement('button')
    damageBtn.innerHTML = moreBtnImg
    damageBtn.addEventListener('click', () => {
        missile.damage = missile.damage + 1
        weaponStatusChangeHandler()
    })
    damage.append('데미지', damageSpan, damageBtn)

    const speed = document.createElement('p')
    const speedSpan = document.createElement('span')
    speedSpan.innerText = missile.speed
    const speedBtn = document.createElement('button')
    speedBtn.innerHTML = moreBtnImg
    speedBtn.addEventListener('click', () => {
        missile.speed = missile.speed + 1
        weaponStatusChangeHandler()
    })
    if(missile.speed === 14){
        speedBtn.disabled = true
    }
    speed.append('투사체 속도', speedSpan, speedBtn)

    const cooltime = document.createElement('p')
    const cooltimeSpan = document.createElement('span')
    cooltimeSpan.innerText = missile.attackDelay
    const cooltimeBtn = document.createElement('button')
    cooltimeBtn.innerHTML = moreBtnImg
    cooltimeBtn.addEventListener('click', () => {
        missile.attackDelay = missile.attackDelay - 100
        weaponStatusChangeHandler()
    })
    if(missile.attackDelay === 200){
        cooltimeBtn.disabled = true
    }
    cooltime.append('공격 쿨타임', cooltimeSpan, cooltimeBtn)

    const doubleAttack = document.createElement('p')
    const doubleAttackSpan = document.createElement('span')
    doubleAttackSpan.innerText = (missile.doubleAttack).toFixed(2)
    const doubleAttackBtn = document.createElement('button')
    doubleAttackBtn.innerHTML = moreBtnImg
    doubleAttackBtn.addEventListener('click', () => {
        missile.doubleAttack = missile.doubleAttack + 0.01
        weaponStatusChangeHandler()
    })
    if(missile.doubleAttack === 1){
        doubleAttackBtn.disabled = true
    }
    doubleAttack.append('더블 어택 확률', doubleAttackSpan, doubleAttackBtn)
    div.append(ballInfo, damage, speed, cooltime, doubleAttack)
    return div
}

const btnBox = document.querySelector('.btn-box')


// 단축키 이벤트 추가
window.addEventListener('keydown', (e) => {
    if(e.code === 'Digit1'){
        isActive = true
        mousemoveHandler()
    }
})

function mousemoveHandler (){
    if(isActive){
        activeCanvas.addEventListener('mousemove', (e) => {
            let blank = (window.innerWidth - section.offsetWidth ) / 2
            activeThunder = {x: e.pageX - blank, y: e.pageY, radius: 40}
            drawActive()
        })
    }
} 

function repositionBalls() { // 볼의 위치 변경
    const angleStep = (2 * Math.PI) / tower.sides
    const radius = tower.size * 2

    tower.weapons.forEach((weapon, index) => {
        weapon.angle = angleStep * (index % tower.sides)
        weapon.x = radius * Math.cos(weapon.angle)
        weapon.y = radius * Math.sin(weapon.angle)
    })
}

function equippedItem(color, type) {
    if(type === 'normal' && tower.sides === tower.weapons.filter(weapon => weapon.type === 'normal').length) return console.log('가득 참')
    const angleStep = (2 * Math.PI) / tower.sides
    const angle = angleStep * (tower.weapons.length % tower.sides)
    const newBall = {
        color: color,
        angle: angle,
        x: (tower.size * 2) * Math.cos(angle),
        y: (tower.size * 2) * Math.sin(angle),
        type
    }
    
    // 같은 공이 있다면 장착 안됨.
    const includeBallCheckers = tower.weapons.filter(weapon => {
        return weapon.color === newBall.color
    })
    if(includeBallCheckers.length === 0){
        tower.weapons.push(newBall)
    }
}

musicBtn.addEventListener('click', () => {
    if(musicBtn.classList.contains('on')){
        musicBtn.classList.add('off')
        musicBtn.classList.remove('on')
        audio.pause()
    }else{
        musicBtn.classList.add('on')
        musicBtn.classList.remove('off')
        audio.play()
    }
})

