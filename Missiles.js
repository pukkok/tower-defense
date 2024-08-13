// 미사일 관리
function drawMissile() {
    // ❄️🔥💣⚡💢

    tower.whiteMissiles.forEach(missile => {
        ctx.beginPath()
        ctx.fillStyle = missile.color
        ctx.arc(missile.x, missile.y, missile.radius, 0, 2 * Math.PI)
        ctx.fill()
    })
    
    tower.blueMissiles.forEach(missile => {
        ctx.beginPath()
        ctx.fillStyle = missile.color
        ctx.arc(missile.x, missile.y, missile.radius, 0, 2 * Math.PI)
        ctx.fill()
    })

    if (tower.redMissile) {
        ctx.font = '20px noto-sans'
        const textMetrics = ctx.measureText('🔥')
        const textX = tower.redMissile.x - textMetrics.width / 2
        const textY = tower.redMissile.y + textMetrics.actualBoundingBoxAscent / 2
        ctx.fillText('🔥', textX, textY)
    }

    if (tower.greenMissile) {
        ctx.beginPath()
        ctx.fillStyle = tower.greenMissile.color
        ctx.arc(tower.greenMissile.x, tower.greenMissile.y, 5, 0, 2 * Math.PI)
        ctx.fill()
    }
}

// 어택 쿨타임 돌리기
function handleCollisions() {
    tower.weapons.forEach(weapon => {

        let firstTarget = null
        let minDistance = tower.range
        let fastestEnemy = null
        let maxSpeed = 0
        let mosthealthEnemy = null
        let maxRemainHp = 0

        enemies.forEach(enemy => {
            let dx = enemy.x - tower.x
            let dy = enemy.y - tower.y
            let distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < minDistance) { 
                minDistance = distance
                firstTarget = enemy

                // 가장 빠른 적 찾기
                if (weapon.color === 'blue' && enemy.speed > maxSpeed) {
                    maxSpeed = enemy.speed
                    fastestEnemy = enemy
                }

                // 체력이 가장 많이 남은 적 찾기
                if (weapon.color === 'yellowgreen' && enemy.health > maxRemainHp){
                    maxRemainHp = enemy.health
                    mosthealthEnemy = enemy
                }
            }       
        })

        const missile = {
            x : tower.x,
            y : tower.y,
            color : weapon.color
        }

        if (weapon.color === 'white' && tower.isWPA) {
            if (firstTarget) {
                tower.whiteMissiles.push({
                    ...WM,
                    ...missile,
                    target: firstTarget,
                })
                
                if (Math.random() <= WM.doubleAttack) { // 더블어택 확률
                    setTimeout(() => {
                        tower.whiteMissiles.push({
                            ...WM,
                            ...missile,
                            target: firstTarget,
                        })
                    }, 100)
                }
                WM.attackCoolTime = Date.now()
                tower.isWPA = false
            }
        }

        if (weapon.color === 'blue' && tower.isBPA) {
            if (fastestEnemy) {
                tower.blueMissiles.push({
                    ...BM,
                    ...missile,
                    target: firstTarget,
                })
                
                if (Math.random() <= BM.doubleAttack) { // 연사
                    setTimeout(() => {
                        tower.blueMissiles.push({
                            ...BM,
                            ...missile,
                            target: firstTarget,
                        })
                    }, 100)
                }
                BM.attackCoolTime = Date.now()
                tower.isBPA = false
            }
        }

        if (weapon.color === 'red' && !tower.redMissile && tower.isRPA) {
            if (firstTarget) {
                tower.redMissile = {
                    ...RM,
                    ...missile,
                    target: firstTarget,
                }
                RM.attackCoolTime = Date.now()
                tower.isRPA = false
            }
        }

        if (weapon.color === 'yellowgreen' && !tower.greenMissile && tower.isGPA) {
            if (mosthealthEnemy) {
                tower.greenMissile = {
                    ...GM,
                    ...missile,
                    target: mosthealthEnemy,
                }
                GM.attackCoolTime = Date.now()
                tower.isGPA = false
            }
        }

        if (weapon.color === 'yellow') { // 체인
            if (firstTarget && tower.currentMp > 0) {
                chainAttack(firstTarget, chains, weapon, tower.x, tower.y)    
            }
        }
    })
}

function killEnemy (enemy) {
    if (enemy.health <= 0 && !enemy.isDead) {
        enemy.isDead = true
        enemies.splice(enemies.indexOf(enemy), 1)
    }
}

function moveBallMissile() {

    function moveMissile(missile){
        let dx = missile.target.x - missile.x
        let dy = missile.target.y - missile.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        
        // 미사일 이동
        missile.x += (dx / distance) * missile.speed
        missile.y += (dy / distance) * missile.speed

        return distance // next
    }

    tower.whiteMissiles.forEach((whiteMissile, index) => {
        let distance = moveMissile(whiteMissile)

        // 충돌 체크
        if (distance < 5) {
            whiteMissile.target.health -= whiteMissile.damage
            killEnemy(whiteMissile.target)
            tower.whiteMissiles.splice(index, 1)
        }
    })

    tower.blueMissiles.forEach((blueMissile, index) => {
        let distance = moveMissile(blueMissile)

        if (distance < 5) { // 충돌시
            blueMissile.target.health -= blueMissile.damage
            blueMissile.target.frozenTime = Date.now()
            blueMissile.target.isFrozen = true
            killEnemy(blueMissile.target)
            tower.blueMissiles.splice(index, 1)

            // if (Math.random() < 0.5) {
            //     const angleOffset = Math.PI / 4 // 45도
            //     const missile1 = { ...blueMissile, x: blueMissile.x + Math.random() * 20, y: blueMissile.y + 20, angle: blueMissile.angle + angleOffset, radius: blueMissile.radius / 2 }
            //     const missile2 = { ...blueMissile, x: blueMissile.x + 20, angle: blueMissile.angle - angleOffset, radius: blueMissile.radius / 2 }
            //     tower.blueMissiles.push(missile1)
            //     tower.blueMissiles.push(missile2)
            // }
        }
    })

    if (tower.redMissile) {
        let redMissile = tower.redMissile
        let distance = moveMissile(redMissile)

        if (distance < 5) {
            redMissile.target.health -= redMissile.damage
            redMissile.target.burnTime = Date.now()
            redMissile.target.isBurn = true
            killEnemy(redMissile.target)
            tower.redMissile = null
        }
    }

    if (tower.greenMissile) {
        let greenMissile = tower.greenMissile
        let distance = moveMissile(greenMissile)

        if (distance < 5) {
            greenMissile.target.health -= greenMissile.damage
            greenMissile.target.poisonTime = Date.now()
            greenMissile.target.isPoison = true
            killEnemy(greenMissile.target)
            tower.greenMissile = null
        }
    }
}

function chainAttack(enemy, remainingChains, weapon, startX, startY) {
    if (remainingChains <= 0) return
    tower.currentMp -= chainUseMana / 60

    enemy.health -= remainingChains * chainDamage
    killEnemy(enemy)

    ctx.beginPath()
    ctx.strokeStyle = weapon.color
    ctx.lineWidth = 4
    ctx.moveTo(startX, startY)
    ctx.lineTo(enemy.x, enemy.y)
    ctx.stroke()

    let nearestEnemy = null
    let nearestDistance = remainingChains === 3 ? 100 : 50

    enemies.forEach(otherEnemy => {
        if (otherEnemy !== enemy) {
            let dx = otherEnemy.x - enemy.x
            let dy = otherEnemy.y - enemy.y
            let distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < nearestDistance) {
                nearestDistance = distance
                nearestEnemy = otherEnemy
            }
        }
    })

    if (nearestEnemy) {
        chainAttack(nearestEnemy, remainingChains - 1, weapon, enemy.x, enemy.y)
    }
}