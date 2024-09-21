const scrollObjects = [
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
                offset: 0
            },
            {
                opacity: 0,
                pointerEvents: 'none',
                width: '50vh',
                left: '-15vh',
                fontSize: '2rem',
                fontWeight: '900',
                offset: 1
            },
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
            },
            {
                bottom: '10vh',
                opacity: 0,
                fontSize: '1rem',
                offset: 4
            },
        ],
        domId: "home-title-1"
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
            },
            {
                bottom: '10vh',
                opacity: 0,
                fontSize: '1rem',
                offset: 4
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
                offset: 0
            },
            {
                bottom: '10vh',
                opacity: 0,
                fontSize: '1rem',
                offset: 1
            },
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
                offset: 0
            },
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
                offset: 0
            },
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
                offset: 0
            },
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
                offset: 0
            },
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
                offset: 0
            },
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
]

const totalFrame = 10000
const animateList = []
const playTime = 1
let maxLength = 0
let onScroll = false
let from = 0
let to = 0
let frame = 0

const openUrl = (url) => {
    // console.log(url)
    window.open(url, '_blank')
}

const start = () => {
    for (const animate of scrollObjects) for (const x of animate.animate)
        maxLength = Math.max(maxLength, x.offset)

    for (const animate of scrollObjects) {
        for (const x of animate.animate) x.offset /= 4
        const child = document.getElementById(animate.domId)
        const animation = child.animate(animate.animate, totalFrame)
        animation.pause()
        animateList.push({
            animation: animation,
            startPos: 0,
            endPos: maxLength
        })
    }
}

const play = (animation, process) => {
    animation.currentTime = (() => {
        return clamp(process * totalFrame, 0, totalFrame - 1)
    })()
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
    for (const item of animateList) {
        play(item.animation, (value - item.startPos) / (item.endPos - item.startPos))
    }
}

const clamp = (v, l, r) => {
    if (v < l) return l
    if (v > r) return r
    return v
}