// 타워 관리
function drawTower() {
    const angleStep = (2 * Math.PI) / tower.sides
    const radius = tower.size * 2 // 다각형의 반지름

    ctx.save()
    ctx.translate(tower.x, tower.y)
    ctx.rotate(tower.angle)

    // 타워 다각형 그리기
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    for (let i = 1; i < tower.sides; i++) {
        ctx.lineTo(radius * Math.cos(i * angleStep), radius * Math.sin(i * angleStep))
    }
    ctx.closePath()
    ctx.strokeStyle = tower.color
    ctx.lineWidth = 2
    ctx.stroke()
    
    tower.weapons.forEach(weapon => {
        if(weapon.color !== 'yellow'){
            const ballX = radius * Math.cos(weapon.angle)
            const ballY = radius * Math.sin(weapon.angle)
            ctx.beginPath()
            ctx.fillStyle = weapon.color
            ctx.arc(ballX, ballY, 10, 0, Math.PI * 2)
            ctx.fill()
        }else{
            ctx.beginPath()
            ctx.fillStyle = weapon.color
            ctx.arc(0, 0, 5, 0, Math.PI * 2)
            ctx.fill()
        }
    })
    ctx.restore()

    // 사거리
    ctx.beginPath()
    ctx.strokeStyle = tower.color
    ctx.lineWidth = 2
    ctx.arc(tower.x, tower.y, tower.range, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()
}

/*********************************************************************** */
// 적 관리

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.strokeStyle = enemy.color
        ctx.strokeRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size)
        
        // 체력 표시
        ctx.fillStyle = enemy.hpColor
        ctx.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2 - 10, enemy.size * (enemy.health / enemy.maxHealth), 5)
    })
}

function spawnEnemy() {
    let enemyX, enemyY

    const selectA = Math.random()
    const selectB = Math.random()

    const short = Math.random() * 10
    const long = Math.random() * canvas.width

    if (selectA < 0.5) {
        if (selectB < 0.5) {
            enemyX = short
            enemyY = long
        } else {
            enemyX = canvas.width - short
            enemyY = long
        }
    } else {
        if (selectB < 0.5) {
            enemyX = long
            enemyY = short
        } else {
            enemyX = long
            enemyY = canvas.width - short
        }
    }
    
    const newEnemy = {
        x: enemyX,
        y: enemyY,
        speed: 1 + Math.random() * 2,
        size: 20,
        damage: 1,
        color: 'violet',
        hpColor : 'red',
        health: 100,
        maxHealth: 100,
        isFrozen: false,
        frozenTime: 0,
        isBurn: false,
        burnTime: 0,
        isPoison: false,
        poisonTime: 0,
        isShock: false
    }

    enemies.push(newEnemy)
}

function updateEnemies() {
    enemies.forEach((enemy) => {
        // 상태 이상 효과에 따른 적의 색상 변경
        if (enemy.isShock) {
            enemy.color = 'yellow';
        } else {
            enemy.color = 'violet';
        }

        if (enemy.isFrozen) {
            let elapsedTime = Date.now() - enemy.frozenTime;
            if (elapsedTime < tower.frizingTime) {
                enemy.color = 'blue';
            } else {
                enemy.isFrozen = false;
                enemy.frozenTime = 0;
                enemy.color = 'violet';
            }
        }

        if (enemy.isBurn) {
            let elapsedTime = Date.now() - enemy.burnTime;
            if (elapsedTime < tower.burningTime) {
                enemy.color = 'red';
                if (elapsedTime % 1000 < 50) {
                    enemy.health -= tower.burnDamage;
                    killEnemy(enemy);
                }
            } else {
                enemy.isBurn = false;
                enemy.burnTime = 0;
                enemy.color = 'violet';
            }
        }

        if (enemy.isPoison) {
            let elapsedTime = Date.now() - enemy.poisonTime;
            if (elapsedTime < tower.poisoningTime) {
                enemy.hpColor = 'yellowgreen';
                if (elapsedTime % 1000 < 50) {
                    enemy.health -= tower.poisonDamage;
                    killEnemy(enemy);
                }
            } else {
                enemy.isPoison = false;
                enemy.poisonTime = 0;
                enemy.hpColor = 'red';
            }
        }

        // 적과 타워 간 거리 계산
        let dx = tower.x - enemy.x;
        let dy = tower.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // 적이 얼어붙지 않았고, 타워와 충돌 범위 밖에 있는 경우 이동
        if (!enemy.isFrozen && distance > tower.size * 2 + enemy.size / 2) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
            enemy.inCollision = false; // 충돌 상태 초기화
        } else {
            // 적이 타워와 충돌 범위 안에 있을 때
            if (!enemy.inCollision) {
                // 충돌 상태에 처음 진입하면 데미지 타이머 시작
                enemy.inCollision = true;
                tower.currentHp -= enemy.damage
                enemy.damageInterval = setInterval(() => {
                    tower.currentHp -= enemy.damage
                    if (tower.currentHp <= 0) {
                        tower.currentHp = 0
                        clearInterval(enemy.damageInterval)
                        cancelAnimationFrame(gameLoop)
                    }
                }, 1000);
            }
        }

        // 적이 죽거나 충돌 상태를 벗어났을 때 데미지 타이머 중지
        if (enemy.health <= 0 || !enemy.inCollision) {
            clearInterval(enemy.damageInterval)
            enemy.inCollision = false
        }
    })
}


// 실행
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawTower()
    drawEnemies()
    drawMissile()
    updateEnemies()
    handleCollisions()
    moveBallMissile()

    tower.angle += tower.rotationSpeed

    if (Date.now() - lastSpawnTime > spawnInterval) {
        let createdEnemies = 1
        Array(createdEnemies).fill(0).forEach(_ => {
            spawnEnemy()
        })
        lastSpawnTime = Date.now()
    }

    drawCoolTime()
    requestAnimationFrame(gameLoop)
}