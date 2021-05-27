gsap.registerPlugin(MorphSVGPlugin)

const tabbar = document.querySelector('#tabbar')
const button = tabbar.querySelector('li.add button')
const background = tabbar.querySelector('.background path')

if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    tabbar.classList.add('gooey')
}

button.addEventListener('pointerdown', e => {
    gsap.to(background, {
        duration: .2,
        morphSVG: 'M4 20.7494C4 16.0491 7.97587 12.3518 12.6596 12.7464C40.2067 15.0668 127.493 22 187 22C246.507 22 333.793 15.0668 361.34 12.7464C366.024 12.3518 370 16.0491 370 20.7494V68C370 101.137 343.137 128 310 128H64C30.8629 128 4 101.137 4 68V20.7494Z'
    })
    gsap.to(tabbar, {
        duration: .2,
        '--menu-icon-add-opacity': 1,
        '--menu-icon-move': 8
    })
})

button.addEventListener('pointerup', e => {
    button.classList.toggle('open')
    let open = button.classList.contains('open')
    gsap.to(background, {
        keyframes: [{
            duration: .1,
            morphSVG: 'M4 19.3148C4 15.1734 7.13446 11.7216 11.2611 11.3718C37.1256 9.17938 126.446 2 187 2C247.554 2 336.874 9.17938 362.739 11.3718C366.866 11.7216 370 15.1734 370 19.3148V68C370 101.137 343.137 128 310 128H64C30.8629 128 4 101.137 4 68V19.3148Z'
        }, {
            duration: .7,
            delay: .05,
            morphSVG: 'M4 20C4 15.5817 7.55339 12 11.9717 12C38.7242 12 126.989 12 187 12C247.011 12 335.276 12 362.028 12C366.447 12 370 15.5817 370 20V68C370 101.137 343.137 128 310 128H64C30.8629 128 4 101.137 4 68V20Z',
            ease: 'elastic.out(1, .5)'
        }]
    })
    gsap.to(tabbar, {
        duration: .3,
        '--menu-icon-add-opacity': 0,
        '--menu-icon-rotate': open ? 45 : 90,
        onComplete() {
            if(!open) {
                gsap.set(tabbar, {
                    '--menu-icon-rotate': 0
                })
            }
        }
    })
    gsap.to(tabbar, {
        duration: .8,
        ease: 'elastic.out(1, .5)',
        '--menu-icon-move': 0
    })
    gsap.to(tabbar, {
        duration: open ? .6 : .3,
        ease: open ? 'elastic.out(1, .75)' : 'power1.out',
        '--options-y': open ? -112 : 16
    })
    gsap.to(tabbar, {
        duration: open ? .6 : .3,
        delay: .05,
        ease: open ? 'elastic.out(1, .75)' : 'power1.out',
        '--options-middle-y': open ? -112 : 16
    })
    gsap.to(tabbar, {
        '--options-opacity': open ? 1 : 0,
        duration: open ? .5 : .25
    })
})
