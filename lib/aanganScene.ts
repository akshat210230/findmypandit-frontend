// lib/aanganScene.ts — Aangan night scene canvas renderer

interface DiayaFlicker {
  phase: number
  speed: number
}

const STAR_DATA: [number, number, number][] = [
  [0.12,0.07,1.5],[0.28,0.04,2.0],[0.45,0.11,1.2],[0.62,0.05,1.8],
  [0.78,0.08,1.5],[0.88,0.13,1.2],[0.18,0.21,1.0],[0.35,0.17,1.4],
  [0.55,0.24,1.1],[0.72,0.19,1.3],[0.92,0.15,1.0],[0.08,0.29,0.9],
  [0.48,0.27,1.0],[0.83,0.31,0.8],[0.03,0.15,1.2],[0.95,0.22,1.0],
  [0.25,0.35,0.8],[0.65,0.32,0.9],[0.82,0.08,1.6],[0.52,0.06,1.3],
  [0.38,0.28,0.7],[0.72,0.33,0.8],[0.14,0.38,0.7],[0.91,0.38,0.9],
]

function initFlickers(count: number): DiayaFlicker[] {
  const arr: DiayaFlicker[] = []
  for (let i = 0; i < count; i++) {
    arr.push({ phase: Math.random() * Math.PI * 2, speed: 0.04 + Math.random() * 0.05 })
  }
  return arr
}

function drawDiya(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  brightness: number,
  flicker: DiayaFlicker,
  time: number,
): void {
  const flickerVal = 0.88 + 0.12 * Math.sin(time * flicker.speed * 60 + flicker.phase)

  // a. Outer ambient glow
  const gOuter = ctx.createRadialGradient(x, y, 0, x, y, size * 8)
  gOuter.addColorStop(0, `rgba(255,160,20,${brightness * 0.22 * flickerVal})`)
  gOuter.addColorStop(1, 'rgba(255,160,20,0)')
  ctx.fillStyle = gOuter
  ctx.beginPath()
  ctx.arc(x, y, size * 8, 0, Math.PI * 2)
  ctx.fill()

  // b. Inner flame glow
  const gInner = ctx.createRadialGradient(x, y - size * 0.5, 0, x, y - size * 0.5, size * 2.5)
  gInner.addColorStop(0, `rgba(255,220,80,${brightness * 0.85 * flickerVal})`)
  gInner.addColorStop(1, 'rgba(255,220,80,0)')
  ctx.fillStyle = gInner
  ctx.beginPath()
  ctx.arc(x, y - size * 0.5, size * 2.5, 0, Math.PI * 2)
  ctx.fill()

  // c. Clay bowl
  const gBowl = ctx.createLinearGradient(x, y - size * 0.5, x, y + size * 0.5)
  gBowl.addColorStop(0, 'rgba(200,120,40,1)')
  gBowl.addColorStop(1, 'rgba(100,45,10,1)')
  ctx.fillStyle = gBowl
  ctx.beginPath()
  ctx.ellipse(x, y, size * 1.1, size * 0.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // d. Rim highlight
  ctx.strokeStyle = `rgba(255,200,100,${brightness * 0.5})`
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.ellipse(x, y - size * 0.1, size * 1.0, size * 0.4, 0, Math.PI, 0)
  ctx.stroke()

  // e. Oil pool
  const gOil = ctx.createRadialGradient(x, y, 0, x, y, size * 0.7)
  gOil.addColorStop(0, `rgba(255,220,80,${brightness * 0.6})`)
  gOil.addColorStop(1, 'rgba(255,220,80,0)')
  ctx.fillStyle = gOil
  ctx.beginPath()
  ctx.ellipse(x, y, size * 0.7, size * 0.3, 0, 0, Math.PI * 2)
  ctx.fill()

  // f. Flame
  const fh = size * 1.6 * flickerVal
  const skew = Math.sin(time * flicker.speed * 40 + flicker.phase + 1) * size * 0.15
  const gFlame = ctx.createLinearGradient(x, y - fh, x, y)
  gFlame.addColorStop(0, 'rgba(255,255,255,0)')
  gFlame.addColorStop(0.2, `rgba(255,240,120,${brightness * 0.9})`)
  gFlame.addColorStop(0.55, `rgba(255,140,20,${brightness * 0.95})`)
  gFlame.addColorStop(1, `rgba(200,60,0,${brightness * 0.7})`)
  ctx.fillStyle = gFlame
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x - size * 0.45, y - fh * 0.3, x + skew - size * 0.2, y - fh * 0.7, x + skew, y - fh)
  ctx.bezierCurveTo(x + skew + size * 0.2, y - fh * 0.7, x + size * 0.45, y - fh * 0.3, x, y)
  ctx.closePath()
  ctx.fill()

  // g. Flame core dot
  const coreY = y - fh * 0.25
  const gCore = ctx.createRadialGradient(x + skew * 0.3, coreY, 0, x + skew * 0.3, coreY, size * 0.5)
  gCore.addColorStop(0, `rgba(255,255,220,${brightness * 0.9})`)
  gCore.addColorStop(1, 'rgba(255,255,220,0)')
  ctx.fillStyle = gCore
  ctx.beginPath()
  ctx.arc(x + skew * 0.3, coreY, size * 0.5, 0, Math.PI * 2)
  ctx.fill()
}

export function initScene(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  let animId = 0
  let startTime = performance.now()

  // Initialize flicker data once
  const diayaFlickers = initFlickers(22)
  const rangoliAngle = [0, 0, 0, 0, 0]

  // Window glow positions for temple buildings (50 dots)
  const windowDots: [number, number][] = []
  for (let i = 0; i < 60; i++) {
    windowDots.push([(i * 73 % 100) / 100, (i * 37 % 60) / 100 + 0.3])
  }

  function resize(): void {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  function drawFrame(now: number): void {
    const time = (now - startTime) / 1000
    const W = canvas.width
    const H = canvas.height
    const scrollRatio: number = (window as unknown as Record<string, unknown>).__aanganScroll as number ?? 0

    ctx.clearRect(0, 0, W, H)

    // 2. SKY GRADIENT
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, 'hsl(260,60%,8%)')
    sky.addColorStop(0.45, 'hsl(30,70%,4%)')
    sky.addColorStop(1, 'hsl(25,80%,3%)')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // 3. HORIZON WARMTH
    const hWarmAlpha = 0.08 + scrollRatio * 0.15
    const hWarm = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.5)
    hWarm.addColorStop(0, `rgba(200,100,20,${hWarmAlpha})`)
    hWarm.addColorStop(1, 'rgba(200,100,20,0)')
    ctx.fillStyle = hWarm
    ctx.fillRect(0, 0, W, H)

    // 4. STARS
    ctx.save()
    ctx.translate(0, -scrollRatio * H * 0.06)
    for (let i = 0; i < STAR_DATA.length; i++) {
      const [fx, fy, r] = STAR_DATA[i]
      const sx = fx * W, sy = fy * H
      const twinkle = 0.5 + 0.5 * Math.sin(time * (0.5 + i * 0.13) + i)
      ctx.globalAlpha = 0.4 + 0.6 * twinkle
      ctx.fillStyle = `rgba(255,245,220,1)`
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.fill()
      if (r > 1.3) {
        ctx.strokeStyle = `rgba(255,245,220,${twinkle * 0.4})`
        ctx.lineWidth = 0.5
        const fl = r * 3
        ctx.beginPath()
        ctx.moveTo(sx - fl, sy); ctx.lineTo(sx + fl, sy)
        ctx.moveTo(sx, sy - fl); ctx.lineTo(sx, sy + fl)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
    ctx.restore()

    // 5. MOON
    const moonRadius = 30 + scrollRatio * 8
    const moonX = W * 0.5
    const moonY = H * 0.09 - scrollRatio * H * 0.04

    // Moon outer glow
    const gMoonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 5)
    gMoonGlow.addColorStop(0, 'rgba(255,230,100,0.15)')
    gMoonGlow.addColorStop(1, 'rgba(255,230,100,0)')
    ctx.fillStyle = gMoonGlow
    ctx.beginPath()
    ctx.arc(moonX, moonY, moonRadius * 5, 0, Math.PI * 2)
    ctx.fill()

    // Moon surface
    const gMoon = ctx.createRadialGradient(
      moonX - moonRadius * 0.3, moonY - moonRadius * 0.3, 0,
      moonX, moonY, moonRadius
    )
    gMoon.addColorStop(0, '#FFFAE0')
    gMoon.addColorStop(0.6, '#F0D060')
    gMoon.addColorStop(1, '#B88010')
    ctx.fillStyle = gMoon
    ctx.beginPath()
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
    ctx.fill()

    // 6. TEMPLE SHIKHARAS SILHOUETTE
    ctx.save()
    ctx.translate(0, scrollRatio * H * 0.04)
    const buildingColor = 'rgba(8,3,2,0.9)'

    // Left cluster (0 to W*0.30)
    ctx.fillStyle = buildingColor
    ctx.beginPath()
    ctx.moveTo(0, H)
    ctx.lineTo(0, H * 0.72)
    ctx.lineTo(W * 0.04, H * 0.72)
    ctx.lineTo(W * 0.04, H * 0.65)
    ctx.lineTo(W * 0.07, H * 0.65)
    ctx.lineTo(W * 0.07, H * 0.58)
    ctx.lineTo(W * 0.10, H * 0.58)
    ctx.lineTo(W * 0.10, H * 0.70)
    ctx.lineTo(W * 0.14, H * 0.70)
    ctx.lineTo(W * 0.14, H * 0.62)
    ctx.lineTo(W * 0.18, H * 0.62)
    ctx.lineTo(W * 0.18, H * 0.68)
    ctx.lineTo(W * 0.24, H * 0.68)
    ctx.lineTo(W * 0.24, H * 0.74)
    ctx.lineTo(W * 0.30, H * 0.74)
    ctx.lineTo(W * 0.30, H)
    ctx.closePath()
    ctx.fill()

    // Right cluster (W*0.70 to W)
    ctx.beginPath()
    ctx.moveTo(W * 0.70, H)
    ctx.lineTo(W * 0.70, H * 0.74)
    ctx.lineTo(W * 0.76, H * 0.74)
    ctx.lineTo(W * 0.76, H * 0.68)
    ctx.lineTo(W * 0.82, H * 0.68)
    ctx.lineTo(W * 0.82, H * 0.62)
    ctx.lineTo(W * 0.86, H * 0.62)
    ctx.lineTo(W * 0.86, H * 0.70)
    ctx.lineTo(W * 0.90, H * 0.70)
    ctx.lineTo(W * 0.90, H * 0.58)
    ctx.lineTo(W * 0.93, H * 0.58)
    ctx.lineTo(W * 0.93, H * 0.65)
    ctx.lineTo(W * 0.96, H * 0.65)
    ctx.lineTo(W * 0.96, H * 0.72)
    ctx.lineTo(W, H * 0.72)
    ctx.lineTo(W, H)
    ctx.closePath()
    ctx.fill()

    // Draw 4 shikharas
    const shikharaPositions = [W * 0.20, W * 0.38, W * 0.62, W * 0.80]
    const shikharaSizes = [
      { baseW: W * 0.06, h: H * 0.30, y: H * 0.68 },
      { baseW: W * 0.05, h: H * 0.25, y: H * 0.70 },
      { baseW: W * 0.05, h: H * 0.25, y: H * 0.70 },
      { baseW: W * 0.06, h: H * 0.30, y: H * 0.68 },
    ]
    shikharaPositions.forEach((cx, si) => {
      const { baseW, h, y } = shikharaSizes[si]
      const topY = y - h
      // Tiered body — 3 tiers narrowing upward
      for (let tier = 0; tier < 3; tier++) {
        const tw = baseW * (1 - tier * 0.25)
        const th = h * 0.22
        const ty = y - tier * h * 0.25 - th
        ctx.fillStyle = buildingColor
        ctx.fillRect(cx - tw / 2, ty, tw, th + 2)
      }
      // Spire (triangle)
      ctx.fillStyle = buildingColor
      ctx.beginPath()
      ctx.moveTo(cx - baseW * 0.25, topY + h * 0.25)
      ctx.lineTo(cx + baseW * 0.25, topY + h * 0.25)
      ctx.lineTo(cx, topY)
      ctx.closePath()
      ctx.fill()
      // Amalaka finial (small circle)
      ctx.beginPath()
      ctx.arc(cx, topY - 3, baseW * 0.07, 0, Math.PI * 2)
      ctx.fill()
    })

    // Warm window dots
    for (let wi = 0; wi < 60; wi++) {
      const [wfx, wfy] = windowDots[wi]
      // Only place in left or right building areas
      const inLeft = wfx < 0.30
      const inRight = wfx > 0.70
      if (!inLeft && !inRight) continue
      const wx = wfx * W
      const wy = wfy * H
      if (wy > H * 0.92) continue
      const wFlicker = 0.3 + 0.5 * Math.sin(time * (0.5 + wi * 0.07) + wi * 1.3)
      ctx.globalAlpha = wFlicker * 0.6
      ctx.fillStyle = `rgba(255,180,60,1)`
      ctx.beginPath()
      ctx.arc(wx, wy, 1.2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.restore()

    // 7. PERSPECTIVE STONE PATH
    const vx = W * 0.5, vy = H * 0.42
    for (let pi = 0; pi < 18; pi++) {
      const t = pi / 17
      const tE = Math.sqrt(t)
      const py = H + (vy - H) * tE
      if (py >= H) continue
      const pathW = W * 0.11 * (1 - tE * 0.9) + W * 0.008
      const pathH = H * 0.012 * (1 - tE * 0.7) + 2
      const stoneAlpha = 0.08 + 0.12 * (1 - tE)
      const gStone = ctx.createRadialGradient(vx, py, 0, vx, py, pathW)
      gStone.addColorStop(0, `rgba(200,160,100,${stoneAlpha * 1.5})`)
      gStone.addColorStop(1, `rgba(150,100,60,${stoneAlpha})`)
      ctx.fillStyle = gStone
      ctx.beginPath()
      ctx.ellipse(vx, py, pathW * 0.9, pathH * 0.35, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // 8. DIYA PAIRS
    ctx.save()
    ctx.translate(0, -scrollRatio * H * 0.28)
    for (let di = 0; di < 22; di++) {
      const t = di / 21
      const tE = Math.pow(t, 0.55)
      const dy = H + (vy - H) * tE
      const spread = W * 0.32 * (1 - tE * 0.95)
      const pathHalf = W * 0.12 * (1 - tE * 0.9) + W * 0.01
      const xLeft = vx - pathHalf - spread
      const xRight = vx + pathHalf + spread
      const size = Math.max(2, (18 + 8 * (1 - tE)) * (1 - tE * 0.65))
      const brightness = 0.55 + 0.45 * (1 - tE)
      if (dy > H + size * 2) continue
      drawDiya(ctx, xLeft, dy, size, brightness, diayaFlickers[di], time)
      drawDiya(ctx, xRight, dy, size, brightness, diayaFlickers[di], time)
    }
    ctx.restore()

    // 9. GROUND AMBIENT GLOW (drawn after restore so unclipped)
    for (let di = 0; di < 22; di++) {
      const t = di / 21
      const tE = Math.pow(t, 0.55)
      const dy = H + (vy - H) * tE - scrollRatio * H * 0.28
      const spread = W * 0.32 * (1 - tE * 0.95)
      const pathHalf = W * 0.12 * (1 - tE * 0.9) + W * 0.01
      const xLeft = vx - pathHalf - spread
      const xRight = vx + pathHalf + spread
      const size = Math.max(2, (18 + 8 * (1 - tE)) * (1 - tE * 0.65))
      const brightness = 0.55 + 0.45 * (1 - tE)
      if (dy > H + size * 2) continue
      for (const dx of [xLeft, xRight]) {
        const gGround = ctx.createRadialGradient(dx, dy + size * 0.5, 0, dx, dy + size * 0.5, size * 5)
        gGround.addColorStop(0, `rgba(255,150,30,${brightness * 0.15})`)
        gGround.addColorStop(1, 'rgba(255,150,30,0)')
        ctx.fillStyle = gGround
        ctx.beginPath()
        ctx.arc(dx, dy + size * 0.5, size * 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // 10. RANGOLI
    const rCenter = { x: W * 0.5, y: H * 0.52 }
    const rRadius = Math.min(W, H) * 0.065
    ctx.save()
    ctx.globalAlpha = 0.35 + scrollRatio * 0.3
    const ringColors = [
      ['rgba(200,72,0,0.9)', 'rgba(224,160,32,0.9)'],
      ['rgba(224,160,32,0.9)', 'rgba(200,72,0,0.9)'],
      ['rgba(180,60,0,0.8)', 'rgba(220,140,20,0.8)'],
      ['rgba(200,100,20,0.7)', 'rgba(200,72,0,0.7)'],
      ['rgba(224,160,32,0.6)', 'rgba(180,60,0,0.6)'],
    ]
    const dir = [1, -1, 1, -1, 1]
    for (let ring = 1; ring <= 5; ring++) {
      const rr = rRadius * (ring / 5)
      const dots = ring * 8
      rangoliAngle[ring - 1] += 0.003 * dir[ring - 1]
      const colors = ringColors[ring - 1]
      for (let d = 0; d < dots; d++) {
        const angle = rangoliAngle[ring - 1] + (d / dots) * Math.PI * 2
        const dx = rCenter.x + Math.cos(angle) * rr
        const dy = rCenter.y + Math.sin(angle) * rr
        ctx.fillStyle = colors[d % 2]
        ctx.beginPath()
        ctx.arc(dx, dy, Math.max(1, rRadius * 0.07 * (1 - ring * 0.08)), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()

    // Center diya in rangoli
    const centerDiyaSize = rRadius * 0.18
    drawDiya(ctx, rCenter.x, rCenter.y, centerDiyaSize, 0.9, { phase: 0.5, speed: 0.06 }, time)

    // 11. FLOOR GRADIENT OVERLAY
    const gFloor = ctx.createLinearGradient(0, H * 0.7, 0, H)
    gFloor.addColorStop(0, 'rgba(100,40,5,0)')
    gFloor.addColorStop(0.5, `rgba(100,40,5,${0.3 + scrollRatio * 0.2})`)
    gFloor.addColorStop(1, `rgba(30,10,2,${0.7 + scrollRatio * 0.15})`)
    ctx.fillStyle = gFloor
    ctx.fillRect(0, 0, W, H)

    // 12. VIGNETTE
    const gVig = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.2, W * 0.5, H * 0.5, H * 0.9)
    gVig.addColorStop(0, 'rgba(5,2,0,0)')
    gVig.addColorStop(1, `rgba(5,2,0,${0.55 + scrollRatio * 0.2})`)
    ctx.fillStyle = gVig
    ctx.fillRect(0, 0, W, H)

    animId = requestAnimationFrame(drawFrame)
  }

  animId = requestAnimationFrame(drawFrame)

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  }
}
