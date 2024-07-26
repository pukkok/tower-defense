// 번개치기
function ActiveThunderCursor () {
    if(!activeThunder) return
    activeCtx.beginPath()
    activeCtx.strokeStyle = 'yellow'
    activeCtx.lineWidth = 2
    activeCtx.arc(activeThunder.x, activeThunder.y, activeThunder.radius, 0, Math.PI * 2)
    activeCtx.stroke()
}

function drawThunder () {
    activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height)
    let thunders = Array(4).fill(0)
    activeCtx.beginPath()
    activeCtx.strokeStyle = 'yellow'
    activeCtx.lineWidth = 2
    activeCtx.arc(thunderPoint.x, thunderPoint.y, thunderPoint.radius, 0, Math.PI * 2)
    activeCtx.stroke()
    
    const randomValue = () => {
        let sign = 1 // 부호
        if(Math.random() < .5) sign = -1

        return sign * Math.random () * thunderPoint.radius / 2
    }

    const textMetrics = activeCtx.measureText('⚡')
    activeCtx.font = '20px noto-sans'
    thunders.forEach(_ => {
        const textX = thunderPoint.x - randomValue() - textMetrics.width / 2
        const textY = thunderPoint.y - randomValue() + textMetrics.actualBoundingBoxAscent / 2
        activeCtx.fillText('⚡', textX , textY)
    })
}

function checkThunderDamage() {
    enemies.forEach(enemy => {
        const dx = enemy.x - thunderPoint.x
        const dy = enemy.y - thunderPoint.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < thunderPoint.radius) {
            enemy.health -= 20
            enemy.isShock = true
            killEnemy(enemy)
        } else {
            enemy.isShock = false
        }
    })
}

function drawActive() {
    if(!isActive) return
    activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height)
    ActiveThunderCursor()
}

activeCanvas.addEventListener('click', () => {
    if (!isActive) return
    if (activeThunder && !thunderTimer) {
        isActive = false
        thunderPoint = {...activeThunder}
        drawThunder()
        checkThunderDamage()
        thunderTimer = setInterval(() => {
            drawThunder()
            checkThunderDamage()
        }, 200) // Damage every second

        setTimeout(() => {
            clearInterval(thunderTimer)
            enemies.forEach(enemy => enemy.isShock = false)
            thunderTimer = null
            activeThunder = null
            
            activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height)
        }, 3000) // End after 3 seconds
    }
})