const scrollObjects = [{
    domId: "home",
    animateList: [
        {
            animate: [
                {
                    top: '50vh',
                    left: '50vw',
                    width: '30vh',
                    height: '30vh',
                    offset: 0
                },
                {
                    top: '20vh',
                    left: '50vw',
                    width: '20vh',
                    height: '20vh',
                    offset: 1
                },
                {
                    top: '20vh',
                    left: '50vw',
                    width: '20vh',
                    height: '20vh',
                    offset: 3
                },
                {
                    top: '40vh',
                    left: '20vw',
                    width: '20vh',
                    height: '20vh',
                    offset: 4
                },
            ],
            domId: "avatar"
        },
        {
            animate: [
                {
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '50vh',
                    left: '-15vh',
                    fontSize: '2rem',
                    fontWeight: '900',
                    offset: 3
                },
                {
                    opacity: 1,
                    pointerEvents: 'auto',
                    width: '50vh',
                    left: '-15vh',
                    fontSize: '2rem',
                    fontWeight: '900',
                    offset: 4
                },
            ],
            domId: "avatar-name",
        },
        {
            animate: [
                {
                    bottom: '10vh',
                    opacity: 0,
                    fontSize: '1rem',
                    offset: 0
                },
                {
                    bottom: '50vh',
                    opacity: 1,
                    fontSize: '3rem',
                    offset: 1
                },
                {
                    bottom: '10vh',
                    opacity: 0,
                    fontSize: '1rem',
                    offset: 2
                }
            ],
            domId: "home-title-1"
        },
        {
            animate: [
                {
                    bottom: '10vh',
                    opacity: 0,
                    fontSize: '1rem',
                    offset: 1
                },
                {
                    bottom: '50vh',
                    opacity: 1,
                    fontSize: '3rem',
                    offset: 2
                },
                {
                    bottom: '10vh',
                    opacity: 0,
                    fontSize: '1rem',
                    offset: 3
                }
            ],
            domId: "home-title-2"
        },
        {
            animate: [
                {
                    bottom: '10vh',
                    opacity: 0,
                    fontSize: '1rem',
                    offset: 2
                },
                {
                    bottom: '50vh',
                    opacity: 1,
                    fontSize: '3rem',
                    offset: 3
                },
                {
                    bottom: '10vh',
                    opacity: 0,
                    fontSize: '1rem',
                    offset: 4
                }
            ],
            domId: "home-title-3"
        },
        {
            animate: [
                {
                    paddingLeft: '10vw',
                    opacity: 0,
                    offset: 3
                },
                {
                    paddingLeft: '0',
                    opacity: 1,
                    offset: 4
                },
            ],
            domId: "intro-1",
        },
        {
            animate: [
                {
                    paddingLeft: '13vw',
                    opacity: 0,
                    offset: 3
                },
                {
                    paddingLeft: '0',
                    opacity: 1,
                    offset: 4
                },
            ],
            domId: "intro-2",
        },
        {
            animate: [
                {
                    paddingLeft: '16vw',
                    opacity: 0,
                    offset: 3
                },
                {
                    paddingLeft: '0',
                    opacity: 1,
                    offset: 4
                },
            ],
            domId: "intro-3",
        },
        {
            animate: [
                {
                    paddingLeft: '19vw',
                    opacity: 0,
                    offset: 3
                },
                {
                    paddingLeft: '0',
                    opacity: 1,
                    offset: 4
                },
            ],
            domId: "intro-4",
        },
        {
            animate: [
                {
                    paddingLeft: '22vw',
                    opacity: 0,
                    offset: 3
                },
                {
                    paddingLeft: '0',
                    opacity: 1,
                    offset: 4
                },
            ],
            domId: "intro-5",
        },
    ],
    length: 4
}, {
    domId: "project",
    animateList: [],
    length: 1
}]

const totalFrame = 10000
const animateList = []
const playTime = 1
let bg = null
let maxLength = 0
let onScroll = false
let from = 0
let to = 0
let frame = 0

const openUrl = (url) => {
    window.open(url, '_blank')
}

const start = () => {
    bg = document.getElementById("bg");
    for (const animate of scrollObjects) {
        maxLength += animate.length
        const container = document.getElementById(animate.domId)
        container.style.height = (animate.length + 1) + '00vh'
        for (const item of animate.animateList) {
            let start = 1000000, end = 0
            for (const x of item.animate) {
                end = Math.max(end, x.offset)
                start = Math.min(start, x.offset)
            }
            for (const x of item.animate) x.offset = (x.offset - start) / (end - start)
            const child = document.getElementById(item.domId)
            const animation = child.animate(item.animate, totalFrame)
            animation.currentTime = 0
            animation.pause()
            animateList.push({
                animation: animation,
                start: start,
                length: end - start
            })
        }
    }
}

const play = (process) => {
    for (const item of animateList) {
        item.animation.currentTime = clamp((process - item.start) / item.length * totalFrame, 0, totalFrame - 1)
    }
    window.scrollTo({ top: bg.offsetHeight * process })
}

const scroll = (event) => {
    if (onScroll || event.deltaY === 0) return
    from = to
    frame = 0
    if (event.deltaY > 0) to = from + 1
    else to = from - 1
    to = clamp(to, 0, maxLength)
    if (from !== to) onScroll = true
}

const clampPlay = () => {
    if (!onScroll) return
    frame = clamp(frame + playTime, 0, 100)
    onScroll = frame !== 100
    const f = frame / 100
    const tmp = 1 - Math.pow(1 - f, 4)
    const value = from * (1 - tmp) + to * tmp
    play(value)
}

const clamp = (v, l, r) => {
    if (v < l) return l
    if (v > r) return r
    return v
}