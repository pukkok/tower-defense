const moreBtnImg = `<img src="./public/more.png" alt="">`

function togglePause() {
    pause = !pause;
    if (!pause) {
        gameLoop() // 일시정지 해제 시 게임 루프 재개
        enemies.forEach((enemy) => {
            if (enemy.inCollision) {
                enemy.damageInterval = setInterval(() => {
                    tower.currentHp -= enemy.damage
                    endCase()
                }, 1000)
            }
        })
        playBtn.classList.add('on')
        playBtn.classList.remove('off')
        
    } else {
        enemies.forEach((enemy) => {
            clearInterval(enemy.damageInterval);
        })
        playBtn.classList.remove('on')
        playBtn.classList.add('off')
    }
    btnsDisabled()
}

function btnsDisabled () {
    const allInfoBtn = info.querySelectorAll('.card:not(.inventory) button')
    // 퍼즈상태일때 버튼 사용 불가
    allInfoBtn.forEach(btn => {
        pause ? btn.disabled = true : btn.disabled = false
    })
}

// 타워 상태 관리 (타워)
function towerStatusChangeHandler () {
    info.innerHTML = ''
    info.append(
        buildTowerCard(), buildInventoryCard()
    )
}

// 무기 상태 관리 (무기)
function weaponStatusChangeHandler () { 
    info.innerHTML = ''
    info.append(
        buildMissileCard(WM), buildMissileCard(BM), 
        buildMissileCard(RM), buildMissileCard(GM)
    )
}

// 특수 무기 상태 관리 (특수)
function specialWeaponStatusChangeHandler () {
    info.innerHTML = ''
    info.append(buildSpecialWeaponCard('laser'))
}

function skillStatusChangeHandler () {
    info.innerHTML = ''
    info.append(buildSkillCard('thunder'))
}

// 탭 버튼
const tabBtns = document.querySelectorAll('.tab-box button')
tabBtns.forEach(btn=> {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        tabBtns.forEach(btn => {
            if(btn.classList.contains('selected')){
                btn.classList.remove('selected')
            }
        })
        btn.classList.add('selected')

        if(btn.dataset.tab === 'tower') towerStatusChangeHandler()
        if(btn.dataset.tab === 'weapon') weaponStatusChangeHandler()
        if(btn.dataset.tab === 'special-weapon') specialWeaponStatusChangeHandler()
        if(btn.dataset.tab === 'skill') skillStatusChangeHandler()
        pause && btnsDisabled()
    })
})

function mappingData (text, value, div) { // 카드 데이터 생성
    const p = document.createElement('p')
    const span = document.createElement('span')
    span.innerText = value
    const btn = document.createElement('button')
    btn.innerHTML = moreBtnImg
    p.append(text, span, btn)
    div.append(p)
    return btn
}

// 타워 정보 카드
function buildTowerCard () {
    const div = document.createElement('div')
    div.className = 'card'
    const title = document.createElement('h3')
    title.innerText = '타워 정보'
    div.append(title)

    // 장착 슬롯
    const slotBtn = mappingData('장착 슬롯', tower.sides, div)
    slotBtn.innerHTML = moreBtnImg
    slotBtn.addEventListener('click', () => {
            tower.sides += 1
            repositionBalls()
            towerStatusChangeHandler()
    })
    if(tower.sides === 8){
        slotBtn.disabled = true
    }

    // 사거리
    const rangeBtn = mappingData('사거리', tower.range, div)
    rangeBtn.addEventListener('click', () => {
        tower.range += 10
        towerStatusChangeHandler()
    })
    
    // 체력
    const hpBtn = mappingData('체력', tower.hp, div)
    hpBtn.addEventListener('click', () => {
        tower.hp += 10
        towerStatusChangeHandler()
    })
    
    // 체력 리젠
    const hpRegenBtn = mappingData('체력 재생', tower.hpRegen, div)
    hpRegenBtn.addEventListener('click', () => {
        tower.hpRegen += 1
        towerStatusChangeHandler()
    })
    
    const mpBtn = mappingData('마나', tower.mp, div)
    mpBtn.addEventListener('click', () => {
        tower.mp += 10
        towerStatusChangeHandler()
    })
    
    const mpRegenBtn = mappingData('마나 리젠', tower.mpRegen, div)
    mpRegenBtn.addEventListener('click', () => {
        tower.mpRegen += 1
        towerStatusChangeHandler()
    })

    return div
}

// 인벤토리 정보
function buildInventoryCard () {
    const div = document.createElement('div')
    div.className = 'card inventory'
    const title = document.createElement('h3')
    title.innerText = '인벤토리'
    div.append(title)
    
    
    items.forEach((item)=>{
        const { color, type, piece, isGet } = item
        const btn = document.createElement('button')
        btn.innerText = piece
        btn.addEventListener('click', () => {
            equippedItem(color, type)
        })
        // btn.disabled = !isGet
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
    div.append(ballInfo)

    // 데미지
    const damageBtn = mappingData('데미지', missile.damage, div)
    damageBtn.addEventListener('click', () => {
        missile.damage = missile.damage + 1
        weaponStatusChangeHandler()
    })
    
    // 투사체 속도
    const speedBtn = mappingData('투사체 속도', missile.speed, div)
    speedBtn.addEventListener('click', () => {
        missile.speed += 1
        weaponStatusChangeHandler()
    })
    if(missile.speed === 10){
        speedBtn.disabled = true
    }

    // 공격 딜레이
    const cooltimeBtn = mappingData('공격 쿨타임', missile.attackDelay, div)
    cooltimeBtn.addEventListener('click', () => {
        missile.attackDelay -= 100
        weaponStatusChangeHandler()
    })
    if(missile.attackDelay === 200){
        cooltimeBtn.disabled = true
    }

    // 더블 어택
    const doubleAttackBtn = mappingData('더블어택 확률', (missile.doubleAttack).toFixed(2), div)
    doubleAttackBtn.addEventListener('click', () => {
        missile.doubleAttack += 0.01
        weaponStatusChangeHandler()
    })
    if(missile.doubleAttack === 1){
        doubleAttackBtn.disabled = true
    }

    return div
}

// 레이저 타워 특수
function buildSpecialWeaponCard (item) {
    let info = ''
    if(item === 'laser') info = '레이저(🟡)'
    const div = document.createElement('div')
    div.className = 'card'
    const specialInfo = document.createElement('h3')
    specialInfo.innerText = info
    div.append(specialInfo)
    // 체인 개수
    const chainCountBtn = mappingData('체인 개수', chain.number, div)
    chainCountBtn.addEventListener('click', () => {
        chain.number += 1
        specialWeaponStatusChangeHandler()
    })
    if(chain.number === 4){
        chainCountBtn.disabled = true
    }
    // 공격력
    const damageBtn = mappingData('데미지', chain.damage, div)
    damageBtn.addEventListener('click', () => {
        chain.damage += 1
        specialWeaponStatusChangeHandler()
    })
    if(chain.damage === 50){
        damageBtn.disabled = true
    }
    // 마나소모량
    const manaPerSecBtn = mappingData('초당 MP 소모량', chain.useMana.toFixed(1), div)
    manaPerSecBtn.addEventListener('click', () => {
        chain.useMana -= 0.1
        specialWeaponStatusChangeHandler()
    })
    if(chain.useMana === 1){
        manaPerSecBtn.disabled = true
    }

    return div
}

// 스킬 카드
function buildSkillCard (item) {
    let info = ''
    if(item === 'thunder') info = '번개'
    const div = document.createElement('div')
    div.className = 'card'
    const skillInfo = document.createElement('h3')
    skillInfo.innerText = info
    div.append(skillInfo)
    // 지속 시간
    const chainCountBtn = mappingData('지속 시간', thunderDuration / 1000 + '초', div)
    chainCountBtn.addEventListener('click', () => {
        thunderDuration += 100
        skillStatusChangeHandler()
    })
    if(thunderDuration === 5000){
        chainCountBtn.disabled = true
    }
    // 공격력
    const damageBtn = mappingData('데미지', thunderDamage, div)
    damageBtn.addEventListener('click', () => {
        thunderDamage += 1
        skillStatusChangeHandler()
    })
    if(thunderDamage === 50){
        damageBtn.disabled = true
    }
    // 공격범위
    const rangeBtn = mappingData('공격 범위', thunderRadius, div)
    rangeBtn.addEventListener('click', () => {
        thunderRadius += 1
        skillStatusChangeHandler()
    })
    if(thunderRadius === 80){
        rangeBtn.disabled = true
    }
    // 마나소모량
    const manaPerSecBtn = mappingData('마나 소모량', useThunderMana.toFixed(1), div)
    manaPerSecBtn.addEventListener('click', () => {
        useThunderMana -= 0.1
        skillStatusChangeHandler()
    })
    if(useThunderMana === 15){
        manaPerSecBtn.disabled = true
    }

    return div
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
    // 장착한 무기인지 확인
    const colorCheckers = tower.weapons.filter(weapon => weapon.type === 'normal' && weapon.color === color)
    if(colorCheckers.length > 0){
        tower.weapons = tower.weapons
            .filter(weapon => weapon.type === 'normal' &&  weapon.color !== color)
            .map((weapon, idx) => {
                const angleStep = (2 * Math.PI) / tower.sides
                const angle = angleStep * (idx % tower.sides)
                weapon = {...weapon, angle}
                return weapon
            })
        return
    }

    // 가득 찼는지 확인
    const fullCheckers = tower.weapons.filter(weapon => weapon.type === 'normal').length === tower.sides
    if(fullCheckers && type === 'normal'){
        return console.log('가득 참')
    }

    const angleStep = (2 * Math.PI) / tower.sides
    const angle = angleStep * (tower.weapons.length % tower.sides)
    const newWeapon = {
        color: color,
        angle: angle,
        x: (tower.size * 2) * Math.cos(angle),
        y: (tower.size * 2) * Math.sin(angle),
        type
    }
    tower.weapons.push(newWeapon)
}

// 일시정지
playBtn.addEventListener('click', togglePause)
function gamePause() {
    if(playBtn.classList.contains('on')){
        pause = true
    }else{
        pause = false
        gameLoop()
    }
}

// 음악 켜기/끄기
musicBtn.addEventListener('click', musicPlay)

function musicPlay() {
    if(musicBtn.classList.contains('on')){
        musicBtn.classList.add('off')
        musicBtn.classList.remove('on')
        audio.pause()
    }else{
        musicBtn.classList.add('on')
        musicBtn.classList.remove('off')
        audio.play()
    }
}

// 단축키 이벤트 추가
window.addEventListener('keydown', (e) => {
    if(e.code === 'Escape'){
        togglePause()
    }
    if(e.code === 'KeyM'){
        musicPlay()
    }
    if(e.code === 'Digit1'){
        if(thunderTimer){
            return console.log('스킬 사용중')
        }
        if(tower.currentMp < useThunderMana){
            return console.log('마나 부족')
        }
        isActive = !isActive
        if(isActive){
            mousemoveHandler()
        }else{
            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height)
        }
    }
})

// 액티브 사용시
function mousemoveHandler (){
    if(isActive){
        activeCanvas.addEventListener('mousemove', (e) => {
            let blank = (window.innerWidth - section.offsetWidth ) / 2
            activeThunder = {x: e.pageX - blank, y: e.pageY, radius: thunderRadius}
            drawActive()
        })
    }
} 


// 게임 시작
startBtn.addEventListener('click', () => {
    gameOver = false
    gameLoop()
    starter.style.display = 'none'
    tower.currentHp = tower.hp
    tower.currentMp = tower.mp
    tabBtns.forEach(btn => {
        if(btn.classList.contains('selected')){
            btn.classList.remove('selected')
        }
    })
    tabBtns[0].classList.add('selected')
    towerStatusChangeHandler()
    audio.play()
})
// 게임 리셋
function resetGame () {
    starter.style.display = 'block'
    startBtn.innerText = '다시'

    tower = JSON.parse(JSON.stringify(defaultTower))
    tower.weapons = []
    items = [...defaultItems]
    activeItems = [...defaultActiveItems]
    WM = {...defaultWM}
    BM = {...defaultBM}
    RM = {...defaultRM}
    GM = {...defaultGM}
    chain = {...defaultChain}

    enemies = []
    spawnInterval = 3000
    lastSpawnTime = Date.now()

    createEnemies = 2
    stage = 1
    stageGage = 0
    fullGage = 30

    isActive = false
    thunderDamage = 20
    useThunderMana = 30
    thunderDuration = 1000
    thunderRadius = 40
    activeThunder = null
    thunderPoint = null
    thunderTimer = null
}