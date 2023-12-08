const scrollObjects = [
    {
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
        ],
        length: 5
    }
]

const frame = 10000
const animateList = []
let scrollItem = null

const openUrl = (url) => {
    // console.log(url)
    window.open(url, '_blank')
}

const start = () => {
    let totalLength = 0;
    const mainContainer = document.getElementById("main-scroll-align-container")
    const scrollAlign = document.createElement('div')
    scrollAlign.className = 'main-scroll-align'
    for (const container of scrollObjects) {
        for (const animate of container.animateList) {
            for (const x of animate.animate) x.offset /= (container.length - 1)
            const child = document.getElementById(animate.domId)
            const animation = child.animate(animate.animate, frame)
            animation.pause()
            animateList.push({
                animation: animation,
                startPos: totalLength,
                endPos: totalLength + container.length - 1
            })
        }
        const dom = document.getElementById(container.domId)
        dom.style.height = container.length + '00vh'
        for (let i = 0; i < container.length; i++) {
            scrollAlign.style.top = totalLength + '00vh'
            mainContainer.appendChild(scrollAlign.cloneNode())
            totalLength++;
        }
    }
}

const play = (animation, process) => {
    animation.currentTime = (() => {
        if (process <= 0) return 0;
        else if (process >= 1) return frame - 1
        return process * frame;
    })()
}

const scroll = () => {
    if (!scrollItem) return
    const cur = scrollItem.scrollTop / window.innerHeight
    for (const item of animateList) {
        play(item.animation, (cur - item.startPos) / (item.endPos - item.startPos))
    }
}

